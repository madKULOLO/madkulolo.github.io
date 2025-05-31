const delay = 10; 
const speed = 7; 
let started = false;
let intervalId = null;

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble-bubble';
    const size = randomBetween(20, 60);
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.left = randomBetween(0, 100) + 'vw';
    bubble.style.background = `rgba(${Math.floor(randomBetween(100,255))},${Math.floor(randomBetween(100,255))},${Math.floor(randomBetween(100,255))},${randomBetween(0.2,0.4)})`;
    bubble.style.position = 'fixed';
    bubble.style.bottom = '-70px';
    bubble.style.borderRadius = '50%';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = 9998;
    bubble.style.boxShadow = `0 0 20px 5px rgba(0,0,0,0.1)`;
    bubble.style.animation = `bubble-float ${randomBetween(8/speed, 16/speed)}s linear forwards`;
    document.body.appendChild(bubble);

    bubble.addEventListener('animationend', () => {
        bubble.remove();
    });
}

(function addBubbleStyles() {
    const style = document.createElement('style');
    style.textContent = `
.bubble-bubble {
    will-change: transform, opacity;
}
@keyframes bubble-float {
    to {
        transform: translateY(-110vh) scale(1.2) rotate(360deg);
        opacity: 0.2;
    }
}
    `;
    document.head.appendChild(style);
})();

function startBubbles() {
    if (started) return;
    started = true;
    intervalId = setInterval(createBubble, 350);
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(startBubbles, delay * 1000);
});