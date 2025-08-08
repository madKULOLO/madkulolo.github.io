const channels = [
  {
    title: 'ДЕД ЛАЙВ',
    subtitle: 'ПОДКЛЮЧАЙСЯ',
    donate: [
      { href: 'https://www.donationalerts.com/r/madkulolo', text: 'донатируй деду', class: 'btn btn-danger btn-lg' },
      { href: 'https://boosty.to/madkulolo', text: 'батя гордился бы тобой?', class: 'btn btn-primary btn-lg' },
      { href: 'https://memealerts.com/madkulolo', text: 'мемный алёрт', class: 'btn btn-primary btn-lg' }
    ],
    socials: [
      { href: 'https://vk.com/kulologame_s', icon: 'fab fa-vk fa-fw' },
      { href: 'https://www.youtube.com/channel/UCVaL-dYvw-xIWv8sogeDylg', icon: 'fab fa-youtube fa-fw' },
      { href: 'https://www.twitch.tv/madkulolo', icon: 'fab fa-twitch fa-fw' },
      { href: 'https://t.me/+tl9RiWcbMVw5NzAy', icon: 'fab fa-telegram fa-fw' },
      { href: 'mailto:ads@mikhail.one', icon: 'fa fa-envelope fa-fw' },
      { href: 'https://www.tiktok.com/@madkulolo', icon: 'fab fa-tiktok fa-fw' },
    ]
  },
  {
    title: 'выход есть',
    subtitle: 'вскрываемся!',
    donate: [
      { href: 'https://memealerts.com/mrrmaikl', text: 'помощь', class: 'btn btn-danger btn-lg' },
      { href: 'https://www.donationalerts.com/r/mrrmaikl', text: 'донат на лезвие', class: 'btn btn-primary btn-lg' }
    ],
    socials: [
      { href: 'tel:8-800-2000-122', icon: 'fa fa-phone fa-fw' },
      { href: 'https://t.me/mrrmaikl', icon: 'fab fa-telegram fa-fw' },
      { href: 'https://www.twitch.tv/mrrmaikl', icon: 'fab fa-twitch fa-fw' },
    ]
  }
];

const select = document.getElementById('channelSelect');
const container = document.querySelector('.container');
const h1 = document.getElementById('mainTitle');
const h2 = document.getElementById('mainSubtitle');
const btnGroup = document.getElementById('btnGroup');
const socialLinks = document.getElementById('socialLinks');
const playerContainer = document.getElementById('playerContainer');
const channelSwitcher = document.getElementById('channelSwitcher');

function setTheme(idx) {
  const channelLabel = document.getElementById('channelLabel');
  if (idx === 1) {
    document.body.classList.add('suicide-theme');
    container.classList.add('suicide-theme');
    h1.classList.add('suicide-theme');
    h2.classList.add('suicide-theme');
    btnGroup.classList.add('suicide-theme');
    socialLinks.classList.add('suicide-theme');
    playerContainer.classList.add('suicide-theme');
    channelSwitcher.classList.add('suicide-theme');
    
    document.body.style.background = 'radial-gradient(ellipse at center, #232323 0%, #181818 100%)';
    channelLabel.style.color = '#a10000';
  } else {
    document.body.classList.remove('suicide-theme');
    container.classList.remove('suicide-theme');
    h1.classList.remove('suicide-theme');
    h2.classList.remove('suicide-theme');
    btnGroup.classList.remove('suicide-theme');
    socialLinks.classList.remove('suicide-theme');
    playerContainer.classList.remove('suicide-theme');
    channelSwitcher.classList.remove('suicide-theme');
    
    document.body.style.background = 'radial-gradient(circle at 60% 40%, #ffccff 0%, #ffff00 100%)';
    channelLabel.style.color = '#222';
  }
}

