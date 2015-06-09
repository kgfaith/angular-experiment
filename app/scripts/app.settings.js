'use strict';

var constants = angular.module('ab.settings', []);

var appSettings = {
    localStorageKey: {
        playList: 'ab.something.playlist'
    }
};

constants.constant('appSettings', appSettings);