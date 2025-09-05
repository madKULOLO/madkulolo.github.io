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

    const channelName = channels.find(ch => ch.id === channelId)?.name || 'madkulolo';

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
        } else {
            const altResponse = await fetch(`https://7tv.io/v3/users/${channelName}`);
            if (altResponse.ok) {
                const altData = await altResponse.json();
                if (altData && altData.emote_set && Array.isArray(altData.emote_set.emotes)) {
                    altData.emote_set.emotes.forEach(e => {
                        const url = `https://cdn.7tv.app/emote/${e.id}/1x.webp`;
                        sevenTvChannelEmotes.set(e.name, url);
                    });
                }
            }
        }
    } catch (e) {}
    
    sevenTvChannelEmotes.set('madkuWHO', 'https://cdn.7tv.app/emote/01J8PPGJ3G000D15QN0BDGM4PS/1x.webp');
    
    activeThirdPartyEmotes.bttv = new Map([...globalThirdPartyEmotes.bttv, ...bttvChannelEmotes]);
    activeThirdPartyEmotes.ffz = new Map([...globalThirdPartyEmotes.ffz, ...ffzChannelEmotes]);
    activeThirdPartyEmotes.sevenTv = new Map([...globalThirdPartyEmotes.sevenTv, ...sevenTvChannelEmotes]);
    

    const totalEmotes = activeThirdPartyEmotes.bttv.size + activeThirdPartyEmotes.ffz.size + activeThirdPartyEmotes.sevenTv.size;
    if (totalEmotes === 0) {
        activeThirdPartyEmotes.bttv.set('TestEmote1', 'https://cdn.betterttv.net/emote/54fa925e01e468494b85b54d/1x');
        activeThirdPartyEmotes.bttv.set('TestEmote2', 'https://cdn.betterttv.net/emote/566ca04265dbbdab32ec054a/1x');
        activeThirdPartyEmotes.bttv.set('TestEmote3', 'https://cdn.betterttv.net/emote/566ca38765dbbdab32ec055b/1x');
    }
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

function populateEmoteMenu(menu, provider) {
    const container = menu.querySelector('.emote-container');
    container.innerHTML = '';
    const emotes = activeThirdPartyEmotes[provider];
    if (!emotes || emotes.size === 0) {
        const noEmotesMsg = document.createElement('div');
        noEmotesMsg.style.textAlign = 'center';
        noEmotesMsg.style.padding = '20px';
        noEmotesMsg.style.color = '#666';
        noEmotesMsg.style.fontStyle = 'italic';
        noEmotesMsg.textContent = 'Нет смайликов 😢';
        container.appendChild(noEmotesMsg);
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
            
            const emoteElement = document.createElement('img');
            emoteElement.src = url;
            emoteElement.alt = name;
            emoteElement.className = 'emote-inline';
            emoteElement.dataset.emoteName = name;
            emoteElement.draggable = false;
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && input.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                
                let needsSpaceBefore = false;
                if (range.startContainer.nodeType === Node.TEXT_NODE) {
                    const textBefore = range.startContainer.textContent.substring(0, range.startOffset);
                    needsSpaceBefore = textBefore.length > 0 && !textBefore.endsWith(' ');
                } else {
                    let prevNode = range.startContainer.previousSibling;
                    if (!prevNode && range.startContainer.parentNode !== input) {
                        prevNode = range.startContainer.parentNode.previousSibling;
                    }
                    needsSpaceBefore = prevNode !== null;
                }
                
                if (needsSpaceBefore) {
                    const spaceNode = document.createTextNode(' ');
                    range.insertNode(spaceNode);
                    range.setStartAfter(spaceNode);
                }
                
                range.insertNode(emoteElement);
                
                const spaceAfter = document.createTextNode(' ');
                range.setStartAfter(emoteElement);
                range.insertNode(spaceAfter);
                
                range.setStartAfter(spaceAfter);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                const needsSpaceBefore = input.childNodes.length > 0 && 
                    (input.lastChild.nodeType === Node.ELEMENT_NODE || 
                     (input.lastChild.nodeType === Node.TEXT_NODE && !input.lastChild.textContent.endsWith(' ')));
                
                if (needsSpaceBefore) {
                    input.appendChild(document.createTextNode(' '));
                }
                
                input.appendChild(emoteElement);
                input.appendChild(document.createTextNode(' '));
                
                input.focus();
                const range = document.createRange();
                range.selectNodeContents(input);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            input.classList.add('emote-added');
            setTimeout(() => input.classList.remove('emote-added'), 300);
        };

        container.appendChild(img);
    });
}

