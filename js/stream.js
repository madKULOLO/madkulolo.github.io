const channels = [
  {
    id: '44433428',
    name: 'madkulolo',
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
    id: '137666497',
    name: 'mrrmaikl',
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

const globalThirdPartyEmotes = {
    bttv: new Map(),
    ffz: new Map(),
    sevenTv: new Map()
};
let activeThirdPartyEmotes = {
    bttv: new Map(),
    ffz: new Map(),
    sevenTv: new Map()
};
let globalEmotesLoaded = false;

async function fetchThirdPartyEmotes(channelId) {
    if (!globalEmotesLoaded) {
        try {
            const response = await fetch('https://api.betterttv.net/3/cached/emotes/global');
            if (response.ok) {
                const emotes = await response.json();
                if (Array.isArray(emotes)) {
                    emotes.forEach(e => globalThirdPartyEmotes.bttv.set(e.code, `https://cdn.betterttv.net/emote/${e.id}/1x`));
                }
            }
        } catch (e) {}
        
        try {
            const response = await fetch('https://api.betterttv.net/3/cached/frankerfacez/emotes/global');
            if (response.ok) {
                const emotes = await response.json();
                if (Array.isArray(emotes)) {
                    emotes.forEach(e => globalThirdPartyEmotes.ffz.set(e.code, `https://cdn.betterttv.net/frankerfacez_emote/${e.id}/1`));
                }
            }
        } catch (e) {}

        try {
            const response = await fetch('https://7tv.io/v3/emote-sets/global');
            if (response.ok) {
                const data = await response.json();
                if (data && Array.isArray(data.emotes)) {
                    data.emotes.forEach(e => {
                        const url = `https://cdn.7tv.app/emote/${e.id}/1x.webp`;
                        globalThirdPartyEmotes.sevenTv.set(e.name, url);
                    });
                }
            }
        } catch (e) {}
        
        globalEmotesLoaded = true;
    }

    const bttvChannelEmotes = new Map();
    const ffzChannelEmotes = new Map();
    const sevenTvChannelEmotes = new Map();

    try {
        const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelId}`);
        if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.channelEmotes)) {
                data.channelEmotes.forEach(e => bttvChannelEmotes.set(e.code, `https://cdn.betterttv.net/emote/${e.id}/1x`));
            }
            if (data && Array.isArray(data.sharedEmotes)) {
                data.sharedEmotes.forEach(e => bttvChannelEmotes.set(e.code, `https://cdn.betterttv.net/emote/${e.id}/1x`));
            }
        }
    } catch (e) {}
    
    try {
        const response = await fetch(`https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${channelId}`);
        if (response.ok) {
            const emotes = await response.json();
            if(Array.isArray(emotes)) {
                emotes.forEach(e => ffzChannelEmotes.set(e.code, `https://cdn.betterttv.net/frankerfacez_emote/${e.id}/1`));
            }
        }
    } catch (e) {}

    try {
        const response = await fetch(`https://api.frankerfacez.com/v1/room/id/${channelId}`);
        if (response.ok) {
            const data = await response.json();
            if (data.sets) {
                for (const setId in data.sets) {
                    const set = data.sets[setId];
                    if (set.emoticons && Array.isArray(set.emoticons)) {
                        set.emoticons.forEach(e => {
                            const url = e.urls['2'] || e.urls['1'];
                            if (url) ffzChannelEmotes.set(e.name, `https:${url}`);
                        });
                    }
                }
            }
        }
    } catch(e) {}
    
    try {
        const userResponse = await fetch(`https://7tv.io/v3/users/twitch/${channelId}`);
        if (userResponse.ok) {
            const userData = await userResponse.json();
            if (userData && Array.isArray(userData.emote_sets)) {
                const emoteSetPromises = userData.emote_sets.map(set => 
                    fetch(`https://7tv.io/v3/emote-sets/${set.id}`).then(res => res.ok ? res.json() : null)
                );
                const emoteSets = await Promise.all(emoteSetPromises);
                emoteSets.forEach(emoteSet => {
                    if (emoteSet && Array.isArray(emoteSet.emotes)) {
                        emoteSet.emotes.forEach(e => {
                            const url = `https://cdn.7tv.app/emote/${e.id}/1x.webp`;
                            sevenTvChannelEmotes.set(e.name, url);
                        });
                    }
                });
            }
        }
    } catch (e) {}
    
    activeThirdPartyEmotes.bttv = new Map([...globalThirdPartyEmotes.bttv, ...bttvChannelEmotes]);
    activeThirdPartyEmotes.ffz = new Map([...globalThirdPartyEmotes.ffz, ...ffzChannelEmotes]);
    activeThirdPartyEmotes.sevenTv = new Map([...globalThirdPartyEmotes.sevenTv, ...sevenTvChannelEmotes]);
}

