
var movePlayer = function(playerOptions) {

  this.createPlayer();
  this.player = videojs(playerOptions.playerId, { fluid: true, preload: 'metadata' });

  // Remove controls from the player on iPad to stop native controls from stealing
  // our click
  var contentPlayer =  document.getElementById(playerOptions.playerId + '_html5_api');
  if ((navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/Android/i)) &&
      contentPlayer.hasAttribute('controls')) {
    contentPlayer.removeAttribute('controls');
  }

  // Start ads when the video player is clicked, but only the first time it's
  // clicked.
  var startEvent = 'click';
  if (navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/Android/i)) {
    startEvent = 'touchend';
  }
  this.player.one(startEvent, this.bind(this, this.init));
  this.player.on('fullscreenchange', this.bind(this, this.onPause));

  this.options = {
    id: playerOptions.playerId,
    locale : 'tr'
  };

  this.events = [
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    google.ima.AdEvent.Type.CLICK,
    google.ima.AdEvent.Type.COMPLETE,
    google.ima.AdEvent.Type.FIRST_QUARTILE,
    google.ima.AdEvent.Type.LOADED,
    google.ima.AdEvent.Type.MIDPOINT,
    google.ima.AdEvent.Type.PAUSED,
    google.ima.AdEvent.Type.STARTED,
    google.ima.AdEvent.Type.THIRD_QUARTILE
  ];

  this.player.ima(
      this.options,
      this.bind(this, this.adsManagerLoadedCallback));
};

movePlayer.prototype.onPause = function(){

}

movePlayer.prototype.init = function() {
  this.player.ima.initializeAdDisplayContainer();
  this.player.ima.setContentWithAdTag(null, playerOptions.adTagURL, true);
  this.player.ima.requestAds();
  this.player.play();
};

movePlayer.prototype.createPlayer = function(){
  var movePlayer = document.createElement('video');
  movePlayer.id = playerOptions.playerId;
  movePlayer.className = 'video-js vjs-16-9 vjs-default-skin vjs-big-play-centered';
  movePlayer.setAttribute('preload','auto');
  movePlayer.setAttribute('controls','controls');
  movePlayer.setAttribute('poster', playerOptions.posterURL);
  movePlayer.setAttribute('playsinline', '');

  var contentSource = document.createElement('source');
  contentSource.setAttribute('src', playerOptions.videoURL);
  contentSource.setAttribute('type', playerOptions.videoType);

  movePlayer.appendChild(contentSource);
  document.getElementById('move-player').appendChild(movePlayer);
}

movePlayer.prototype.adsManagerLoadedCallback = function() {
  for (var index = 0; index < this.events.length; index++) {
    this.player.ima.addEventListener(
        this.events[index],
        this.bind(this, this.onAdEvent));
  }
  this.player.ima.startFromReadyCallback();
};

movePlayer.prototype.onAdEvent = function(event) {
  this.log('Ad event: ' + event.type);

  var ad = event.getAd();
  console.log(ad.getCreativeId());
};

movePlayer.prototype.log = function(message) {
  console.log(message);
}

movePlayer.prototype.bind = function(thisObj, fn) {
  return function() {
    fn.apply(thisObj, arguments);
  };
};