function populateMobileEmoteStrip(strip) {
    strip.innerHTML = '';
    
    const allEmotes = new Map();
    
    activeThirdPartyEmotes.bttv.forEach((url, name) => allEmotes.set(name, url));
    activeThirdPartyEmotes.ffz.forEach((url, name) => allEmotes.set(name, url));
    activeThirdPartyEmotes.sevenTv.forEach((url, name) => allEmotes.set(name, url));
    
    if (allEmotes.size === 0) {
        const noEmotesMsg = document.createElement('div');
        noEmotesMsg.style.textAlign = 'center';
        noEmotesMsg.style.padding = '20px';
        noEmotesMsg.style.color = '#666';
        noEmotesMsg.style.fontStyle = 'italic';
        noEmotesMsg.textContent = 'Нет смайликов 😢';
        strip.appendChild(noEmotesMsg);
        return;
    }
    
    allEmotes.forEach((url, name) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = name;
        img.title = name;
        img.className = 'emote-item';
        img.onclick = () => {
            const controls = strip.closest('.custom-chat-controls');
            if (!controls) return;
            
            const input = controls.querySelector('.chat-input');
            if (!input) return;
            
            const emoteElement = document.createElement('img');
            emoteElement.src = url;
            emoteElement.alt = name;
            emoteElement.className = 'emote-inline';
            emoteElement.dataset.emoteName = name;
            emoteElement.draggable = false;
            
            const selection = window.getSelection();
            if (selection.rangeCount > 0 && input.contains(selection.anchorNode)) {
                const range = selection.getRangeAt(0);
                
                let needsSpaceBefore = false;
                if (range.startContainer.nodeType === Node.TEXT_NODE) {
                    const textBefore = range.startContainer.textContent.substring(0, range.startOffset);
                    needsSpaceBefore = textBefore.length > 0 && !textBefore.endsWith(' ');
                } else {
                    let prevNode = range.startContainer.previousSibling;
                    if (!prevNode && range.startContainer.parentNode !== input) {
                        prevNode = range.startContainer.parentNode.previousSibling;
                    }
                    needsSpaceBefore = prevNode !== null;
                }
                
                if (needsSpaceBefore) {
                    const spaceNode = document.createTextNode(' ');
                    range.insertNode(spaceNode);
                    range.setStartAfter(spaceNode);
                }
                
                range.insertNode(emoteElement);
                
                const spaceAfter = document.createTextNode(' ');
                range.setStartAfter(emoteElement);
                range.insertNode(spaceAfter);
                
                range.setStartAfter(spaceAfter);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                const needsSpaceBefore = input.childNodes.length > 0 && 
                    (input.lastChild.nodeType === Node.ELEMENT_NODE || 
                     (input.lastChild.nodeType === Node.TEXT_NODE && !input.lastChild.textContent.endsWith(' ')));
                
                if (needsSpaceBefore) {
                    input.appendChild(document.createTextNode(' '));
                }
                
                input.appendChild(emoteElement);
                input.appendChild(document.createTextNode(' '));
                
                input.focus();
                const range = document.createRange();
                range.selectNodeContents(input);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
            
            input.classList.add('emote-added');
            setTimeout(() => input.classList.remove('emote-added'), 300);
        };
        strip.appendChild(img);
    });
}

