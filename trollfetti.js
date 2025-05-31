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
