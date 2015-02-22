'use strict';

angular.module('ytApp').controller('youtubePlayerController', [ '$scope', 'dataService',function ($scope, dataService) {
  $scope.playlistAry = [];

  function getPlaylistData(){
    $scope.playlistAry = dataService.getPlaylistData();
    $scope.currentPlaylist = $scope.playlistAry[0];
    $scope.selectedPlaylist = $scope.playlistAry[0];
  }

  $scope.loadAndPlayPlaylist = function (playlist) {
    if($scope.ytPlayer.loadAndPlayPlaylist && typeof $scope.ytPlayer.loadAndPlayPlaylist === 'function'){
      $scope.ytPlayer.loadAndPlayPlaylist(playlist);
      $scope.currentPlaylist = playlist;
    }
  };

  $scope.loadAndPlaySong = function (playlist, index) {
    if ($scope.ytPlayer.loadAndPlaySong && typeof $scope.ytPlayer.loadAndPlaySong === 'function') {
      $scope.ytPlayer.loadAndPlaySong(playlist, index);
      $scope.currentPlaylist = playlist;
    }
  };

  $scope.loadPlaylist = function(playlist){
    $scope.selectedPlaylist = playlist;
  };

  function pageLoad(){
    getPlaylistData();
  }

  pageLoad();
}]);