function initializeEmoteMenus() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        document.querySelectorAll('.emote-menu-btn').forEach((btn) => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                const controls = newBtn.closest('.custom-chat-controls');
                if (!controls) return;
                
                let mobileStrip = controls.querySelector('.mobile-emote-strip');
                
                if (!mobileStrip) {
                    mobileStrip = document.createElement('div');
                    mobileStrip.className = 'mobile-emote-strip';
                    mobileStrip.style.display = 'none';
                    controls.appendChild(mobileStrip);
                }
                
                const isOpen = mobileStrip.style.display === 'flex';
                
                document.querySelectorAll('.mobile-emote-strip').forEach(strip => {
                    strip.style.display = 'none';
                });
                
                if (!isOpen) {
                    mobileStrip.style.display = 'flex';
                    populateMobileEmoteStrip(mobileStrip);
                } else {
                    mobileStrip.style.display = 'none';
                }
            });
        });
    } else {
        document.querySelectorAll('.emote-menu-btn').forEach((btn, index) => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const menu = newBtn.nextElementSibling;
                if (!menu || !menu.classList.contains('emote-menu')) return;
                const isOpen = menu.classList.contains('open');
                document.querySelectorAll('.emote-menu').forEach(m => {
                    m.classList.remove('open');
                });
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
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', (e) => {
                const menu = newTab.closest('.emote-menu');
                menu.querySelectorAll('.emote-tab').forEach(t => t.classList.remove('active'));
                newTab.classList.add('active');
                populateEmoteMenu(menu, newTab.dataset.provider);
            });
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.emote-menu-wrapper') && !e.target.closest('.custom-chat-controls')) {
            document.querySelectorAll('.emote-menu').forEach(m => m.classList.remove('open'));
            document.querySelectorAll('.mobile-emote-strip').forEach(strip => {
                strip.style.display = 'none';
            });
        }
    });
}

function updateUIForLoginState() {
    const token = localStorage.getItem('twitch_access_token');
    if (token && userInfo.login) {
        document.querySelectorAll('.chat-login-wrapper').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.chat-send-form').forEach(el => el.style.display = 'flex');
        setTimeout(() => initializeEmoteMenus(), 100);
    } else {
        document.querySelectorAll('.chat-login-wrapper').forEach(el => el.style.display = 'flex');
        document.querySelectorAll('.chat-send-form').forEach(el => el.style.display = 'none');
    }
    switchChannel(parseInt(select.value, 10));
}

window.addEventListener('resize', () => {
    clearTimeout(window.emoteResizeTimeout);
    window.emoteResizeTimeout = setTimeout(() => {
        if (localStorage.getItem('twitch_access_token') && userInfo.login) {
            initializeEmoteMenus();
        }
    }, 250);
});

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

function updateEmoteButtonIcons(idx) {
    const emoteButtons = document.querySelectorAll('.emote-menu-btn');
    const icon = idx === 1 ? '🩸' : '😀';
    emoteButtons.forEach(btn => {
        btn.textContent = icon;
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
    
    updateEmoteButtonIcons(idx);
    
    const modal = document.getElementById('twitchChatModal');
    if (modal && modal.classList.contains('open')) {
        setModalTheme(idx);
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

function showChannelLoading(message) {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'flex';
        loading.setAttribute('data-text', message.toUpperCase());
        
        if (message.includes('лезвие')) {
            loading.style.background = '#000000';
            loading.classList.add('knife-cut-loading');
            createKnifeCutEffect();
        } else {
            loading.style.background = '#ff00ff';
            loading.classList.remove('knife-cut-loading');
        }
    }
}

function createKnifeCutEffect() {
    const loading = document.getElementById('loading');
    if (!loading) return;
    
    const knifeSlash = document.createElement('div');
    knifeSlash.className = 'knife-slash';
    loading.appendChild(knifeSlash);
    
    const bloodDrip = document.createElement('div');
    bloodDrip.className = 'blood-drip';
    loading.appendChild(bloodDrip);
    
    const screenCrack = document.createElement('div');
    screenCrack.className = 'screen-crack';
    loading.appendChild(screenCrack);
    
    setTimeout(() => {
        knifeSlash.classList.add('animate');
        screenCrack.classList.add('animate');
        setTimeout(() => {
            bloodDrip.classList.add('animate');
        }, 300);
    }, 100);
}

function hideChannelLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.display = 'none';
            loading.classList.remove('knife-cut-loading');
            const knifeSlash = loading.querySelector('.knife-slash');
            const bloodDrip = loading.querySelector('.blood-drip');
            const screenCrack = loading.querySelector('.screen-crack');
            if (knifeSlash) knifeSlash.remove();
            if (bloodDrip) bloodDrip.remove();
            if (screenCrack) screenCrack.remove();
        }, 800);
    }
}

