



function checkStreamStatus() {
    var channelName = "madkulolo";
    var clientId = "gp762nuuoqcoxypju8c569th9wz7q5";
    var accessToken = "nicnpw2xfm36f0fewnz1dtzww9i3hj";
    
    var twitchBtn = document.querySelector('.error-btn[href*="twitch.tv"]');
    
    if (!twitchBtn) return;
    
    fetch('https://api.twitch.tv/helix/streams?user_login=' + channelName, {
        headers: {
            'Client-ID': clientId,
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        var stream = data.data[0];
        var isLive = stream && stream.type === "live";
        
        if (isLive) {
            twitchBtn.style.display = 'inline-block';
            twitchBtn.innerHTML = '<i class="fab fa-twitch"></i> 🔴 К СТРИМУ ДЕДА!'
            twitchBtn.style.backgroundColor = '#ff0000';
        } else {
            twitchBtn.style.display = 'none';
        }
    })
    .catch(function(error) {
        console.error("Не удалось получить статус стрима:", error);
        twitchBtn.style.display = 'none';
    });
}

function dvdBounce() {
    var trolls = document.querySelectorAll('.troll-face');
    
    trolls.forEach(function(troll, index) {
        var x = 50 + index * 100;
        var y = 50 + index * 50;
        var dx = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
        var dy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2);
        var size = troll.offsetWidth || 80;
        
        function animate() {
            x += dx;
            y += dy;
            
            if (x <= 0 || x >= window.innerWidth - size) {
                dx = -dx;
                x = Math.max(0, Math.min(window.innerWidth - size, x));
            }
            
            if (y <= 0 || y >= window.innerHeight - size) {
                dy = -dy;
                y = Math.max(0, Math.min(window.innerHeight - size, y));
            }
            
            troll.style.left = x + 'px';
            troll.style.top = y + 'px';
            
            requestAnimationFrame(animate);
        }
        
        animate();
    });
}

function createStars() {
    var starsContainer = document.getElementById('stars');
    var starCount = 50;
    
    for (var i = 0; i < starCount; i++) {
        var star = document.createElement('div');
        if (star.classList) {
            star.classList.add('star');
        } else {
            star.className += ' star';
        }
        
        star.style.left = (Math.random() * 100) + '%';
        star.style.top = (Math.random() * 100) + '%';
        
        var size = Math.random() * 4 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        var delay = Math.random() * 2;
        if (star.style.webkitAnimationDelay !== undefined) {
            star.style.webkitAnimationDelay = delay + 's';
        }
        if (star.style.mozAnimationDelay !== undefined) {
            star.style.mozAnimationDelay = delay + 's';
        }
        star.style.animationDelay = delay + 's';
        
        starsContainer.appendChild(star);
    }
}

function initPage() {
    createStars();
    checkStreamStatus();
    setTimeout(dvdBounce, 1000);
    
    var container = document.querySelector('.error-container');
    if (container) {
        setInterval(function() {
            var resetAnimation = function() {
                container.style.webkitAnimation = '';
                container.style.mozAnimation = '';
                container.style.animation = '';
            };
            
            resetAnimation();
            
            setTimeout(function() {
                container.style.webkitAnimation = 'float 4s ease-in-out infinite';
                container.style.mozAnimation = 'float 4s ease-in-out infinite';
                container.style.animation = 'float 4s ease-in-out infinite';
            }, 100);
        }, 5000);
    }
}

function setupButtonListeners() {
    var buttons = document.querySelectorAll('.error-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
            e.preventDefault();
            triggerErrorConfetti();
            
            var targetUrl = this.href || this.getAttribute('href');
            
            setTimeout(function() {
                window.location.href = targetUrl;
            }, 500);
        });
    }
}

function triggerErrorConfetti() {
    var colors = ['#ff0000', '#ff00ff', '#00ffff', '#ffff00', '#00ff00'];
    var shapes = ['💥', '💣', '🔥', '⚡', '💢'];
    
    for (var i = 0; i < 50; i++) {
        setTimeout(function(index) {
            return function() {
                var confetti = document.createElement('div');
                confetti.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.position = 'fixed';
                confetti.style.left = (Math.random() * 100) + '%';
                confetti.style.top = '-50px';
                confetti.style.fontSize = (Math.random() * 30 + 20) + 'px';
                confetti.style.zIndex = '9999';
                confetti.style.pointerEvents = 'none';
                confetti.style.userSelect = 'none';
                

                
                document.body.appendChild(confetti);
                
                var posY = -50;
                var posX = parseFloat(confetti.style.left);
                
                function animateFall() {
                    posY += 5;
                    posX += Math.sin(posY / 30) * 2;
                    confetti.style.top = posY + 'px';
                    confetti.style.left = posX + '%';
                    
                    if (posY > window.innerHeight) {
                        if (confetti.parentNode) {
                            confetti.parentNode.removeChild(confetti);
                        }
                    } else {
                        requestAnimationFrame(animateFall);
                    }
                }
                
                animateFall();
            };
        }(i), i * 30);
    }
}

function initializeApp() {
    initPage();
    setupButtonListeners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

setInterval(checkStreamStatus, 60000);