function setContent(idx) {
  
  h1.textContent = channels[idx].title;
  h2.textContent = channels[idx].subtitle;
  
  btnGroup.innerHTML = '';
  channels[idx].donate.forEach(btn => {
    const a = document.createElement('a');
    a.href = btn.href;
    a.textContent = btn.text;
    a.className = btn.class + (idx === 1 ? ' suicide-theme' : '');
    a.target = '_blank';
    btnGroup.appendChild(a);
  });
  socialLinks.innerHTML = '';
  channels[idx].socials.forEach(soc => {
    const a = document.createElement('a');
    a.innerHTML = `<i class="${soc.icon}"></i>`;
    if (soc.icon === 'fa fa-phone fa-fw') {
      a.href = soc.href;
      a.id = 'helpPhoneBtn';
      a.addEventListener('click', function(e) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile) {
          e.preventDefault();
          window.open('https://telefon-doveria.ru/', '_blank');
        }
      });
    } else {
      a.href = soc.href;
      a.target = soc.target || '_blank';
    }
    socialLinks.appendChild(a);
  });
  const commandsPanel = document.getElementById('commandsPanel');
  const openCommandsBtn = document.getElementById('openCommandsBtn');
  if (idx === 0) {
    if (commandsPanel) commandsPanel.style.display = '';
    if (openCommandsBtn) openCommandsBtn.style.display = '';
  } else {
    if (commandsPanel) {
      commandsPanel.style.display = 'none';
      commandsPanel.classList.remove('open');
    }
    if (openCommandsBtn) {
      openCommandsBtn.style.display = 'none';
      openCommandsBtn.innerHTML = '📜CUMанды💦';
    }
    if (typeof commandsOpen !== 'undefined') commandsOpen = false;
  }
}

function setAnimations(idx) {
  if (idx === 1) {
    h1.style.animation = 'none';
    h2.style.animation = 'none';
    btnGroup.style.animation = 'none';
  } else {
    h1.style.animation = '';
    h2.style.animation = '';
    btnGroup.style.animation = '';
  }
}


function switchChannel(idx) {
  const embedDiv = document.getElementById('playerTwitchEmbed');
  const chatBlock = document.getElementById('twitchChatBlock');
        // --- Twitch embed code ---
        // const channelName = idx === 0 ? 'madkulolo' : 'mrrmaikl';
        
        // if (embedDiv) {
        //   embedDiv.innerHTML = '';
        //   const iframe = document.createElement('iframe');
        //   iframe.setAttribute('src', 'https://player.twitch.tv/?channel=' + channelName + '&parent=' + location.hostname + '&autoplay=true');
        //   iframe.setAttribute('frameborder', '0');
        //   iframe.setAttribute('allowfullscreen', 'true');
        //   iframe.setAttribute('scrolling', 'no');
        //   iframe.style.width = '100%';
        //   iframe.style.aspectRatio = '16/9';
        //   iframe.style.height = '';
        //   embedDiv.appendChild(iframe);
        // }
        // if (chatBlock && chatBlock.style.display !== 'none') {
        //   chatBlock.innerHTML = '';
        //   const chatIframe = document.createElement('iframe');
        //   chatIframe.setAttribute('src', 'https://www.twitch.tv/embed/' + channelName + '/chat?parent=' + location.hostname);      
        //   chatIframe.setAttribute('frameborder', '0');
        //   chatIframe.style.width = '100%';
        //   chatIframe.style.height = '420px';
        //   chatIframe.style.minHeight = '320px';
        //   chatIframe.style.maxHeight = '60vh';
        //   chatIframe.style.display = 'block';
        //   chatBlock.appendChild(chatIframe);
        // }
        
        // --- Servers RTMPS ---
        if (embedDiv) {
          embedDiv.innerHTML = '';
          const iframe = document.createElement('iframe');
          if (idx === 0) {
            iframe.setAttribute('src', 'https://stream.deduso.su/0cd70214-4b93-45ef-a673-b66fab86a296.html'); // дед
          } else {
            iframe.setAttribute('src', 'https://stream.deduso.su/9f3dda91-feed-452d-aec7-9171d404109e.html'); // кабина
          }
          iframe.setAttribute('frameborder', '0');
          iframe.setAttribute('allowfullscreen', 'true');
          iframe.setAttribute('scrolling', 'no');
          iframe.style.width = '100%';
          iframe.style.aspectRatio = '16/9';
          iframe.style.height = '';
          embedDiv.appendChild(iframe);
        }
        // --- Servers RTMPS ---
  setTheme(idx);
  setContent(idx);
  setAnimations(idx);
}