async function switchChannel(idx) {
    const channel = channels[idx];
    const loadingMessage = idx === 0 ? 'ой-ёй, ковыляю...' : 'достаём лезвие';
    
    showChannelLoading(loadingMessage);
    
    await fetchThirdPartyEmotes(channel.id);
    connectToChat(channel.name);
    
    const embedDiv = document.getElementById('playerTwitchEmbed');
    if (embedDiv) {
        embedDiv.innerHTML = '';
        const iframe = document.createElement('iframe');
        iframe.src = idx === 0 ? 'https://stream.deduso.su/b4f30518-04f7-4a78-a3a3-5ce0b836a160.html' : 'https://stream.deduso.su/9f3dda91-feed-452d-aec7-9171d404109e.html';
        iframe.frameborder = '0';
        iframe.allowfullscreen = 'true';
        iframe.scrolling = 'no';
        iframe.style.cssText = 'width:100%; height:100%; display: block; border: none;';
        embedDiv.appendChild(iframe);
    }
  
    setTheme(idx);
    setContent(idx);
    setAnimations(idx);
    
    hideChannelLoading();
}

select.addEventListener('change', () => switchChannel(parseInt(select.value, 10)));

function getCurrentChannelName() {
    return channels[parseInt(select.value, 10)].name;
}

function setModalTheme(idx) {
    const modal = document.getElementById('twitchChatModal');
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
    function handleFormSubmit(e, form, input) {
        e.preventDefault();
        
        let message = '';
        const childNodes = Array.from(input.childNodes);
        
        childNodes.forEach((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                message += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('emote-inline')) {
                const emoteName = node.dataset.emoteName || node.alt;
                
                if (message && !message.endsWith(' ')) {
                    message += ' ';
                }
                
                message += emoteName;
                
                if (index < childNodes.length - 1) {
                    const nextNode = childNodes[index + 1];
                    if (nextNode.nodeType === Node.ELEMENT_NODE || 
                        (nextNode.nodeType === Node.TEXT_NODE && !nextNode.textContent.startsWith(' '))) {
                        message += ' ';
                    }
                } else {
                    message += ' ';
                }
            }
        });
        
        message = message.trim();
        const channel = getCurrentChannelName();
        
        if (message && tmiClient && tmiClient.readyState() === 'OPEN') {
            tmiClient.say(channel, message);
            input.innerHTML = '';
        }
    }

    sendForms.forEach(form => {
        const input = form.querySelector('.chat-input');
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const submitEvent = { preventDefault: () => {} };
                handleFormSubmit(submitEvent, form, input);
            }
        });
        
        form.addEventListener('submit', e => {
            e.preventDefault();
            handleFormSubmit(e, form, input);
        });
    });

    initializeEmoteMenus();

    document.addEventListener('click', (e) => {
        document.querySelectorAll('.emote-menu-wrapper').forEach(wrapper => {
            if (!wrapper.contains(e.target)) {
                wrapper.querySelector('.emote-menu').classList.remove('open');
            }
        });
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
