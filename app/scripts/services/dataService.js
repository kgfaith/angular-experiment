'use strict';

angular.module("ab.services").factory('dataService', ['localStorageService', 'appSettings', 'utilityService',
    function (LocalStorageFactory, appSettings, utilityService) {
        function isFirstTimeUser() {
            var ftuValue = LocalStorageFactory.load(appSettings.localStorageKey.playlist);

            return _.isUndefined(ftuValue) || _.isNull(ftuValue);
        }

        function findPlaylistByPlaylistId(playlistId, playlistAry){
            return _.find(playlistAry, function(item){
                return item.playlistId == playlistId
            });
        }

        return {
            getPlaylistData: function () {
                if (isFirstTimeUser()){
                    var fakePlaylist = getFakePlaylists();
                    this.savePlaylistData(fakePlaylist);
                    return fakePlaylist;
                }
                return LocalStorageFactory.load(appSettings.localStorageKey.playlist);
            },
            savePlaylistData: function(playlistData){
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistData);
            },
            addSongToPlaylist: function(playlistId, song){
                if(!_.isNumber(playlistId) || !_.isObject(song) || isFirstTimeUser()) {
                    return;
                }
                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = findPlaylistByPlaylistId(playlistId, playlistAry);

                if(_.isObject(foundPlaylist) && playlistAry != null){
                    foundPlaylist.playlist.push(song);
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            deleteSongFromPlaylist: function (playlistId, song, index) {
                if(!_.isNumber(playlistId) || !_.isObject(song) || !_.isNumber(index) || isFirstTimeUser()) {
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = findPlaylistByPlaylistId(playlistId, playlistAry);

                if(_.isObject(foundPlaylist) && foundPlaylist.playlist.length >= (index + 1)){
                    if(foundPlaylist.playlist[index].videoId == song.videoId){
                        foundPlaylist.playlist.splice(index, 1);
                    }
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            editSongFromPlaylist: function(song) {
                if(!_.isObject(song) || !_.isString(song.videoId) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);

                _.each(playlistAry, function(item){
                    var foundIndex = utilityService.findIndex(item.playlist, function(playlistSong){
                        return playlistSong.videoId == song.videoId;
                    });
                    if(foundIndex != -1){
                        item.playlist[foundIndex] = angular.copy(song);
                    }
                });
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            },
            addNewPlaylist: function(newPlaylist) {
                if(_.isUndefined(newPlaylist) || !_.isObject(newPlaylist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                playlistAry.push(newPlaylist);
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            },
            deletePlaylist: function(playlist){
                if(_.isUndefined(playlist) || !_.isObject(playlist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundIndex = -1;
                _.each(playlistAry, function(item, index){
                    if(item.playlistId == playlist.playlistId){
                        foundIndex = index;
                    }
                });
                if(foundIndex > -1){
                    playlistAry.splice(foundIndex, 1);
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            },
            editPlaylistName: function(playlist) {
                if(_.isUndefined(playlist) || !_.isString(playlist) || isFirstTimeUser()){
                    return;
                }

                var playlistAry = LocalStorageFactory.load(appSettings.localStorageKey.playlist);
                var foundPlaylist = _.find(playlistAry, function(item){
                     return item.playlistId == playlist.playlistId;
                });
                foundPlaylist.name = playlist.name;
                LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
            }
        };

        function getFakePlaylists() {
            return [{
                playlistId: 1,
                name: 'Sample playlist',
                isSelectedPlaylist: true,
                playlist: [{
                    name: 'Thiake Ma Ket Bu',
                    artistName: 'Tin Zar Maw',
                    videoId: 'W2Z3GWt8v9w'
                }, {
                    name: 'Mhar Pyan Dal',
                    artistName: 'Chan Chan',
                    videoId: '9BImfRpcsHg'
                }, {
                    name: 'Tun Eindra Bo - Live Concert - 8',
                    artistName: 'Tun Eindra Bo',
                    videoId: 'OHxgbwyoQtA'
                }, {
                    name: 'Tate Ta Khoe',
                    artistName: 'Bobby Soxer ft Ye\' Lay',
                    videoId: 'l7SPUVUPQCo'
                }]
            },{
                playlistId: 2,
                name: 'Playlist 1',
                isSelectedPlaylist: false,
                playlist: []
            }];
        }
    }]);