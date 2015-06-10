'use strict';

angular.module('ytApp').controller('youtubePlayerController',
    ['$scope', 'dataService', '$modal', 'youtubeEmbedUtils',
    'youtubeDataApiService', 'utilityService',
    function ($scope, dataService, $modal, youtubeEmbedUtils,
              youtubeDataApiService, utilityService) {

        $scope.playlistAry = [];
        $scope.alerts = [];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        function getPlaylistData() {
            $scope.playlistAry = dataService.getPlaylistData();
            $scope.currentPlaylist = _.find($scope.playlistAry, function (item) {
                return item.isSelectedPlaylist === true;
            });
            $scope.selectedPlaylist = {};
            $scope.loadPlaylist($scope.currentPlaylist);
        }

        $scope.loadAndPlayPlaylist = function (playlist) {
            if ($scope.ytPlayer && $scope.ytPlayer.currentState == 'paused') {
                $scope.ytPlayer.playVideo();
                return;
            }

            if ($scope.ytPlayer.loadAndPlayPlaylist && typeof $scope.ytPlayer.loadAndPlayPlaylist === 'function') {
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

        $scope.loadPlaylist = function (playlist) {
            $scope.selectedPlaylist.isSelectedPlaylist = false;
            playlist.isSelectedPlaylist = true;
            $scope.selectedPlaylist = playlist;
        };

        $scope.pauseCurrentSong = function () {
            if ($scope.ytPlayer.pauseVideo && typeof $scope.ytPlayer.pauseVideo === 'function') {
                $scope.ytPlayer.pauseVideo();
            }
        };

        $scope.playOrPause = function (playlist) {
            if (!playlist.currentlyPlaying && playlist.currentlyPlayed) {
                $scope.ytPlayer.playVideo();
            } else if (!playlist.currentlyPlaying && !playlist.currentlyPlayed) {
                $scope.loadAndPlaySong(playlist, 0);
            } else {
                $scope.ytPlayer.pauseVideo();
            }
        };

        $scope.openAddSongModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addNewSong.html',
                controller: EditSongModalCtrl,
                windowClass: 'add-new-song-modal',
                resolve: {
                    song: function () {
                        return null;
                    },
                    editingSong: function () {
                        return false;
                    },
                    youtubeEmbedUtils: function () {
                        return youtubeEmbedUtils;
                    },
                    youtubeDataApiService: function () {
                        return youtubeDataApiService;
                    },
                    utilityService: function () {
                        return utilityService;
                    }
                }
            });

            modalInstance.result.then(function (song) {
                addNewSong(song);
            }, function () {
                //cancel click handler
            });
        };

        function updateCurrentPlaylistStatus(newPlaylist) {
            if ($scope.currentPlaylist) {
                $scope.currentPlaylist.currentlyPlaying = false;
                $scope.currentPlaylist = newPlaylist;
            }
        }

        function pageLoad() {
            getPlaylistData();
        }

        function showMessageAlert(message) {
            $scope.alerts = [];
            $scope.alerts.push(message);
        }

        function addNewSong(song) {
            if (song.isValidSong === true && _.isObject($scope.currentPlaylist)) {
                var newSong = {
                    name: song.songName,
                    artistName: song.artistName,
                    videoId: song.songId,
                    duration: song.duration
                };
                $scope.selectedPlaylist.playlist.push(newSong);
				dataService.addSongToPlaylist($scope.selectedPlaylist.id, newSong);
                if (angular.equals($scope.selectedPlaylist, $scope.currentPlaylist)) {
                    $scope.currentPlaylist.reloadNeeded = true;
                }
                showMessageAlert({type: "success", msg: 'New song is added.'});

            }else{
                showMessageAlert({type: "danger", msg: 'Error adding new song.'});
            }
        }
        pageLoad();
    }]);

var EditSongModalCtrl = function ($scope, $modalInstance, song,
                                  editingSong, youtubeEmbedUtils, youtubeDataApiService, utilityService) {
    $scope.isUrlLoaded = false;

    $scope.editingSong = editingSong;
    $scope.saveText = editingSong ? 'Edit' : 'Add New';
    $scope.ok = function (userForm) {
        if (userForm.$valid) {
            $modalInstance.close($scope.song);
        }
    };

    function loadVideoDetailIntoForm(result) {
        if (_.isObject(result) && _.isObject(result.pageInfo) && result.pageInfo.totalResults == 1) {
            var videoData = result.items[0];
            $scope.song.songName = videoData.snippet.title;
            $scope.song.duration = formatDurationInHhmmss(videoData.contentDetails.duration);
            $scope.song.videoThumbUrl = videoData.snippet.thumbnails.medium.url;
            $scope.song.songId = videoData.id;
            $scope.song.isValidSong = true;
            $scope.isUrlLoaded = true;
        }else{
            $scope.song.isValidSong = false;
        }
    }

    function failYoutubeApiCall() {
        $scope.song.isValidSong = false;
    }

    function formatDurationInHhmmss(duration) {
        var miliSecondValue = utilityService.convertYoutubeDurationString(duration);
        return utilityService.convertMiliSecondToHhmmss(miliSecondValue);
    }

    $scope.checkYoutubeUrl = function (url) {
        var songId = youtubeEmbedUtils.getIdFromURL(url);
        var promise = youtubeDataApiService.getVideoDataById(songId);
        promise.then(loadVideoDetailIntoForm, failYoutubeApiCall);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
