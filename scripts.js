console.log('Дед говорит: не копайся тут, лучше донать!');
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(function(err) {
        console.error('Дедус руина, дал жидкого. Ошибка: ', err);
    });
}

function updateBackButton(event) {
    event.preventDefault();
    checkStreamStatus().then(() => {
        const backButton = document.getElementById("backToHome");
        window.location.href = backButton.href;
    });
}

async function checkStreamStatus() {
    const channelName = "madkulolo";
    const clientId = "gp762nuuoqcoxypju8c569th9wz7q5";
    const accessToken = "nicnpw2xfm36f0fewnz1dtzww9i3hj";

    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        const stream = data.data[0];
        const isLive = stream && stream.type === "live";
        const backButton = document.getElementById("backToHome");
        const backText = document.getElementById("backText");
        const popupBanner = document.getElementById("popupBanner");

        if (backButton && backText) {
            if (isLive) {
                backButton.href = "https://www.twitch.tv/madkulolo";
                backText.textContent = "🔴Назад к Деду на стрим";
                backButton.style.backgroundColor = "#ff0000";
            } else {
                backButton.href = "/";
                backText.textContent = "Назад к Деду домой 🏥";
                backButton.style.backgroundColor = "#ff4545";
            }
        }

        if (popupBanner) {
            if (isLive) {
                popupBanner.style.display = "block";
            } else {
                popupBanner.style.display = "none";
            }
        }
    } catch (error) {
        console.error("Не удалось получить статус стрима:", error);
    }
}

document.addEventListener("DOMContentLoaded", checkStreamStatus);

function closeBanner() {
    document.getElementById('popupBanner').style.display = 'none';
}

window.addEventListener('load', function() {
    document.getElementById('loading').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('commandSearch');
    if (!searchInput) return;

    const categories = Array.from(document.querySelectorAll('.command-category'));
    const commandsList = document.querySelector('.commands-list');

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
            img.src = './images/neko-8.jpg';
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
            msg.innerHTML = '🦵😿 <b>Kessidi</b>, дед ждёт твои ножки уже много лет... <br>Когда же дед дождётся? 😭🦵';
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 4000);
        }
    };

    function resetCategories() {
        categories.forEach(cat => {
            cat.style.display = '';
            cat.classList.remove('expanded');
            const commandList = cat.querySelector('.command-list');
            commandList.classList.remove('show');
            commandList.querySelectorAll('li').forEach(li => li.style.display = '');
        });
        enableCategoryClicks(true);
    }

    function enableCategoryClicks(enable) {
        categories.forEach(cat => {
            const title = cat.querySelector('.category-title');
            const commandList = cat.querySelector('.command-list');
            if (enable) {
                title.style.pointerEvents = '';
                title.onclick = function() {
                    commandList.classList.toggle('show');
                    cat.classList.toggle('expanded');
                };
            } else {
                title.style.pointerEvents = 'none';
                title.onclick = null;
            }
        });
    }

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();

        if (easterEggs[searchTerm]) {
            easterEggs[searchTerm]();
        }

        if (!searchTerm) {
            resetCategories();
            return;
        }

        enableCategoryClicks(false);

        categories.forEach(cat => {
            let hasMatch = false;
            const commandList = cat.querySelector('.command-list');
            commandList.querySelectorAll('li').forEach(li => {
                const text = li.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    li.style.display = '';
                    hasMatch = true;
                } else {
                    li.style.display = 'none';
                }
            });

            if (hasMatch) {
                cat.style.display = '';
                cat.classList.add('expanded');
                commandList.classList.add('show');
            } else {
                cat.style.display = 'none';
                cat.classList.remove('expanded');
                commandList.classList.remove('show');
            }
        });
    });

    enableCategoryClicks(true);
});

function triggerConfetti() {
    for (let i = 0; i < 80; i++) {
        createExplodingParticle('confetti');
    }
}

function triggerTrollConfetti() {
    for (let i = 0; i < 30; i++) {
        createExplodingParticle('troll');
    }
}

