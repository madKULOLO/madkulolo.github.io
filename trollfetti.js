function triggerConfetti() {
    for (let i = 0; i < 80; i++) {
        createConfettiParticle();
    }
}

function createConfettiParticle() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];
    const confetti = document.createElement('div');
    confetti.className = 'custom-confetti';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 1 + 1.5) + 's';
    confetti.style.opacity = Math.random() + 0.5;
    confetti.style.width = confetti.style.height = (Math.random() * 8 + 8) + 'px';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2500);
}

function triggerTrollConfetti() {
    for (let i = 0; i < 30; i++) {
        createTrollParticle();
    }
}

function createTrollParticle() {
    const troll = document.createElement('img');
    troll.src = './images/trollface.png'; 
    troll.className = 'troll-confetti';
    troll.style.left = Math.random() * 100 + 'vw';
    troll.style.width = troll.style.height = (Math.random() * 32 + 32) + 'px';
    troll.style.animationDuration = (Math.random() * 1 + 1.8) + 's';
    troll.style.opacity = Math.random() + 0.5;
    document.body.appendChild(troll);
    setTimeout(() => troll.remove(), 3000);
}
