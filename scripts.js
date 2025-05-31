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
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            if (searchTerm === '') {
                document.querySelectorAll('.command-category').forEach(category => {
                    const commandList = category.querySelector('.command-list');
                    if (category.classList.contains('expanded')) {
                        commandList.classList.add('show');
                    } else {
                        commandList.classList.remove('show');
                    }
                    commandList.querySelectorAll('ul li').forEach(li => li.style.display = 'list-item');
                });
            } else {
                document.querySelectorAll('.command-category').forEach(category => {
                    const commandList = category.querySelector('.command-list');
                    const lis = commandList.querySelectorAll('ul li');
                    const matchingLis = Array.from(lis).filter(li => li.textContent.toLowerCase().includes(searchTerm));
                    if (matchingLis.length > 0) {
                        commandList.classList.add('show');
                        lis.forEach(li => {
                            if (li.textContent.toLowerCase().includes(searchTerm)) {
                                li.style.display = 'list-item';
                            } else {
                                li.style.display = 'none';
                            }
                        });
                    } else {
                        commandList.classList.remove('show');
                    }
                });
            }
        });
    }

    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const commandList = this.nextElementSibling;
            commandList.classList.toggle('show');
            this.parentElement.classList.toggle('expanded');
        });
    });
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
        "Тебе он тоже кидал писюн?"
    ];

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        const randomIndex = Math.floor(Math.random() * loadingTexts.length);
        const randomText = loadingTexts[randomIndex];
        loadingElement.setAttribute('data-text', randomText);
    }
});
function insertDedMarquee() {
    const marquee = document.createElement('marquee');
    marquee.className = 'retro-marquee';
    marquee.setAttribute('behavior', 'scroll');
    marquee.setAttribute('direction', 'left');
    marquee.innerHTML = 'ПОДДЕРЖИ ДЕДА! ДЕД ЛУЧШИЙ! ДЕДУ НУЖНЫ ДЕНЬГИ ДО ПЕНСИИ! ЮЗАЙ, DOCTYPE ХТМЛ, CSS И JS, ЧТОБЫ ПОМОЧЬ ДЕДУ! ДЕД СТРИМИТ НА TWITCH, ПОДПИШИСЬ НА НЁГО! ДЕД ХОЧЕТ КУПИТЬ НОВЫЙ КОМП, ПОМОГИ ЕМУ!';
    document.body.insertAdjacentElement('afterbegin', marquee);
}

document.addEventListener('DOMContentLoaded', insertDedMarquee);