function createExplodingParticle(type) {
    const angle = Math.random() * 2 * Math.PI; 
    const velocity = Math.random() * 6 + 4; 
    const duration = 1200 + Math.random() * 600;
    const start = performance.now();

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    let el;
    if (type === 'confetti') {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];
        el = document.createElement('div');
        el.className = 'custom-confetti';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 8;
        el.style.width = el.style.height = size + 'px';
        el.style.borderRadius = '50%';
    } else {
        el = document.createElement('img');
        el.src = './images/trollface.png';
        el.className = 'troll-confetti';
        const size = Math.random() * 32 + 32;
        el.style.width = el.style.height = size + 'px';
    }

    el.style.position = 'fixed';
    el.style.left = startX + 'px';
    el.style.top = startY + 'px';
    el.style.opacity = Math.random() * 0.5 + 0.7;
    el.style.pointerEvents = 'none';
    el.style.zIndex = 99999;
    document.body.appendChild(el);

    function animate(now) {
        const elapsed = now - start;
        const progress = elapsed / duration;
        if (progress > 1) {
            el.remove();
            return;
        }
        const distance = velocity * elapsed / 16 * (1 - progress * 0.5);
        const x = startX + Math.cos(angle) * distance;
        const y = startY + Math.sin(angle) * distance;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.opacity = (1 - progress) * 0.9;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
document.addEventListener('DOMContentLoaded', function() {
    const loadingTexts = [
        "Дедовы яички...",
        "Жди пасхалку",
        "КУЛОКОЛДИМ",
        "Загрузка дедовских приколов...",
        "Дед ищет сайт",
        "ДОНАТЬ НА ДЕДА!",
        ".🐣.",
        "А воот в наше время...",
        "Тебе он тоже кидал писюн?",
        "Юзай Internet Explorer!"
    ];

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';     
        const randomIndex = Math.floor(Math.random() * loadingTexts.length);
        const randomText = loadingTexts[randomIndex];
        loadingElement.setAttribute('data-text', randomText);       
        window.performance.navigation.type === 1;
    }
});
function insertDedMarquee() {
    const marquee = document.createElement('marquee');
    marquee.className = 'retro-marquee';
    marquee.setAttribute('behavior', 'scroll');
    marquee.setAttribute('direction', 'left');
    marquee.innerHTML = 'ПОДДЕРЖИ ДЕДА ДЕНЮЖКОЙ! ДЕД ЛУЧШИЙ! ДЕДУ НУЖНЫ ДЕНЬГИ ДО ПЕНСИИ! ЮЗАЙ, DOCTYPE ХТМЛ, CSS И JS, ЧТОБЫ ПОМОЧЬ ДЕДУ! ДЕД СТРИМИТ НА TWITCH, ПОДПИШИСЬ НА НЁГО! ДЕД ХОЧЕТ КУПИТЬ НОВЫЙ КОМП, ПОМОГИ ЕМУ! ДОНАТЬ!';
    document.body.insertAdjacentElement('afterbegin', marquee);
}

document.addEventListener('DOMContentLoaded', insertDedMarquee);
function insertFooter() {
    const footerContent = `
        <p>© 1994 madKULOLO. Все права МОИ, потому что Я — ДЕДовик.</p>
        <p>Сделано ДЛЯ СЕБЯ, потому что Я заСЛУЖИЛ.</p>
        <p>Деньги идут МНЕ, потому что Я ЛУЧШИЙ. Спасибо, и ничего не обещаю, ибо ДЕМЕНЦИЯ!</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <a href="/eyes" style="font-size: 18px; color: inherit; text-decoration: none; vertical-align: middle;">👁️</a>
            <small>Сайт протестирован и работает безусловно отлично во всех современных браузерах: IE 6, Mozilla Firefox 1.5, Opera 8, Safari 2, Netscape 8.</small>
        </div>
    `;

    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = footerContent;

    document.body.insertAdjacentElement('beforeend', footer);
}

document.addEventListener('DOMContentLoaded', insertFooter);