function parseThirdPartyEmotes(word) {
    if (activeThirdPartyEmotes.bttv.has(word)) return activeThirdPartyEmotes.bttv.get(word);
    if (activeThirdPartyEmotes.ffz.has(word)) return activeThirdPartyEmotes.ffz.get(word);
    if (activeThirdPartyEmotes.sevenTv.has(word)) return activeThirdPartyEmotes.sevenTv.get(word);
    return null;
}

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
            headers: { 'Authorization': `Bearer ${token}`, 'Client-Id': CLIENT_ID }
        });
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            userInfo = { login: data.data[0].login, displayName: data.data[0].display_name, id: data.data[0].id };
            localStorage.setItem('twitch_user_info', JSON.stringify(userInfo));
        }
    } catch (error) { logout(); }
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
        document.querySelectorAll('.chat-login-wrapper').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.chat-send-form').forEach(el => el.style.display = 'flex');
    } else {
        document.querySelectorAll('.chat-login-wrapper').forEach(el => el.style.display = 'flex');
        document.querySelectorAll('.chat-send-form').forEach(el => el.style.display = 'none');
    }
    switchChannel(parseInt(select.value, 10));
}

function displayMessage(tags, message) {
    if (isFirstMessage) {
        chatContainerDesktop.innerHTML = '';
        chatContainerMobile.innerHTML = '';
        isFirstMessage = false;
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';

    const usernameElement = document.createElement('span');
    usernameElement.className = 'chat-username';
    usernameElement.textContent = `${tags['display-name']}: `;
    usernameElement.style.color = tags.color || (select.value === '1' ? '#ffb0b0' : '#a100a1');
    messageElement.appendChild(usernameElement);

    const messageTextElement = document.createElement('span');
    messageTextElement.className = 'chat-message-text';

    const twitchEmotes = tags.emotes || {};
    const messageParts = [];
    let lastIndex = 0;

    Object.keys(twitchEmotes).forEach(emoteId => {
        twitchEmotes[emoteId].forEach(position => {
            const [start, end] = position.split('-').map(Number);
            if (start > lastIndex) {
                messageParts.push({ type: 'text', content: message.substring(lastIndex, start) });
            }
            messageParts.push({ type: 'emote', url: `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`, alt: message.substring(start, end + 1) });
            lastIndex = end + 1;
        });
    });

    if (lastIndex < message.length) {
        messageParts.push({ type: 'text', content: message.substring(lastIndex) });
    }

    messageParts.forEach(part => {
        if (part.type === 'emote') {
            const emoteImg = document.createElement('img');
            emoteImg.src = part.url;
            emoteImg.alt = part.alt;
            emoteImg.className = 'emote';
            messageTextElement.appendChild(emoteImg);
        } else {
            const words = part.content.split(' ');
            words.forEach((word, index) => {
                const emoteUrl = parseThirdPartyEmotes(word);
                if (emoteUrl) {
                    const emoteImg = document.createElement('img');
                    emoteImg.src = emoteUrl;
                    emoteImg.alt = word;
                    emoteImg.className = 'emote';
                    messageTextElement.appendChild(emoteImg);
                } else {
                    messageTextElement.appendChild(document.createTextNode(word));
                }
                if (index < words.length - 1) {
                    messageTextElement.appendChild(document.createTextNode(' '));
                }
            });
        }
    });
    
    messageElement.appendChild(messageTextElement);
    
    chatContainerDesktop.appendChild(messageElement.cloneNode(true));
    chatContainerMobile.appendChild(messageElement);

    chatContainerDesktop.scrollTop = chatContainerDesktop.scrollHeight;
    chatContainerMobile.scrollTop = chatContainerMobile.scrollHeight;
}

function connectToChat(channelName) {
    if (tmiClient) tmiClient.disconnect();
    isFirstMessage = true;
    const token = localStorage.getItem('twitch_access_token');
    let clientOptions = { options: { debug: false }, channels: [channelName] };

    if (token && userInfo.login) {
        clientOptions.identity = { username: userInfo.login, password: `oauth:${token}` };
        const connectedMsg = `<div class="chat-message system-message">Вы вошли как ${userInfo.displayName}.</div>`;
        chatContainerDesktop.innerHTML = connectedMsg;
        chatContainerMobile.innerHTML = connectedMsg;
    } else {
        const connectingMsg = '<div class="chat-message system-message">Чат (только чтение). Войдите, чтобы писать.</div>';
        chatContainerDesktop.innerHTML = connectingMsg;
        chatContainerMobile.innerHTML = connectingMsg;
    }

    tmiClient = new tmi.Client(clientOptions);
    tmiClient.on('message', (channel, tags, message, self) => displayMessage(tags, message));
    tmiClient.connect().catch(err => {
        if (String(err).includes("Login authentication failed")) logout();
        const errorMsg = `<div class="chat-message system-message error">Не удалось подключиться к чату.</div>`;
        chatContainerDesktop.innerHTML = errorMsg;
        chatContainerMobile.innerHTML = errorMsg;
    });
}

function setTheme(idx) {
    const elementsToTheme = [document.body, container, h1, h2, btnGroup, socialLinks, playerContainer, channelSwitcher, document.getElementById('twitchChatModal'), document.getElementById('twitchChatBlock')];
    const channelLabel = document.getElementById('channelLabel');

    if (idx === 1) {
        elementsToTheme.forEach(el => el && el.classList.add('suicide-theme'));
        document.body.style.background = 'radial-gradient(ellipse at center, #232323 0%, #181818 100%)';
        if(channelLabel) channelLabel.style.color = '#a10000';
    } else {
        elementsToTheme.forEach(el => el && el.classList.remove('suicide-theme'));
        document.body.style.background = 'radial-gradient(circle at 60% 40%, #ffccff 0%, #ffff00 100%)';
        if(channelLabel) channelLabel.style.color = '#222';
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
            a.addEventListener('click', e => {
                if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    e.preventDefault();
                    window.open('https://telefon-doveria.ru/', '_blank');
                }
            });
        } else {
            a.href = soc.href;
            a.target = '_blank';
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
    const animatedElements = [h1, h2, btnGroup];
    if (idx === 1) {
        animatedElements.forEach(el => el.style.animation = 'none');
    } else {
        animatedElements.forEach(el => el.style.animation = '');
    }
}

async function switchChannel(idx) {
    const channel = channels[idx];
    await fetchThirdPartyEmotes(channel.id);
    connectToChat(channel.name);
    
    const embedDiv = document.getElementById('playerTwitchEmbed');
    if (embedDiv) {
        embedDiv.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = idx === 0 ? 'https://stream.deduso.su/0cd70214-4b93-45ef-a673-b66fab86a296.html' : 'https://stream.deduso.su/9f3dda91-feed-452d-aec7-9171d404109e.html';
        iframe.frameborder = '0';
        iframe.allowfullscreen = 'true';
        iframe.scrolling = 'no';
        iframe.style.cssText = 'width:100%; aspect-ratio:16/9; height:auto;';
        embedDiv.appendChild(iframe);
    }
  
    setTheme(idx);
    setContent(idx);
    setAnimations(idx);
}

select.addEventListener('change', () => switchChannel(parseInt(select.value, 10)));

function getCurrentChannelName() {
    return channels[parseInt(select.value, 10)].name;
}

document.addEventListener('DOMContentLoaded', async () => {
    let token = handleAuthRedirect() || localStorage.getItem('twitch_access_token');
    if (token) {
        const storedUserInfo = localStorage.getItem('twitch_user_info');
        if (storedUserInfo) userInfo = JSON.parse(storedUserInfo);
        else await fetchUserInfo(token);
    }
    updateUIForLoginState();

    const openBtn = document.getElementById('openTwitchChatBtn');
    const chatBlock = document.getElementById('twitchChatBlock');
    const modal = document.getElementById('twitchChatModal');
    const closeModalBtn = document.getElementById('closeTwitchChatModal');
    const dragbar = document.getElementById('twitchChatModalDragbar');
    let chatOpen = false;

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
        const idx = parseInt(select.value, 10);
        setModalTheme(idx);
        
        if (window.matchMedia('(max-width: 900px)').matches) {
            if (chatBlock) chatBlock.style.display = 'flex';
        } else {
            if (modal) modal.classList.add('open');
        }
        openBtn.textContent = 'Скрыть чат Twitch';
        chatOpen = true;
    }

    function hideChat() {
        if (window.matchMedia('(max-width: 900px)').matches) {
            if (chatBlock) chatBlock.style.display = 'none';
        } else {
            if (modal) modal.classList.remove('open');
        }
        openBtn.textContent = 'Открыть чат Twitch';
        chatOpen = false;
    }

    openBtn.onclick = () => chatOpen ? hideChat() : showChat();
    if (closeModalBtn) closeModalBtn.onclick = hideChat;

    let isDragging = false, isResizing = false;
    let dragOffsetX, dragOffsetY, resizeStart;

    const onMouseMove = (e) => {
        e.preventDefault();
        window.requestAnimationFrame(() => {
            if (isDragging) {
                let x = e.clientX - dragOffsetX;
                let y = e.clientY - dragOffsetY;
                modal.style.left = `${Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, x))}px`;
                modal.style.top = `${Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, y))}px`;
            }
            if (isResizing) {
                let newW = Math.max(320, resizeStart.width + (e.clientX - resizeStart.mouseX));
                let newH = Math.max(320, resizeStart.height + (e.clientY - resizeStart.mouseY));
                modal.style.width = `${newW}px`;
                modal.style.height = `${newH}px`;
            }
        });
    };

    const stopActions = () => {
        isDragging = false;
        isResizing = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', stopActions);
    };

    dragbar.addEventListener('mousedown', e => {
        isDragging = true;
        const rect = modal.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', stopActions);
    });

    const resizeHandle = document.getElementById('twitchChatModalResizeCorner');
    if(resizeHandle) {
        resizeHandle.addEventListener('mousedown', e => {
            isResizing = true;
            resizeStart = { mouseX: e.clientX, mouseY: e.clientY, width: modal.offsetWidth, height: modal.offsetHeight };
            document.body.style.userSelect = 'none';
            e.preventDefault();
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', stopActions);
        });
    }

    document.addEventListener('keydown', e => { if (chatOpen && e.key === 'Escape') hideChat(); });
    loginButtons.forEach(btn => btn.addEventListener('click', twitchLogin));
    sendForms.forEach(form => {
        form.addEventListener('submit', e => {
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

    document.querySelectorAll('.emote-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const menu = btn.nextElementSibling;
            const isOpen = menu.classList.contains('open');
            document.querySelectorAll('.emote-menu').forEach(m => m.classList.remove('open'));
            if (!isOpen) {
                menu.classList.add('open');
                const activeTab = menu.querySelector('.emote-tab.active');
                if (activeTab) {
                    populateEmoteMenu(menu, activeTab.dataset.provider);
                }
            }
        });
    });

    document.querySelectorAll('.emote-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const menu = tab.closest('.emote-menu');
            menu.querySelectorAll('.emote-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            populateEmoteMenu(menu, tab.dataset.provider);
        });
    });

    function populateEmoteMenu(menu, provider) {
        const container = menu.querySelector('.emote-container');
        container.innerHTML = '';
        const emotes = activeThirdPartyEmotes[provider];
        if (!emotes || emotes.size === 0) {
            container.textContent = 'Смайлики не найдены.';
            return;
        }
        emotes.forEach((url, name) => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = name;
            img.title = name;
            img.className = 'emote-item';
            img.onclick = () => {
                const form = menu.closest('form');
                const input = form.querySelector('.chat-input');
                input.value += (input.value ? ' ' : '') + name + ' ';
                input.focus();
            };
            container.appendChild(img);
        });
    }

    document.addEventListener('click', (e) => {
        document.querySelectorAll('.emote-menu-wrapper').forEach(wrapper => {
            if (!wrapper.contains(e.target)) {
                wrapper.querySelector('.emote-menu').classList.remove('open');
            }
        });
    });
});

