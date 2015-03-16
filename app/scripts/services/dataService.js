'use strict';

angular.module("ab.services").factory('dataService', ["$http",
  function ($http) {

    return {
      getPlaylistData: function () {
        return getFakePlaylists();
      }
    };

    function getFakePlaylists(){
      return [{
        name: 'Sai Sai Khan Hlaing',
        playlist: [{
          name: 'Yee Sar Sar',
          artistName: 'Sai Sai Khan Hlaing',
          videoId: 'M17x_xH7A_w'
        },{
          name: 'Char Tate Ah Twet',
          artistName: 'Sai Sai Kham Hlaing, Tracy Nan Kham Huam',
          videoId: 'VBgtMk2sdWE'
        },{
          name: 'အျပာေရာင္လမ',
          artistName: '္းခြဲ- စိုင္းစိုင္းခမ္းလိႈင္၊ အိမ့္ခ်စ္၊ ေန၀င္း၊ ေမဂေရ႕စ္',
          videoId: 'NAyFZuYS2Gs'
        },{
          name: 'Pee Khae Thaw Zat Lan Ah Kyin',
          artistName: 'Sai Sai Kham Hlaing, Tha O',
          videoId: 'T1Af7z8ll0s'
        }]
      },{
        name: 'Favourite Pop',
        playlist: [{
          name: 'New Song',
          artistName: 'Soe Thu',
          videoId: 'by2rM3932rM'
        },{
          name: 'Kyae Tway Sone Te Nya',
          artistName: 'Htoo Ein Thin',
          videoId: 'MiZzO6xEsn0'
        },{
          name: 'သိုးမဲေတြအေၾကာင္း',
          artistName: 'ဗဒင္ ',
          videoId: 'UoKhDVhls4A'
        },{
          name: 'Mhyaw Lint Nay Mel',
          artistName: 'R Zarni',
          videoId: 'yLUxa9ND72c'
        }]
      },{
        name: 'Female Artists',
        playlist: [{
          name: 'Thiake Ma Ket Bu',
          artistName: 'Tin Zar Maw',
          videoId: 'W2Z3GWt8v9w'
        },{
          name: 'Mhar Pyan Dal',
          artistName: 'Chan Chan',
          videoId: '9BImfRpcsHg'
        },{
          name: 'Tun Eindra Bo - Live Concert - 8',
          artistName: 'Tun Eindra Bo',
          videoId: 'OHxgbwyoQtA'
        },{
          name: 'Tate Ta Khoe',
          artistName: 'Bobby Soxer ft Ye\' Lay',
          videoId: 'l7SPUVUPQCo'
        }]
      },{
        name: 'Taylor Swift',
        playlist: [{
          name: 'Style',
          artistName: 'Taylor Swift',
          videoId: '-CmadmM5cOk'
        },{
          name: 'Blank Space',
          artistName: 'Taylor Swift',
          videoId: 'e-ORhEE9VVg'
        },{
          name: 'Shake It Off',
          artistName: 'Taylor Swift',
          videoId: 'nfWlot6h_JM'
        },{
          name: 'Love Story',
          artistName: 'Taylor Swift',
          videoId: '8xg3vE8Ie_E'
        },{
            name: 'You Belong With Me',
            artistName: 'Taylor Swift',
            videoId: 'VuNIsY6JdUw'
        },{
          name: 'Mean',
          artistName: 'Taylor Swift',
          videoId: 'jYa1eI1hpDE'
        },{
          name: 'Back To December',
          artistName: 'Taylor Swift',
          videoId: 'QUwxKWT6m7U'
        },{
          name: 'Fifteen',
          artistName: 'Taylor Swift',
          videoId: 'Pb-K2tXWK4w'
        },{
          name: 'Teardrops On My Guitar',
          artistName: 'Taylor Swift',
          videoId: 'xKCek6_dB0M'
        },{
          name: 'The Story Of Us',
          artistName: 'Taylor Swift',
          videoId: 'nN6VR92V70M'
        },{
          name: 'Sparks Fly',
          artistName: 'Taylor Swift',
          videoId: 'oKar-tF__ac'
        },{
          name: 'Fearless',
          artistName: 'Taylor Swift',
          videoId: 'ptSjNWnzpjg'
        },{
          name: 'Change',
          artistName: 'Taylor Swift',
          videoId: 'B1jYllE0T-k'
        },{
          name: 'I\'m Only Me When I\'m With You',
          artistName: 'Taylor Swift',
          videoId: 'AlTfYj7q5gQ'
        }]
      }];;
    }
  }]);
