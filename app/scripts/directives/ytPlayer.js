angular.module("ytApp").directive('ytPlayer',['$http', 'youtubeEmbedUtils',
  '$interval', '$timeout',
  function ($http, youtubeEmbedUtils, $interval, $timeout) {
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
      $scope.currentlyPlayingSongInfo = {};
      $scope.currentSong = null;
      $scope.sliderOptions = {
        orientation: 'horizontal',
        min: 0,
        max: 0,
        range: 'min',
        slide: refreshPlayPosition
      };
      $scope.sliderInfo = {
        sliderOnOneSecondWait : false,
        sliderPositionToChange: null
      };
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

      $scope.$on(eventPrefix + 'paused', function (event, data) {
        if($scope.currentSong){
          $scope.currentSong.currentlyPlaying = false;
          $scope.playlist.currentlyPlaying = false;
        }
      });

      function getCurrentVideoInfo(){
        console.log('Invoked');
        var videoUrl = $scope.player.getVideoUrl();
        var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
        if($scope.currentSong){
          $scope.currentSong.currentlyPlaying = false;
        }
        var videoObj = _.find($scope.playlist.playlist, function(item, index){
          item.videoIndex = index;
          if(item.videoId === videoId){
            item.currentlyPlaying = true;
          }else{
            item.currentlyPlaying = false;
          }
          return item.videoId === videoId;
        });
        $scope.currentSong = videoObj;
        setPlayerDataForSong($scope.currentSong);
        $scope.playlist.currentlyPlaying = true;
      }

      function setPlayerDataForSong(currentSong){
        var songLength = $scope.player.getDuration();
        $scope.currentlyPlayingSongInfo.name = currentSong.name;
        $scope.currentlyPlayingSongInfo.videoDuration = songLength;
        $scope.sliderOptions.max = songLength;
      }

      function setupVideoTimerInterval(){
        $scope.stopInterval = $interval(function() {
          if(!$scope.sliderInfo.sliderOnOneSecondWait) {
            $scope.currentlyPlayingSongInfo.currentTime = Math.round($scope.player.getCurrentTime());
          }
        }, 500);
      }

      function refreshPlayPosition(){
        $scope.sliderInfo.sliderPositionToChange = $scope.currentlyPlayingSongInfo.currentTime;
        if(!$scope.sliderInfo.sliderOnOneSecondWait){
          $scope.sliderInfo.sliderOnOneSecondWait = true;
          $timeout(function() {
            if($scope.player){
              $scope.currentlyPlayingSongInfo.currentTime = $scope.sliderInfo.sliderPositionToChange;
              $scope.player.loadAndPlaySongWithStartSecond($scope.playlist, $scope.currentSong.videoIndex,
                $scope.currentlyPlayingSongInfo.currentTime);
            }
            $scope.sliderInfo.sliderOnOneSecondWait = false;
          }, 1000);
          return;
        }
      }

      function setupCustomPlaylist(){
        $scope.playerVars = {
          customPlaylist : $scope.playlist.playlist
        };
      }
      setupCustomPlaylist();
    }
  };
}]);
