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
        const isLive = data.data && data.data.length > 0;
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
        } else {
            console.error('Popup banner element not found');
        }
    } catch (error) {
        console.error("Не удалось получить статус стрима:", error);
    }
}

document.addEventListener("DOMContentLoaded", checkStreamStatus);

function closeBanner() {
    document.getElementById('popupBanner').style.display = 'none';
}