const openCommandsBtn = document.getElementById('openCommandsBtn');
const commandsPanel = document.getElementById('commandsPanel');
let commandsOpen = false;

function toggleCommandsPanel() {
    commandsOpen = !commandsOpen;
    commandsPanel.classList.toggle('open');
    openCommandsBtn.innerHTML = commandsOpen ? '✖ Спрятать' : '📜CUMанды💦';
}

if (openCommandsBtn) openCommandsBtn.addEventListener('click', toggleCommandsPanel);
document.addEventListener('click', e => {
    if (commandsOpen && commandsPanel && openCommandsBtn && !commandsPanel.contains(e.target) && !openCommandsBtn.contains(e.target)) {
        toggleCommandsPanel();
    }
});
document.addEventListener('keydown', e => { if (commandsOpen && e.key === 'Escape') toggleCommandsPanel(); });

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(showCopyNotification);
}

function showCopyNotification() {
    let notif = document.getElementById('copyNotif');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'copyNotif';
        Object.assign(notif.style, {
            position: 'fixed', left: '50%', bottom: '100px', transform: 'translateX(-50%)',
            background: '#ffff00', color: '#a100a1', border: '2px solid #ff00ff',
            borderRadius: '18px', padding: '16px 36px', fontSize: '1.3rem',
            fontFamily: "'Comic Sans MS', cursive", boxShadow: '0 2px 16px #ff00ff44',
            zIndex: '9999', opacity: '0', transition: 'opacity 0.3s'
        });
        notif.textContent = 'ГОЙЙЙДА!';
        document.body.appendChild(notif);
    }
    notif.style.opacity = '1';
    setTimeout(() => notif.style.opacity = '0', 1200);
}

window.copyToClipboard = copyToClipboard;