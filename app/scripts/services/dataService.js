'use strict';

angular.module("ab.services").factory('dataService', ['localStorageService', 'appSettings',
    function (LocalStorageFactory, appSettings) {
        function isFirstTimeUser() {
            var ftuValue = LocalStorageFactory.load(appSettings.localStorageKey.playlist);

            return _.isUndefined(ftuValue) || _.isNull(ftuValue);
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
                var foundPlaylist = _.find(playlistAry, function(item){
                    return item.id == playlistId
                });

                if(_.isObject(foundPlaylist)){
                    foundPlaylist.playlist.push(song);
                    LocalStorageFactory.save(appSettings.localStorageKey.playlist, playlistAry);
                }
            }
        };

        function getFakePlaylists() {
            return [{
                id: 1,
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
                id: 2,
                name: 'Playlist 1',
                isSelectedPlaylist: false,
                playlist: []
            }];
        }
    }]);