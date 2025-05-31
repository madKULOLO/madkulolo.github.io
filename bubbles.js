const delay = 10; 
const speed = 7;  
let started = false;

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
    const edge = side === 'left' ? 0 : window.innerWidth - size;
    const startY = randomBetween(window.innerHeight * 0.2, window.innerHeight * 0.8);

    bubble.style.position = 'fixed';
    bubble.style.left = edge + 'px';
    bubble.style.top = startY + 'px';
    bubble.style.border = '2px solid rgba(255,255,255,0.7)';
    bubble.style.background = 'rgba(255,255,255,0.08)';
    bubble.style.borderRadius = '50%';
    bubble.style.pointerEvents = 'none';
    bubble.style.zIndex = 9998;
    bubble.style.opacity = randomBetween(0.5, 0.9);
    bubble.style.boxSizing = 'border-box';

    document.body.appendChild(bubble);

    const duration = randomBetween(10 / speed, 18 / speed) * 1000;
    const arc = randomBetween(0.2, 0.6) * window.innerWidth * (side === 'left' ? 1 : -1);
    const drift = randomBetween(-0.2, 0.2) * window.innerHeight;

    const startTime = performance.now();

    function animate(now) {
        const t = (now - startTime) / duration;
        if (t > 1) {
            bubble.remove();
            return;
        }
        const progress = t;
        const x = edge + arc * Math.sin(Math.PI * progress);
        const y = startY - progress * (window.innerHeight * 0.8) + drift * Math.sin(Math.PI * progress);
        bubble.style.transform = `translate(${x - edge}px, ${y - startY}px) scale(${1 + 0.1 * Math.sin(progress * Math.PI * 2)})`;
        bubble.style.opacity = (1 - progress) * 0.8;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

(function addBubbleStyles() {
    const style = document.createElement('style');
    style.textContent = `
.bubble-bubble {
    will-change: transform, opacity;
    box-sizing: border-box;
    transition: opacity 0.5s;
}
    `;
    document.head.appendChild(style);
})();

function startBubbles() {
    if (started) return;
    started = true;
    setInterval(createBubble, 350);
}

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(startBubbles, delay * 1000);
});