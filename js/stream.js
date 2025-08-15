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


const CLIENT_ID = '5ivtmm2oqik8tq57qxbxkl2nwju1ew'; 
const REDIRECT_URI = window.location.origin + window.location.pathname;

let tmiClient = null;
const chatContainerDesktop = document.getElementById('customChatDesktop');
const chatContainerMobile = document.getElementById('customChatMobile');
let isFirstMessage = true;
let userInfo = {}; 

const chatControlsDesktop = document.getElementById('chatControlsDesktop');
const chatControlsMobile = document.getElementById('chatControlsMobile');
const loginButtons = document.querySelectorAll('.chat-login-btn');
const sendForms = document.querySelectorAll('.chat-send-form');

function twitchLogin() {
    const scopes = 'chat:read chat:edit';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scopes}`;
    window.location.href = authUrl;
}

function handleAuthRedirect() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
        localStorage.setItem('twitch_access_token', accessToken);
        history.pushState("", document.title, window.location.pathname + window.location.search);
        return accessToken;
    }
    return null;
}

async function fetchUserInfo(token) {
    try {
        const response = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Client-Id': CLIENT_ID
            }
        });
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const user = data.data[0];
            userInfo = {
                login: user.login,
                displayName: user.display_name,
                id: user.id
            };
            localStorage.setItem('twitch_user_info', JSON.stringify(userInfo));
        }
    } catch (error) {
        console.error("Ошибка при получении информации о пользователе:", error);
        logout();
    }
}

function logout() {
    localStorage.removeItem('twitch_access_token');
    localStorage.removeItem('twitch_user_info');
    userInfo = {};
    updateUIForLoginState();
}

function updateUIForLoginState() {
    const token = localStorage.getItem('twitch_access_token');
    if (token && userInfo.login) {
        chatControlsDesktop.querySelector('.chat-login-wrapper').style.display = 'none';
        chatControlsMobile.querySelector('.chat-login-wrapper').style.display = 'none';
        chatControlsDesktop.querySelector('.chat-send-form').style.display = 'flex';
        chatControlsMobile.querySelector('.chat-send-form').style.display = 'flex';
    } else {
        chatControlsDesktop.querySelector('.chat-login-wrapper').style.display = 'flex';
        chatControlsMobile.querySelector('.chat-login-wrapper').style.display = 'flex';
        chatControlsDesktop.querySelector('.chat-send-form').style.display = 'none';
        chatControlsMobile.querySelector('.chat-send-form').style.display = 'none';
    }
    switchChannel(parseInt(select.value, 10));
}


function displayMessage(tags, message) {
    if (isFirstMessage) {
        chatContainerDesktop.innerHTML = '';
        chatContainerMobile.innerHTML = '';
        isFirstMessage = false;
    }

    if (!chatContainerDesktop || !chatContainerMobile) return;

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';

    const usernameElement = document.createElement('span');
    usernameElement.className = 'chat-username';
    usernameElement.textContent = `${tags['display-name']}: `;
    usernameElement.style.color = tags.color || (select.value === '1' ? '#ffb0b0' : '#a100a1');
    messageElement.appendChild(usernameElement);

    const messageTextElement = document.createElement('span');
    messageTextElement.className = 'chat-message-text';

    const emotes = tags.emotes || {};
    const messageParts = [];
    let lastIndex = 0;

    const sortedEmoteKeys = Object.keys(emotes).sort((a, b) => {
        const a_pos = parseInt(emotes[a][0].split('-')[0]);
        const b_pos = parseInt(emotes[b][0].split('-')[0]);
        return a_pos - b_pos;
    });

    sortedEmoteKeys.forEach(emoteId => {
        emotes[emoteId].forEach(position => {
            const [start, end] = position.split('-').map(Number);
            if (start > lastIndex) {
                messageParts.push(document.createTextNode(message.substring(lastIndex, start)));
            }
            const emoteImg = document.createElement('img');
            emoteImg.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`;
            emoteImg.alt = message.substring(start, end + 1);
            emoteImg.className = 'emote';
            messageParts.push(emoteImg);
            lastIndex = end + 1;
        });
    });

    if (lastIndex < message.length) {
        messageParts.push(document.createTextNode(message.substring(lastIndex)));
    }
    
    messageParts.forEach(part => messageTextElement.appendChild(part));
    messageElement.appendChild(messageTextElement);
    
    chatContainerDesktop.appendChild(messageElement.cloneNode(true));
    chatContainerMobile.appendChild(messageElement);

    chatContainerDesktop.scrollTop = chatContainerDesktop.scrollHeight;
    chatContainerMobile.scrollTop = chatContainerMobile.scrollHeight;
}

