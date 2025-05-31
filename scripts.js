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
    const channelName = "mazon_alex";
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

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff']
    });
}

function triggerTrollConfetti() {
    confetti({
        particleCount: 40,
        spread: 80,
        origin: { y: 0.5 },
        shapes: ['image'],
        shapeOptions: {
            image: [
                {
                    src: './images/trollface.png',
                    width: 40,
                    height: 40
                }
            ]
        }
    });
}

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
