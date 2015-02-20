'use strict';

angular.module('ytApp').controller('youtubePlayerController', [ '$scope', 'dataService',function ($scope, dataService) {
  $scope.something = 'M17x_xH7A_w';
  $scope.playlistAry = [];

  function getPlaylistData(){
    $scope.playlistAry = dataService.getPlaylistData();
    $scope.currentPlaylist = $scope.playlistAry[1];
  }

  $scope.loadPlaylist = function(playlist){
    $scope.currentPlaylist = playlist;
  };

  function pageLoad(){
    getPlaylistData();
  }

  pageLoad();
}]);
