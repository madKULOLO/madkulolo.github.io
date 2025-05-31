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

    const size = randomBetween(30, 80);
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';

    const side = Math.random() < 0.5 ? 'left' : 'right';
    const offset = randomBetween(0, 10); 
    bubble.style.position = 'fixed';
    bubble.style[side] = offset + 'px';
    bubble.style.bottom = '-90px';

    bubble.style.border = '2px solid rgba(255,255,255,0.7)';
    bubble.style.background = 'rgba(255,255,255,0.08)';
    bubble.style.borderRadius = '50%';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = 9998;
    bubble.style.opacity = randomBetween(0.5, 0.9);

    bubble.style.animation = `bubble-float ${randomBetween(10/speed, 18/speed)}s linear forwards`;

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
    box-sizing: border-box;
    transition: opacity 0.5s;
}
@keyframes bubble-float {
    to {
        transform: translateY(-110vh) scale(1.1) rotate(360deg);
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