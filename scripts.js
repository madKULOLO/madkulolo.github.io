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
    const clientId = "kimne78kx3ncx6brgo4mv6wki5h1ko"; 
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
            headers: {
                'Client-ID': clientId
            }
        });
        const data = await response.json();
        const isLive = data.data && data.data.length > 0;
        const backButton = document.getElementById("backToHome");
        const backText = document.getElementById("backText");

        if (isLive) {
            backButton.href = "https://www.twitch.tv/madkulolo";
            backText.textContent = "🔴Назад к Деду на стрим";
            backButton.style.backgroundColor = "#ff0000";
        } else {
            backButton.href = "/";
            backText.textContent = "Назад к Деду 🏥";
            backButton.style.backgroundColor = "#ff4545";
        }
    } catch (error) {
        console.error("Failed to fetch stream status:", error);
    }
}

document.addEventListener("DOMContentLoaded", checkStreamStatus);

function closeBanner() {
    document.getElementById('popupBanner').style.display = 'none';
}