let idx = parseInt(select.value, 10) || 0;
switchChannel(idx);

select.addEventListener('change', function() {
  idx = parseInt(this.value);
  switchChannel(idx);
});

function getCurrentChannelName() {
  const sel = document.getElementById('channelSelect');
  return sel && sel.value === '1' ? 'mrrmaikl' : 'madkulolo';
}
document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('openTwitchChatBtn');
  const chatBlock = document.getElementById('twitchChatBlock');
  const select = document.getElementById('channelSelect');
  const phoneBtn = document.getElementById('helpPhoneBtn');
  let chatOpen = false;
  function showChat() {
    if (!chatBlock) return;
    const channel = getCurrentChannelName();
    chatBlock.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.twitch.tv/embed/' + channel + '/chat?parent=' + location.hostname;
    iframe.allowFullscreen = false;
    iframe.style.width = '100%';
    iframe.style.height = '420px';
    iframe.style.minHeight = '320px';
    iframe.style.maxHeight = '60vh';
    iframe.style.display = 'block';
    chatBlock.appendChild(iframe);
    chatBlock.style.display = 'block';
    openBtn.textContent = 'Скрыть чат Twitch';
    chatOpen = true;
  }
  function hideChat() {
    if (!chatBlock) return;
    chatBlock.innerHTML = '';
    chatBlock.style.display = 'none';
    openBtn.textContent = 'Открыть чат Twitch';
    chatOpen = false;
  }
  openBtn.onclick = function() {
    if (chatOpen) {
      hideChat();
    } else {
      showChat();
    }
  };
  select.addEventListener('change', function() {
    if (chatOpen) showChat();
  });
  if (phoneBtn) {
    phoneBtn.addEventListener('click', function(e) {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (!isMobile) {
        e.preventDefault();
        window.open('https://telefon-doveria.ru/', '_blank');
      }
    });
  }

  const commandSearch = document.getElementById('commandSearch');
  if (commandSearch) {
    const easterEggs = {
      'нигер': () => {
        alert('Дед говорит: не шути так, а то бан прилетит!');
      },
      'яйцо': () => {
        const egg = document.createElement('div');
        egg.style.position = 'fixed';
        egg.style.left = '50%';
        egg.style.top = '50%';
        egg.style.transform = 'translate(-50%, -50%)';
        egg.style.zIndex = 99999;
        egg.style.fontSize = '5em';
        egg.style.background = '#fff';
        egg.style.border = '8px solid #ff00ff';
        egg.style.borderRadius = '50%';
        egg.style.padding = '40px 60px';
        egg.style.boxShadow = '0 0 40px #ff00ff';
        egg.textContent = '🥚';
        document.body.appendChild(egg);
        setTimeout(() => egg.remove(), 2500);
      },
      'mrrmaikl': () => {
        const msg = document.createElement('div');
        msg.style.position = 'fixed';
        msg.style.left = '50%';
        msg.style.top = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.zIndex = 99999;
        msg.style.fontSize = '2.5em';
        msg.style.background = '#ffff00';
        msg.style.color = '#ff00ff';
        msg.style.border = '8px double #00ff00';
        msg.style.borderRadius = '30px';
        msg.style.padding = '30px 40px';
        msg.style.boxShadow = '0 0 40px #00ff00';
        msg.innerHTML = '💖 MrrMaikl — ЛУЧШАЯ ЖЕНА ДЕДА! 💖';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      },
      'alonerus': () => {
        const img = document.createElement('img');
        img.src = 'https://deduso.su/images/neko-8.jpg';
        img.alt = 'neko';
        img.style.position = 'fixed';
        img.style.left = '50%';
        img.style.top = '50%';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.zIndex = 99999;
        img.style.maxWidth = '60vw';
        img.style.maxHeight = '60vh';
        img.style.border = '8px solid #ff00ff';
        img.style.borderRadius = '30px';
        img.style.boxShadow = '0 0 40px #00ff00';
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 3500);
      },
      'kessidi': () => {
        const msg = document.createElement('div');
        msg.style.position = 'fixed';
        msg.style.left = '50%';
        msg.style.top = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.zIndex = 99999;
        msg.style.fontSize = '2em';
        msg.style.background = '#fff0f6';
        msg.style.color = '#ff00ff';
        msg.style.border = '6px dashed #ff00ff';
        msg.style.borderRadius = '30px';
        msg.style.padding = '30px 40px';
        msg.style.boxShadow = '0 0 40px #ff00ff';
        msg.innerHTML = '🦵<b>Kessidi</b>, дедовик ждёт твои ножки уже много лет... <br>Когда же деда дождётся? 😭🦵';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 4000);
      }
    };
    commandSearch.addEventListener('input', function() {
      const val = this.value.trim().toLowerCase();
      if (easterEggs[val]) {
        easterEggs[val]();
      }
      const shown = new Set();
      document.querySelectorAll('.commands-list .command-list ul').forEach(function(ul) {
        let hasVisible = false;
        ul.querySelectorAll('li').forEach(function(li) {
          const cmdSpan = li.querySelector('.command');
          let key = '';
          if (cmdSpan) key = cmdSpan.textContent.trim().toLowerCase();
          const text = li.textContent.toLowerCase();
          if (!val || text.includes(val)) {
            if (!key || !shown.has(key)) {
              li.style.display = '';
              hasVisible = true;
              if (key) shown.add(key);
            } else {
              li.style.display = 'none';
            }
          } else {
            li.style.display = 'none';
          }
        });
        const category = ul.closest('.command-category');
        if (category) {
          category.style.display = hasVisible ? '' : 'none';
        }
      });
    });
  }
});

