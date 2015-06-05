var isYoutubeDataApiLoaded = false;
function youtubeApiLoaded(){
  isYoutubeDataApiLoaded = true;
}

function init() {
  gapi.client.setApiKey('AIzaSyBBlFgiz5oTdChPIFKHQr5LStUhjJb5yTk');
  gapi.client.load('youtube', 'v3').then(youtubeApiLoaded);
  console.log('youtube data api loaded.');
}

'use strict';
angular.module('ytApp', ['youtube-embed', 'ab.services', 'ab.directives',
'ngAnimate', 'ui.bootstrap-slider', 'ui.bootstrap']);
//'ui.slider',
angular.module('ab.services', []);
angular.module('ab.directives', []);
