'use strict';

var constants = angular.module('ab.settings', []);

var appSettings = {
    localStorageKey: {
        playlist: 'ab.something.playlist'
    }
};

constants.constant('appSettings', appSettings);