function connectToChat(channelName) {
    if (tmiClient) {
        tmiClient.disconnect();
    }
    
    isFirstMessage = true;

    const token = localStorage.getItem('twitch_access_token');
    let clientOptions = {
        options: { debug: false },
        channels: [channelName]
    };

    if (token && userInfo.login) {
        clientOptions.identity = {
            username: userInfo.login,
            password: `oauth:${token}`
        };
        const connectedMsg = `<div class="chat-message system-message">Вы вошли как ${userInfo.displayName}.</div>`;
        if (chatContainerDesktop) chatContainerDesktop.innerHTML = connectedMsg;
        if (chatContainerMobile) chatContainerMobile.innerHTML = connectedMsg;

    } else {
        const connectingMsg = '<div class="chat-message system-message">Чат (только чтение). Войдите, чтобы писать.</div>';
        if (chatContainerDesktop) chatContainerDesktop.innerHTML = connectingMsg;
        if (chatContainerMobile) chatContainerMobile.innerHTML = connectingMsg;
    }

    tmiClient = new tmi.Client(clientOptions);
    
    tmiClient.on('message', (channel, tags, message, self) => {
        displayMessage(tags, message);
    });

    tmiClient.connect().catch(err => {
        console.error("Ошибка подключения к чату:", err);
        if (String(err).includes("Login authentication failed")) {
             logout();
        }
        const errorMsg = `<div class="chat-message system-message error">Не удалось подключиться к чату.</div>`;
        if (chatContainerDesktop) chatContainerDesktop.innerHTML = errorMsg;
        if (chatContainerMobile) chatContainerMobile.innerHTML = errorMsg;
    });
}

