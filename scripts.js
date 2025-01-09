function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(function(err) {
        console.error('Дедус руина, дал жидкого. Ошибка: ', err);
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
        const streamLink = document.getElementById("popupBanner");
        if (isLive) {
            streamLink.style.display = "block"; 
        } else {
            streamLink.style.display = "none"; 
        }
    } catch (error) {
        console.error("Failed to fetch stream status:", error);
    }
}

document.addEventListener("DOMContentLoaded", checkStreamStatus);

function closeBanner() {
    document.getElementById('popupBanner').style.display = 'none';
}
