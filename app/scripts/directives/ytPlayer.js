angular.module("ytApp").directive('ytPlayer',['$http', 'youtubeEmbedUtils',
  '$interval',
  function ($http, youtubeEmbedUtils, $interval) {
  // from YT.PlayerState
  var stateNames = {
    'unstarted' : 'unstarted',
    'ended' : 'ended',
    'playing' : 'playing',
    'paused' : 'paused',
    'buffering' : 'buffering',
    'queued' : 'queued'
  };
  return {
    restrict: 'E',
    templateUrl: 'views/templates/ytPlayer.html',
    replace: true,
    scope: {
      videoId: '=?',
      videoUrl: '=?',
      customPlayer: '=?',
      playlist: '=?'
    },
    link: function ($scope, element, attrs) {
      $scope.playButtonText = 'Play';
      $scope.currentlyPlayingSong = {};
      var eventPrefix = 'youtube.player.';

      $scope.backward = function() {
        $scope.player.previousVideo();
      };

      $scope.forward = function() {
        $scope.player.nextVideo();
      };

      $scope.playPause = function() {
        if($scope.player.currentState == stateNames.playing){
          $scope.player.pauseVideo();
          $scope.playButtonText = 'Pause';
        }else {
          $scope.player.playVideo();
          $scope.playButtonText = 'Play';
        }
      };

      $scope.$on(eventPrefix + 'ready', function (event, data) {
        $scope.customPlayer = $scope.player;

      });

      $scope.$on(eventPrefix + 'playing', function (event, data) {
        getCurrentVideoInfo();
        setupVideoTimerInterval();
      });

      function getCurrentVideoInfo(){
        var videoUrl = $scope.player.getVideoUrl();
        var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
        var videoObj = _.find($scope.playlist.playlist, function(item){
          return item.videoId === videoId;
        });
        $scope.currentlyPlayingSong = {
          name: videoObj.name,
          videoDuration: $scope.player.getDuration()
        }
      }

      function setupVideoTimerInterval(){
        $scope.stopInterval = $interval(function() {
          $scope.currentlyPlayingSong.currentTime = Math.round($scope.player.getCurrentTime());
        }, 500);
      }

      $http.get('http://gdata.youtube.com/feeds/api/videos/by2rM3932rM?v=2&alt=json').
        success(function(data, status, headers, config) {
          // this callback will be called asynchronously
          // when the response is available
        }).
        error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });

      function setupCustomPlaylist(){
        $scope.playerVars = {
          customPlaylist : $scope.playlist.playlist
        };
      }
      setupCustomPlaylist();
    }
  };
}]);