const openCommandsBtn = document.getElementById('openCommandsBtn');
const commandsPanel = document.getElementById('commandsPanel');
let commandsOpen = false;

function toggleCommandsPanel() {
  if (commandsOpen) {
    commandsPanel.classList.remove('open');
    commandsOpen = false;
    openCommandsBtn.innerHTML = '📜CUMанды💦';
  } else {
    commandsPanel.classList.add('open');
    commandsOpen = true;
    openCommandsBtn.innerHTML = '✖ Спрятать';
  }
}

if (openCommandsBtn) {
    openCommandsBtn.addEventListener('click', toggleCommandsPanel);
}

document.addEventListener('click', (e) => {
    if (commandsPanel && openCommandsBtn) {
        if (commandsOpen && !commandsPanel.contains(e.target) && !openCommandsBtn.contains(e.target)) {
            toggleCommandsPanel();
        }
    }
});

document.addEventListener('keydown', (e) => {
  if (commandsOpen && e.key === 'Escape') {
    toggleCommandsPanel();
  }
});

document.addEventListener('DOMContentLoaded', function() {
    if (openCommandsBtn) {
        openCommandsBtn.innerHTML = '📜CUMанды💦';
    }
});

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showCopyNotification();
    }).catch(function(err) {
      alert('Ошибка копирования: ' + err);
    });
  } else {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopyNotification();
    } catch (err) {
      alert('Ошибка копирования: ' + err);
    }
  }
}

function showCopyNotification() {
  let notif = document.getElementById('copyNotif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'copyNotif';
    notif.style.position = 'fixed';
    notif.style.left = '50%';
    notif.style.bottom = '100px';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#ffff00';
    notif.style.color = '#a100a1';
    notif.style.border = '2px solid #ff00ff';
    notif.style.borderRadius = '18px';
    notif.style.padding = '16px 36px';
    notif.style.fontSize = '1.3rem';
    notif.style.fontFamily = "'Comic Sans MS', cursive";
    notif.style.boxShadow = '0 2px 16px #ff00ff44';
    notif.style.zIndex = '9999';
    notif.style.opacity = '0';
    notif.style.transition = 'opacity 0.3s';
    notif.textContent = 'ГОЙЙЙДА!';
    document.body.appendChild(notif);
  }
  notif.style.opacity = '1';
  setTimeout(function() {
    notif.style.opacity = '0';
  }, 1200);
}

window.copyToClipboard = copyToClipboard;