function setTheme(idx) {
  const channelLabel = document.getElementById('channelLabel');
  const chatModal = document.getElementById('twitchChatModal');
  const chatBlock = document.getElementById('twitchChatBlock');

  if (idx === 1) {
    document.body.classList.add('suicide-theme');
    container.classList.add('suicide-theme');
    h1.classList.add('suicide-theme');
    h2.classList.add('suicide-theme');
    btnGroup.classList.add('suicide-theme');
    socialLinks.classList.add('suicide-theme');
    playerContainer.classList.add('suicide-theme');
    channelSwitcher.classList.add('suicide-theme');
    if (chatModal) chatModal.classList.add('suicide-theme');
    if (chatBlock) chatBlock.classList.add('suicide-theme');
    
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
    if (chatModal) chatModal.classList.remove('suicide-theme');
    if (chatBlock) chatBlock.classList.remove('suicide-theme');
    
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
  const channelName = idx === 0 ? 'madkulolo' : 'mrrmaikl';
  connectToChat(channelName);
        
  if (embedDiv) {
      embedDiv.innerHTML = '';
      const iframe = document.createElement('iframe');
      if (idx === 0) {
        iframe.setAttribute('src', 'https://stream.deduso.su/0cd70214-4b93-45ef-a673-b66fab86a296.html');
      } else {
        iframe.setAttribute('src', 'https://stream.deduso.su/9f3dda91-feed-452d-aec7-9171d404109e.html');
      }
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('scrolling', 'no');
      iframe.style.width = '100%';
      iframe.style.aspectRatio = '16/9';
      iframe.style.height = '';
      embedDiv.appendChild(iframe);
  }
  
  setTheme(idx);
  setContent(idx);
  setAnimations(idx);
}

select.addEventListener('change', function() {
  idx = parseInt(this.value);
  switchChannel(idx);
});

function getCurrentChannelName() {
  const sel = document.getElementById('channelSelect');
  return sel && sel.value === '1' ? 'mrrmaikl' : 'madkulolo';
}


document.addEventListener('DOMContentLoaded', async function() {
    let token = handleAuthRedirect();
    if (!token) {
        token = localStorage.getItem('twitch_access_token');
    }

    const storedUserInfo = localStorage.getItem('twitch_user_info');
    if (token) {
        if (storedUserInfo) {
            userInfo = JSON.parse(storedUserInfo);
        } else {
            await fetchUserInfo(token);
        }
    }
    updateUIForLoginState();


  const openBtn = document.getElementById('openTwitchChatBtn');
  const chatBlock = document.getElementById('twitchChatBlock');
  const modal = document.getElementById('twitchChatModal');
  const closeModalBtn = document.getElementById('closeTwitchChatModal');
  const dragbar = document.getElementById('twitchChatModalDragbar');
  const resizeLeft = document.getElementById('twitchChatModalResizeLeft');
  const resizeRight = document.getElementById('twitchChatModalResizeRight');
  const resizeTop = document.getElementById('twitchChatModalResizeTop');
  const resizeBottom = document.getElementById('twitchChatModalResizeBottom');
  const select = document.getElementById('channelSelect');
  const phoneBtn = document.getElementById('helpPhoneBtn');
  let chatOpen = false;
  let dragOffsetX = 0, dragOffsetY = 0, isDragging = false;
  let isResizing = false, resizeDir = '', resizeStart = {};

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function setModalTheme(idx) {
    if (!modal) return;
    const title = document.getElementById('twitchChatModalTitle');
    const closeIcon = document.getElementById('twitchChatModalCloseIcon');
    if (idx === 1) {
      modal.classList.add('suicide-theme');
      if (title) title.innerHTML = '💀 Писать или не писать?..';
      if (closeIcon) closeIcon.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="#a10000" stroke="#ffb0b0" stroke-width="3"/><text x="14" y="19" text-anchor="middle" font-size="18" fill="#fff">×</text></svg>';
    } else {
      modal.classList.remove('suicide-theme');
      if (title) title.innerHTML = '📌 Не забыть 🗣️💊';
      if (closeIcon) closeIcon.innerHTML = '<svg width="28" height="28" viewBox="0 0 28 28"><rect x="3" y="3" width="22" height="22" rx="8" fill="#ffff00" stroke="#ff00ff" stroke-width="3"/><text x="14" y="19" text-anchor="middle" font-size="18" fill="#a100a1">×</text></svg>';
    }
  }

  function showChat() {
    const idx = parseInt(select.value, 10) || 0;
    setModalTheme(idx);
    if (isMobile()) {
      if (!chatBlock) return;
      chatBlock.style.display = 'flex';
      openBtn.textContent = 'Скрыть чат Twitch';
    } else {
      if (!modal) return;
      modal.classList.add('open');
      openBtn.textContent = 'Скрыть чат Twitch';
    }
    chatOpen = true;
  }

  function hideChat() {
    if (isMobile()) {
      if (!chatBlock) return;
      chatBlock.style.display = 'none';
      openBtn.textContent = 'Открыть чат Twitch';
    } else {
      if (!modal) return;
      modal.classList.remove('open');
      openBtn.textContent = 'Открыть чат Twitch';
    }
    chatOpen = false;
  }

  openBtn.onclick = function() {
    if (chatOpen) {
      hideChat();
    } else {
      showChat();
    }
  };

  if (closeModalBtn) {
    closeModalBtn.onclick = function() {
      hideChat();
    };
  }

  if (dragbar && modal) {
    dragbar.addEventListener('mousedown', function(e) {
      if (isMobile()) return;
      isDragging = true;
      const rect = modal.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', function(e) {
      if (isDragging && modal) {
        let x = e.clientX - dragOffsetX;
        let y = e.clientY - dragOffsetY;
        x = Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, x));
        y = Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, y));
        modal.style.left = x + 'px';
        modal.style.top = y + 'px';
        modal.style.right = 'auto';
      }
    });
    document.addEventListener('mouseup', function() {
      isDragging = false;
      document.body.style.userSelect = '';
    });
  }


  function startResize(dir, e) {
    if (isMobile()) return;
    isResizing = true;
    resizeDir = dir;
    resizeStart = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: modal.offsetWidth,
      height: modal.offsetHeight,
      left: modal.offsetLeft,
      top: modal.offsetTop
    };
    document.body.style.userSelect = 'none';
    e.preventDefault();
  }

  if (resizeLeft && modal) resizeLeft.addEventListener('mousedown', e => startResize('left', e));
  if (resizeRight && modal) resizeRight.addEventListener('mousedown', e => startResize('right', e));
  if (resizeTop && modal) resizeTop.addEventListener('mousedown', e => startResize('top', e));
  if (resizeBottom && modal) resizeBottom.addEventListener('mousedown', e => startResize('bottom', e));

  document.addEventListener('mousemove', function(e) {
    if (isResizing && modal) {
      let minW = 320, minH = 320, maxW = window.innerWidth - 8, maxH = window.innerHeight - 8;
      let newW = resizeStart.width, newH = resizeStart.height, newLeft = resizeStart.left, newTop = resizeStart.top;
      if (resizeDir === 'right') {
        newW = Math.max(minW, Math.min(maxW - modal.offsetLeft, resizeStart.width + (e.clientX - resizeStart.mouseX)));
      } else if (resizeDir === 'left') {
        let delta = e.clientX - resizeStart.mouseX;
        newW = Math.max(minW, Math.min(maxW, resizeStart.width - delta));
        newLeft = Math.min(resizeStart.left + delta, resizeStart.left + resizeStart.width - minW);
        if (newLeft < 8) {
          newW = newW - (8 - newLeft);
          newLeft = 8;
        }
      } else if (resizeDir === 'bottom') {
        newH = Math.max(minH, Math.min(maxH - modal.offsetTop, resizeStart.height + (e.clientY - resizeStart.mouseY)));
      } else if (resizeDir === 'top') {
        let delta = e.clientY - resizeStart.mouseY;
        newH = Math.max(minH, Math.min(maxH, resizeStart.height - delta));
        newTop = Math.min(resizeStart.top + delta, resizeStart.top + resizeStart.height - minH);
        if (newTop < 8) {
          newH = newH - (8 - newTop);
          newTop = 8;
        }
      }
      if (resizeDir === 'left') modal.style.left = newLeft + 'px';
      if (resizeDir === 'top') modal.style.top = newTop + 'px';
      modal.style.width = newW + 'px';
      modal.style.height = newH + 'px';
    }
  });
  document.addEventListener('mouseup', function() {
    isResizing = false;
    resizeDir = '';
    document.body.style.userSelect = '';
  });

  document.addEventListener('keydown', function(e) {
    if (chatOpen && e.key === 'Escape') {
      hideChat();
    }
  });

  if (phoneBtn) {
    phoneBtn.addEventListener('click', function(e) {
      if (!isMobile()) {
        e.preventDefault();
        window.open('https://telefon-doveria.ru/', '_blank');
      }
    });
  }

  window.addEventListener('resize', function() {
    if (chatOpen && !isMobile()) {
      hideChat();
      openBtn.textContent = 'Открыть чат Twitch';
    }
  });

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

    loginButtons.forEach(btn => {
        btn.addEventListener('click', twitchLogin);
    });

    sendForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('.chat-input');
            const message = input.value.trim();
            const channel = getCurrentChannelName();

            if (message && tmiClient && tmiClient.readyState() === 'OPEN') {
                tmiClient.say(channel, message);
                input.value = '';
            }
        });
    });
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

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showCopyNotification();
    }).catch(function(err) {
      console.error('Ошибка копирования:', err);
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
      console.error('Ошибка копирования (fallback):', err);
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