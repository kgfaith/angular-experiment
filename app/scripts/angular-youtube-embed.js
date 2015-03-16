/* global YT */
angular.module('youtube-embed', ['ng'])
  .service('youtubeEmbedUtils', ['$window', '$rootScope', function ($window, $rootScope) {
  var Service = {}

  // adapted from http://stackoverflow.com/a/5831191/1614967
  var youtubeRegexp = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
  var timeRegexp = /t=(\d+)[ms]?(\d+)?s?/;

  function contains(str, substr) {
    return (str.indexOf(substr) > -1);
  }

  Service.getIdFromURL = function getIdFromURL(url) {
    var id = url.replace(youtubeRegexp, '$1');

    if (contains(id, ';')) {
      var pieces = id.split(';');

      if (contains(pieces[1], '%')) {
        // links like this:
        // "http://www.youtube.com/attribution_link?a=pxa6goHqzaA&amp;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare"
        // have the real query string URI encoded behind a ';'.
        // at this point, `id is 'pxa6goHqzaA;u=%2Fwatch%3Fv%3DdPdgx30w9sU%26feature%3Dshare'
        var uriComponent = decodeURIComponent(id.split(';')[1]);
        id = ('http://youtube.com' + uriComponent)
          .replace(youtubeRegexp, '$1');
      } else {
        // https://www.youtube.com/watch?v=VbNF9X1waSc&amp;feature=youtu.be
        // `id` looks like 'VbNF9X1waSc;feature=youtu.be' currently.
        // strip the ';feature=youtu.be'
        id = pieces[0];
      }
    } else if (contains(id, '#')) {
      // id might look like '93LvTKF_jW0#t=1'
      // and we want '93LvTKF_jW0'
      id = id.split('#')[0];
    }

    return id;
  };

  Service.getTimeFromURL = function getTimeFromURL(url) {
    url = url || '';

    // t=4m20s
    // returns ['t=4m20s', '4', '20']
    // t=46s
    // returns ['t=46s', '46']
    // t=46
    // returns ['t=46', '46']
    var times = url.match(timeRegexp);

    if (!times) {
      // zero seconds
      return 0;
    }

    // assume the first
    var full = times[0],
      minutes = times[1],
      seconds = times[2];

    // t=4m20s
    if (typeof seconds !== 'undefined') {
      seconds = parseInt(seconds, 10);
      minutes = parseInt(minutes, 10);

      // t=4m
    } else if (contains(full, 'm')) {
      minutes = parseInt(minutes, 10);
      seconds = 0;

      // t=4s
      // t=4
    } else {
      seconds = parseInt(minutes, 10);
      minutes = 0;
    }

    // in seconds
    return seconds + (minutes * 60);
  };

  // Inject YouTube's iFrame API
  (function () {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }());

  Service.ready = false;

  // Youtube callback when API is ready
  $window.onYouTubeIframeAPIReady = function () {
    $rootScope.$apply(function () {
      Service.ready = true;
    });
  };

  return Service;
}])
  .directive('youtubeVideo', ['youtubeEmbedUtils', '$interval', function (youtubeEmbedUtils,
    $interval) {
    var uniqId = 1;

    // from YT.PlayerState
    var stateNames = {
      '-1': 'unstarted',
      0: 'ended',
      1: 'playing',
      2: 'paused',
      3: 'buffering',
      5: 'queued'
    };

    var eventPrefix = 'youtube.player.';

    return {
      restrict: 'EA',
      scope: {
        videoId: '=?',
        videoUrl: '=?',
        player: '=?',
        playerVars: '=?',
        playerHeight: '=?',
        playerWidth: '=?'
      },
      link: function (scope, element, attrs) {
        // allows us to $watch `ready`
        scope.utils = youtubeEmbedUtils;

        // player-id attr > id attr > directive-generated ID
        var playerId = attrs.playerId || element[0].id || 'unique-youtube-embed-id-' + uniqId++;
        element[0].id = playerId;

        // Attach to element
        scope.playerHeight = scope.playerHeight || 390;
        scope.playerWidth = scope.playerWidth || 640;
        scope.playerVars = scope.playerVars || {};

        // YT calls callbacks outside of digest cycle
        function applyBroadcast() {
          var args = Array.prototype.slice.call(arguments);
          scope.$apply(function () {
            scope.$emit.apply(scope, args);
          });
        }

        function onPlayerStateChange(event) {
          var state = stateNames[event.data];
          if (typeof state !== 'undefined') {
            console.log(eventPrefix + state);
            applyBroadcast(eventPrefix + state, scope.player, event);
          }
          scope.$apply(function () {
            scope.player.currentState = state;
          });
        }

        function getVideoIdList(customPlaylist) {
          return _.map(customPlaylist, function(item){
            return item.videoId;
          });
        }

        function setupPlayerDefaults(player) {
          player.loadAndPlayPlaylist = loadAndPlayPlaylist;
          player.loadAndPlaySong = loadAndPlaySong;
          player.loadAndPlaySongWithStartSecond = loadAndPlaySongWithStartSecond;
          player.isShuffle = false;
          player.isRepeat = false;
        }

        function onPlayerReady(event) {
          scope.player.abPlayerReady = true;
          if (scope.playerVars.customPlaylist) {
            var videoIds = getVideoIdList(scope.playerVars.customPlaylist);
            scope.player.cuePlaylist(videoIds, 0, 0, 'medium')
          }
          setupPlayerDefaults(scope.player);
          applyBroadcast(eventPrefix + 'ready', scope.player, event);
        }

        function loadAndPlayPlaylist(playlist){
          loadAndPlaySong(playlist, 0);
        }

        function loadAndPlaySong(playlist, index){
          loadAndPlaySongWithStartSecond(playlist, index, 0);
        }

        function loadAndPlaySongWithStartSecond(playlist, index, startSecond){
          if(playlist && scope.player.loadPlaylist && typeof scope.player.loadPlaylist == 'function'){
            var videoIds = getVideoIdList(playlist.playlist);
            scope.player.loadPlaylist(videoIds, index, startSecond, 'medium');
            scope.playerJustLoaded = true;
          }
        }

        scope.$watch('player.isShuffle', function (newValue) {
          if (scope.player && scope.player.setShuffle &&
            typeof scope.player.setShuffle === 'function') {
            scope.player.setShuffle(newValue);
            console.log('scope.player.setShuffle(' + scope.player.isShuffle + ');');

          }
        });

        scope.$watch('player.isRepeat', function (newValue) {
          if (scope.player && scope.player.setLoop &&
            typeof scope.player.setLoop === 'function') {
            scope.player.setLoop(newValue);
            console.log('scope.player.setLoop(' + scope.player.isRepeat + ');');

          }
        });

        scope.$on(eventPrefix + 'playing', function (event, data) {
          if(scope.playerJustLoaded === true) {
            scope.playerJustLoaded = false;
            scope.player.setShuffle(scope.player.isShuffle);
            console.log('scope.player.setShuffle(' + scope.player.isShuffle + ');');
            scope.player.setLoop(scope.player.isRepeat);
            console.log('scope.player.setLoop(' + scope.player.isRepeat + ');');
            console.log('====================');
          }
        });

        function createPlayer() {
          var player = new YT.Player(playerId, {
            height: scope.playerHeight,
            width: scope.playerWidth,
            videoId: scope.videoId,
            playerVars: setupDefaultPlayerVar(),
            events: {
              onReady: onPlayerReady,
              onStateChange: onPlayerStateChange
            }
          });

          player.id = playerId;
          return player;
        }

        function setupDefaultPlayerVar(){
          var playerVars = angular.copy(scope.playerVars);
          playerVars.controls = 0;
          playerVars.modestbranding = 0;
          playerVars.showinfo = 0;
          playerVars.start = playerVars.start || scope.urlStartTime;
          return playerVars;
        }

        function loadPlayer() {
          if (scope.videoId || scope.playerVars.list || scope.playerVars.customPlaylist) {
            if (scope.player && scope.player.destroy &&
              typeof scope.player.destroy === 'function') {
              scope.player.destroy();
            }

            scope.player = createPlayer();
          }
        };

        var stopWatchingReady = scope.$watch(
          function () {
            return scope.utils.ready
                // Wait until one of them is defined...
              && (typeof scope.videoUrl !== 'undefined'
              || typeof scope.videoId !== 'undefined'
              || typeof scope.playerVars.list !== 'undefined'
              || typeof scope.playerVars.customPlaylist !== 'undefined');
          },
          function (ready) {
            if (ready) {
              stopWatchingReady();

              // URL takes first priority
              if (typeof scope.videoUrl !== 'undefined') {
                scope.$watch('videoUrl', function (url) {
                  scope.videoId = scope.utils.getIdFromURL(url);
                  scope.urlStartTime = scope.utils.getTimeFromURL(url);

                  loadPlayer();
                });

                // then, a video ID
              } else if (typeof scope.videoId !== 'undefined') {
                scope.$watch('videoId', function () {
                  scope.urlStartTime = null;
                  loadPlayer();
                });

                // finally, a list
              } else {
                scope.$watch('playerVars.list', function () {
                  scope.urlStartTime = null;
                  loadPlayer();
                });
              }
            }
          });

        scope.$watchCollection(['playerHeight', 'playerWidth'], function () {
          if (scope.player) {
            scope.player.setSize(scope.playerWidth, scope.playerHeight);
          }
        });

        scope.$on('$destroy', function () {
          scope.player && scope.player.destroy();
        });
      }
    };
  }]);
