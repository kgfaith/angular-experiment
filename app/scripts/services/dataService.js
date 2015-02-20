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
          name: 'Yee Sar Sar- Sai Sai Kham Hlaing, Khin Wint War',
          videoId: 'M17x_xH7A_w'
        },{
          name: 'Char Tate Ah Twet- Sai Sai Kham Hlaing, Tracy Nan Kham Huam',
          videoId: 'VBgtMk2sdWE'
        },{
          name: 'အျပာေရာင္လမ္းခြဲ- စိုင္းစိုင္းခမ္းလိႈင္၊ အိမ့္ခ်စ္၊ ေန၀င္း၊ ေမဂေရ႕စ္',
          videoId: 'NAyFZuYS2Gs'
        },{
          name: 'Pee Khae Thaw Zat Lan Ah Kyin- Sai Sai Kham Hlaing, Tha O',
          videoId: 'T1Af7z8ll0s'
        }]
      },{
        name: 'Favourite Pop',
        playlist: [{
          name: 'Soe Thu(New Song)',
          videoId: 'by2rM3932rM'
        },{
          name: 'Htoo Ein Thin - Kyae Tway Sone Te Nya',
          videoId: 'MiZzO6xEsn0'
        },{
          name: 'Ba Din (ဗဒင္ ) သိုးမဲေတြအေၾကာင္း (Myanmar Gospel Song)',
          videoId: 'UoKhDVhls4A'
        },{
          name: 'Mhyaw Lint Nay Mel - R Zarni',
          videoId: 'yLUxa9ND72c'
        }]
      },{
        name: 'Female Artists',
        playlist: [{
          name: 'Tin Zar Maw - Thiake Ma Ket Bu',
          videoId: 'W2Z3GWt8v9w'
        },{
          name: 'Mhar Pyan Dal - Chan Chan',
          videoId: '9BImfRpcsHg'
        },{
          name: 'Myanmar Music Video : Tun Eindra Bo - The Best Live Concert - 8',
          videoId: 'OHxgbwyoQtA'
        },{
          name: 'Tate Ta Khoe - Bobby Soxer ft Ye\' Lay (Music Video QeQo)',
          videoId: 'l7SPUVUPQCo'
        }]
      }];;
    }
  }]);
