'use strict';

angular.module('ytApp').controller('youtubePlayerController', [ '$scope', 'dataService',function ($scope, dataService) {
  $scope.playlistAry = [];

  function getPlaylistData(){
    $scope.playlistAry = dataService.getPlaylistData();
    $scope.currentPlaylist = $scope.playlistAry[0];
    $scope.selectedPlaylist = $scope.playlistAry[0];
  }

  $scope.loadAndPlayPlaylist = function (playlist) {
    if($scope.ytPlayer && $scope.ytPlayer.currentState == 'paused'){
      $scope.ytPlayer.playVideo();
      return;
    }

    if($scope.ytPlayer.loadAndPlayPlaylist && typeof $scope.ytPlayer.loadAndPlayPlaylist === 'function'){
      $scope.ytPlayer.loadAndPlayPlaylist(playlist);
      updateCurrentPlaylistStatus(playlist)
    }
  };

  $scope.loadAndPlaySong = function (playlist, index) {
    if ($scope.ytPlayer.loadAndPlaySong && typeof $scope.ytPlayer.loadAndPlaySong === 'function') {
      $scope.ytPlayer.loadAndPlaySong(playlist, index);
      updateCurrentPlaylistStatus(playlist)
    }
  };

  $scope.loadPlaylist = function(playlist){
    $scope.selectedPlaylist = playlist;
  };

  $scope.pauseCurrentSong = function () {
    if ($scope.ytPlayer.pauseVideo && typeof $scope.ytPlayer.pauseVideo === 'function') {
      $scope.ytPlayer.pauseVideo();
    }
  };

  function updateCurrentPlaylistStatus(newPlaylist){
    if($scope.currentPlaylist){
      $scope.currentPlaylist.currentlyPlaying = false;
      $scope.currentPlaylist = newPlaylist;
    }
  }

  function pageLoad(){
    getPlaylistData();
  }

  pageLoad();
}]);
