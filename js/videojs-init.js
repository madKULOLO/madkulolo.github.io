document.addEventListener('DOMContentLoaded', function() {
  if (window.videojs) {
    window.videojs.addLanguage('ru', {
      "Play": "Воспроизвести",
      "Pause": "Пауза",
      "Mute": "Без звука",
      "Unmute": "Со звуком",
      "Fullscreen": "На весь экран",
      "Non-Fullscreen": "Обычный режим",
      "Picture-in-Picture": "Плавающее окно",
      "Exit Picture-in-Picture": "Обычный режим",
      "Playback Rate": "Скорость",
      "Subtitles": "Субтитры",
      "Captions": "Титры",
      "Chapters": "Главы",
      "Descriptions": "Описания",
      "Remaining Time": "Осталось времени",
      "Duration": "Длительность",
      "Current Time": "Текущее время",
      "Volume Level": "Уровень громкости",
      "LIVE": "ПРЯМОЙ ЭФИР",
      "Loading": "Загрузка...",
      "Quality": "Качество"
    });
    window.videojs.options.languages = window.videojs.options.languages || {};
    window.videojs.options.languages.ru = window.videojs.options.languages.ru || {};
    Object.assign(window.videojs.options.languages.ru, {
      "Play": "Воспроизвести",
      "Pause": "Пауза",
      "Mute": "Без звука",
      "Unmute": "Со звуком",
      "Fullscreen": "На весь экран",
      "Non-Fullscreen": "Обычный режим",
      "Picture-in-Picture": "Плавающее окно",
      "Exit Picture-in-Picture": "Обычный режим",
      "Playback Rate": "Скорость",
      "Subtitles": "Субтитры",
      "Captions": "Титры",
      "Chapters": "Главы",
      "Descriptions": "Описания",
      "Remaining Time": "Осталось времени",
      "Duration": "Длительность",
      "Current Time": "Текущее время",
      "Volume Level": "Уровень громкости",
      "LIVE": "ПРЯМОЙ ЭФИР",
      "Loading": "Загрузка...",
      "Quality": "Качество"
    });
  }
  function checkPoster(url, fallback, cb) {
    var img = new window.Image();
    var done = false;
    img.onload = function() { if (!done) { done = true; cb(url); } };
    img.onerror = function() { if (!done) { done = true; cb(fallback); } };
    img.src = url;
    setTimeout(function(){ if (!done) { done = true; cb(fallback); } }, 2000);
  }

  var player = videojs('videojs-player', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    fluid: true,
    aspectRatio: '16:9',
    poster: '', 
    controlBar: {
      pictureInPictureToggle: true
    }
  });
  player.language('ru');

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  if (isMobileDevice()) {
    var videoEl = document.getElementById('videojs-player');
    var playedOnce = false;
    var tryPlay = function() {
      if (!playedOnce && player.paused()) {
        player.play().catch(function(){});
        playedOnce = true;
      }
    };
    videoEl.addEventListener('touchend', tryPlay, { once: true });
    videoEl.addEventListener('click', tryPlay, { once: true });
  }
  var select = document.getElementById('channelSelect');
  function setChannelSource(idx) {
    var src = idx === 1
      ? 'https://stream.deduso.su/memfs/9f3dda91-feed-452d-aec7-9171d404109e.m3u8'
      : 'https://stream.deduso.su/memfs/0cd70214-4b93-45ef-a673-b66fab86a296.m3u8';
    player.src({ src: src, type: 'application/x-mpegURL' });
  }

  function setChannelPoster(idx) {
    var live = idx === 1
      ? 'https://stream.deduso.su/memfs/9f3dda91-feed-452d-aec7-9171d404109e.jpg'
      : 'https://stream.deduso.su/memfs/0cd70214-4b93-45ef-a673-b66fab86a296.jpg';
    var fallback = idx === 1
      ? 'https://stream.deduso.su/channels/9f3dda91-feed-452d-aec7-9171d404109e/poster.jpg'
      : 'https://stream.deduso.su/channels/0cd70214-4b93-45ef-a673-b66fab86a296/poster.jpg';
    checkPoster(live, fallback, function(url) {
      player.poster(url);
    });
  }

  function setChannel(idx) {
    setChannelSource(idx);
    setChannelPoster(idx);
    setPlayerTheme(idx);
    player.pause();
    player.language('ru');
  }

  if (select) {
    select.addEventListener('change', function() {
      var idx = parseInt(this.value, 10) || 0;
      setChannel(idx);
    });
  }

  function setPlayerTheme(idx) {
    player.language('ru');
    var vjs = document.getElementById('videojs-player');
    if (!vjs) return;
    var wrapper = vjs.closest('.video-js');
    if (!wrapper) return;
    wrapper.classList.remove('suicide-theme');
    wrapper.style.background = '';
    wrapper.style.color = '';
    wrapper.style.fontFamily = '';
    wrapper.style.borderRadius = '';
    wrapper.style.boxShadow = '';
    wrapper.style.border = '';
    var pc = document.getElementById('playerContainer');
    if (pc) {
      pc.classList.remove('suicide-theme');
      pc.style.borderRadius = '';
      pc.style.boxShadow = '';
      pc.style.border = '';
      pc.style.background = '';
    }
    wrapper.style.borderRadius = '';
    var poster = wrapper.querySelector('.vjs-poster');
    var tech = wrapper.querySelector('.vjs-tech');
    if (poster) poster.style.borderRadius = '';
    if (tech) tech.style.borderRadius = '';
    if (idx === 1) {
      wrapper.classList.add('suicide-theme');
      wrapper.style.borderRadius = '0px';
      if (poster) poster.style.borderRadius = '0px';
      if (tech) tech.style.borderRadius = '0px';
      if (pc) {
        pc.classList.add('suicide-theme');
        pc.style.borderRadius = '0px';
        pc.style.boxShadow = '0 0 32px #a10000, 0 0 40px #000';
        pc.style.border = '4px solid #a10000';
        pc.style.background = '#232323';
      }
    } else {
      wrapper.style.borderRadius = '24px';
      if (poster) poster.style.borderRadius = '24px';
      if (tech) tech.style.borderRadius = '24px';
      if (pc) {
        pc.classList.remove('suicide-theme');
        pc.style.borderRadius = '32px';
        pc.style.boxShadow = '0 0 32px #ff00ff, 0 0 40px #00ffff';
        pc.style.border = '8px solid #00ffff';
        pc.style.background = '#00ffff';
      }
    }
  }
  var idx = select ? parseInt(select.value, 10) : 0;
  setChannelPoster(idx);
  setPlayerTheme(idx);
  player.language('ru');
  var idx0 = select ? parseInt(select.value, 10) : 0;
  setChannel(idx0);
});
