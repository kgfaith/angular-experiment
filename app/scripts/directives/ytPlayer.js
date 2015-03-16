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
      var currentPlaylist = {};
      $scope.isShuffle = false;
      $scope.isRepeat = false;
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
        }else {
          $scope.player.playVideo();
        }
      };

      $scope.toggleShuffle = function(){
        if($scope.player){
          $scope.player.isShuffle = !$scope.player.isShuffle;
        }
      };

      $scope.toggleRepeat = function(){
        if($scope.player) {
          $scope.player.isRepeat = !$scope.player.isRepeat;
        }
      };

      $scope.$on(eventPrefix + 'ready', function (event, data) {
        $scope.customPlayer = $scope.player;

      });

      $scope.$on(eventPrefix + 'queued', function (event, data) {
        var videoUrl = $scope.player.getVideoUrl();
        var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
        var videoObj = _.find($scope.playlist.playlist, function(item, index){
          item.videoIndex = index;
          return item.videoId === videoId;
        });
        $scope.currentSong = videoObj;
        setPlayerDataForSong($scope.currentSong);
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
        var videoUrl = $scope.player.getVideoUrl();
        var videoId = youtubeEmbedUtils.getIdFromURL(videoUrl);
        if($scope.currentSong){
          $scope.currentSong.currentlyPlaying = false;
        }
        currentPlaylist.currentlyPlayed = false;

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
        currentPlaylist = $scope.playlist;
        currentPlaylist.currentlyPlayed = true;
      }

      function setPlayerDataForSong(currentSong){
        var songLength = $scope.player.getDuration();
        $scope.currentlyPlayingSongInfo.name = currentSong.name;
        $scope.currentlyPlayingSongInfo.artistName = currentSong.artistName;
        $scope.currentlyPlayingSongInfo.videoDuration = songLength;
        $scope.sliderOptions.max = songLength;
      }

      function setupVideoTimerInterval(){
        $scope.stopInterval = $interval(function() {
          if(!$scope.sliderInfo.sliderOnOneSecondWait) {
            $scope.currentlyPlayingSongInfo.currentTime = $scope.player.getCurrentTime();
            $scope.currentlyPlayingSongInfo.DurationLeft = $scope.currentlyPlayingSongInfo.videoDuration -
            $scope.currentlyPlayingSongInfo.currentTime;
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

      /*$scope.$watch('isShuffle', function (newValue) {
        $scope.player.setShuffle(newValue);
      });

      $scope.$watch('isRepeat', function (newValue) {
        $scope.player.setLoop(newValue);
      });*/




      String.prototype.toHHMMSS = function () {
        var sec_num = parseInt(this, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        /*if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}*/
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = '';
        if(hours < 1){
          time = minutes+':'+seconds;
        }else{
          time = hours+':'+minutes+':'+seconds;
        }

        return time;
      }
    }
  };
}]);
