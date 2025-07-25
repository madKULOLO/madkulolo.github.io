let globalAudioCtx = null;
function playSound(freq, duration = 0.05, type = 'square') {
    try {
        if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
            globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = globalAudioCtx;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime); 
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
        oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
        };
    } catch (e) {
    }
}
function cleanupAllGamesAndAnimations() {
    try {
        if (typeof matrixInterval !== 'undefined' && matrixInterval) {
            clearInterval(matrixInterval);
            matrixInterval = null;
            if (typeof matrixCanvas !== 'undefined') matrixCanvas.style.display = 'none';
        }
        if (typeof snakeInterval !== 'undefined' && snakeInterval) {
            clearInterval(snakeInterval);
            snakeInterval = null;
        }
        if (typeof tetrisInterval !== 'undefined' && tetrisInterval) {
            clearInterval(tetrisInterval);
            tetrisInterval = null;
        }
        if (typeof invadersInterval !== 'undefined' && invadersInterval) {
            clearInterval(invadersInterval);
            invadersInterval = null;
        }
        if (typeof breakoutInterval !== 'undefined' && breakoutInterval) {
            clearInterval(breakoutInterval);
            breakoutInterval = null;
        }
        snakeActive = false;
        tetrisActive = false;
        invadersActive = false;
        breakoutActive = false;
        guessActive = false;
        if (typeof gameControls !== 'undefined') gameControls.style.display = 'none';
        if (typeof matrixCanvas !== 'undefined') matrixCanvas.style.display = 'none';
    } catch (e) {}
}

function playModemSound(callback) {
    try {
        const tones = [
            { freq: 440, duration: 0.2, type: 'sine' },
            { freq: 880, duration: 0.2, type: 'sine' },
            { freq: 1200, duration: 0.15, type: 'sine' },
            { freq: 600, duration: 0.2, type: 'square' },
            { freq: 1000, duration: 0.25, type: 'sine' }
        ];
        let i = 0;
        function playNext() {
            if (i < tones.length) {
                playSound(tones[i].freq, tones[i].duration, tones[i].type);
                i++;
                setTimeout(playNext, tones[i-1].duration * 1000 + 50);
            } else if (callback) {
                callback();
            }
        }
        playNext();
    } catch (e) {
        if (callback) callback();
    }
}

const bootSequence = document.getElementById('bootSequence');
const bootText = document.getElementById('bootText');
const bootLines = [
    "DEDUS.DOC BIOS v1.2.3\n",
    "Initializing hardware... [OK]\n",
    "Memory check: 640K... [OK]\n",
    Math.random() < 0.3 ? "CMOS checksum error! [OK]\n" : "Checking floppy drive... [OK]\n",
    "Loading DEDUS OS... [OK]\n",
    Math.random() < 0.2 ? "ERROR: Stack Overflow! Retrying...\n" : "",
    "Booting dedANUSi Interactive Game...\n"
];
let bootIndex = 0;

function typeBoot() {
    try {
        if (bootIndex < bootLines.length) {
            let line = bootLines[bootIndex];
            let i = 0;
            function typeLine() {
                if (i < line.length) {
                    bootText.textContent += line[i];
                    playSound(800 + Math.random() * 200, 0.03);
                    i++;
                    setTimeout(typeLine, 20 + Math.random() * 30);
                } else {
                    bootIndex++;
                    if (Math.random() < 0.1 && bootIndex < bootLines.length - 1) {
                        bootSequence.style.background = '#00f';
                        setTimeout(() => { bootSequence.style.background = '#111'; }, 50);
                    }
                    setTimeout(typeBoot, 200 + Math.random() * 300);
                }
            }
            typeLine();
        } else {
            setTimeout(() => {
                bootSequence.classList.add('hidden');
                setTimeout(() => { bootSequence.style.display = 'none'; }, 500);
                document.getElementById('ansiInput').focus();
            }, 1000);
        }
    } catch (e) {
        typeOutput("ERROR: Boot failed!\n(-_-) Твой 486-й сгорел?");
    }
}


function showDedosPowerOverlay() {
    const overlay = document.getElementById('dedosUnlockOverlay');
    if (!overlay) return;
    if (!overlay.hasChildNodes()) {
        overlay.className = 'dedos-unlock-overlay';
        overlay.innerHTML = `
          <div class="dedos-unlock-content">
            <div class="dedos-unlock-title">dedOS</div>
            <div class="dedos-unlock-desc">
              <span>ВКЛЮЧИТЬ ЭВМ?</span><br>
              <div style="margin:14px 0 0 0; color:#0f0; font-size:1em; font-family:'Courier New',monospace;">C:\DEDOS&gt;_</div>
            </div>
            <button id="dedosPowerBtn" class="dedos-unlock-btn" tabindex="0">
              <span class="dedos-power-lamp"><span class="dedos-power-lamp-dot"></span></span>
              <span style="letter-spacing:2px;">ВКЛ / POWER</span>
            </button>
            <div class="dedos-unlock-footer">RETRO DED PC BOOT SEQUENCE © 1994</div>
          </div>
        `;
    }
    const btn = document.getElementById('dedosPowerBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            try {
                playSound(110, 0.09, 'square');
                setTimeout(() => playSound(60, 0.07, 'square'), 60);
            } catch(e) {}
            try {
                if (window.globalAudioCtx) {
                    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
                } else if (window.AudioContext || window.webkitAudioContext) {
                    window.globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
            } catch (e) {}
            setTimeout(() => {
                overlay.style.display = 'none';
                document.getElementById('bootSequence').style.display = '';
                typeBoot();
            }, 220);
        });
    }
    document.getElementById('bootSequence').style.display = 'none';
}

window.addEventListener('DOMContentLoaded', showDedosPowerOverlay);

const input = document.getElementById('ansiInput');
const cursor = document.getElementById('ansiCursor');
const output = document.getElementById('ansiOutput');
const gameControls = document.getElementById('gameControls');
let snakeActive = false;
let tetrisActive = false;
let invadersActive = false;
let breakoutActive = false;
let guessActive = false;
let guessNumber = null;
let guessTries = 0;

const motivators = [
    "Форматируй диск C: своей жизни!",
    "('-') 640K памяти хватит всем!",
    "Твой 56K-модем всё ещё дозванивается!",
    "Y2K прошёл, а ты всё ещё в DOS? Рилле?!",
    "(О_О) Хацкер не сломал dedANUSi.exe!",
    "Пишы 1337 и стань легендойю!",
    "(,-,) Плачет 8-битными слезами!",
    "Сыграй в тетрис или Zассал?",
    "Norton Commander не спасёт и сохранит!",
    "Винда 95 зависла? Играй с дедусом!"
];
document.getElementById('motivation').textContent = motivators[Math.floor(Math.random() * motivators.length)];

const matrixCanvas = document.getElementById('matrixCanvas');
let matrixInterval = null;
function startMatrix() {
    try {
        cleanupAllGamesAndAnimations();
        playModemSound(() => {
            const ctx = matrixCanvas.getContext('2d');
            matrixCanvas.style.display = 'block';
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
            const fontSize = 14;
            const columns = Math.floor(matrixCanvas.width / fontSize);
            const drops = Array(columns).fill(0);
            ctx.font = `${fontSize}px 'Courier New', monospace`;
            ctx.fillStyle = '#0f0';
            
            function drawMatrix() {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
                ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
                ctx.fillStyle = '#0f0';
                drops.forEach((y, i) => {
                    const char = chars[Math.floor(Math.random() * chars.length)];
                    const x = i * fontSize;
                    ctx.fillText(char, x, y * fontSize);
                    if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                });
                if (Math.random() < 0.1) {
                    matrixCanvas.classList.add('matrix-glitch');
                    document.body.style.background = Math.random() < 0.5 ? '#00f' : '#0f0';
                    playSound(500 + Math.random() * 1000, 0.1);
                    setTimeout(() => {
                        matrixCanvas.classList.remove('matrix-glitch');
                        document.body.style.background = '#111';
                    }, 100);
                }
            }

            typeOutput("MATRIX MODE ACTIVATED!\n(^-^) Добро пожаловать в реальный мир!", () => {
                matrixInterval = setInterval(drawMatrix, 33);
                setTimeout(() => {
                    clearInterval(matrixInterval);
                    matrixCanvas.style.display = 'none';
                    typeOutput("У деда мелкий писюнчик...? ПРОСНИСЬ!");
                    setTimeout(() => location.reload(), 1000);
                }, 10000);
            });
        });
    } catch (e) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
        const fallbackArt = Array(10).fill().map(() => 
            Array(40).fill().map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
        ).join('\n');
        typeOutput(`MATRIX MODE FAILED!\n${fallbackArt}\n(>_<) Купи новый 486-й!`, () => {
            setTimeout(() => location.reload(), 10000);
        });
    }
}

const commands = {
    help: `Доступные команды:
help - список команд (ты гений?)
dir - DOS
cls - очисти экран и совесть
ded - секрет деда (осторожно!)
ansi - мемы для 90-х души?
secret - код для элиты
snake - змейка, как на 3310
tetris - тетрис, как на 486-м
invaders - стреляй по аккупантам!
breakout - отбивай шарик палкой!
guess - угадай число или пиздец
joke - анекдот из 90-х?
1337 - хакерский режим
matrix - ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789
exit - сбежать от деда из подвала`,
    dir: `dir /w
DEDUS.EXE   ANUSi.DOC   1337.COM
MEME.BAT    Y2K.SYS     HACKER.TXT
(ಠ_ಠ) 404! Ты думал, тут что-то есть?`,
    cls: "",
    ded: `(☉｡☉)! В 94-м я бы тебя на дискете унёс!
Задонать, ламер, или играй в тетрис!`,
    ansi: () => [
        "(*^_^) Твой 56K-модем всё ещё дозванивается!",
        "(^o^) Norton Commander круче твоего GUI!",
        "(ToT) Y2K был фейком, а ты реальный ламер!"
    ][Math.floor(Math.random() * 3)],
    secret: `Секретный код: Y2K-DED-666
(x_x) Скажи это в 2000-м, и пиздец!`,
    joke: `Почему дед не юзает Win98?
(｡ŏ﹏ŏ) Зависает чаще, чем твой модем!`,
    exit: "exit",
    1337: `HACKER MODE ACTIVATED!
(☉｡☉)! Ты элита, но я круче!
Попробуй ansi для мема!`,
    matrix: () => startMatrix(),
    tetris: () => startTetris(),
    snake: () => startSnake(),
    invaders: () => startInvaders(),
    breakout: () => startBreakout()
};

function typeOutput(text, callback) {
    try {
        output.textContent = "";
        let i = 0;
        function type() {
            if (i < text.length) {
                output.textContent += text[i];
                playSound(800 + Math.random() * 200, 0.03);
                i++;
                setTimeout(type, 20 + Math.random() * 30);
            } else if (callback) {
                callback();
            }
        }
        type();
    } catch (e) {
        output.textContent = "ERROR: Display failed!\n(#_#) Твой CRT сгорел?";
    }
}

let snakeInterval = null;
let snakeDir = 'right';
let snake = [];
let snakeFood = null;
let snakeScore = 0;
const snakeW = 24;
const snakeH = 16;

function drawSnake() {
    try {
        let field = [];
        for (let y = 0; y < snakeH; y++) {
            let row = '';
            for (let x = 0; x < snakeW; x++) {
                let isSnake = false;
                for (let i = 0; i < snake.length; i++) {
                    if (snake[i][0] === x && snake[i][1] === y) {
                        isSnake = true;
                        row += i === 0 ? '█' : '▓';
                        break;
                    }
                }
                if (!isSnake) {
                    if (snakeFood && snakeFood[0] === x && snakeFood[1] === y) {
                        row += '¤';
                    } else {
                        row += ' ';
                    }
                }
            }
            field.push(row);
        }
        output.innerHTML = '';
        const gameField = document.createElement('div');
        gameField.className = 'game-field';
        const pre = document.createElement('pre');
        pre.style.cssText = "margin:0; font-family:'Courier New', monospace; font-size:inherit; line-height:1; letter-spacing:0; background:none; border:none; padding:0; text-align:left;";
        pre.textContent = `Змейка (стрелки/кнопки/свайпы)\nПодсчёт: ${snakeScore}\n╔${"═".repeat(snakeW)}╗\n${field.map(r => "║" + r + "║").join('\n')}\n╚${"═".repeat(snakeW)}╝\n${snakeScore > 5 ? "(灬º‿º灬)♡ Ты читер или задрот?!" : "(ノ◕ヮ◕)ノ Скилл как дозвон на 56K!"}`;
        gameField.appendChild(pre);
        output.appendChild(gameField);
    } catch (e) {
        endSnake("ERROR: Snake crashed!\n(°Д°) Твой 486-й не тянет!");
    }
}

function randomFood() {
    try {
        let x, y;
        do {
            x = Math.floor(Math.random() * snakeW);
            y = Math.floor(Math.random() * snakeH);
        } while (snake.some(s => s[0] === x && s[1] === y));
        return [x, y];
    } catch (e) {
        return [0, 0];
    }
}

function moveSnake() {
    try {
        let head = snake[0].slice();
        if (snakeDir === 'up') head[1]--;
        if (snakeDir === 'down') head[1]++;
        if (snakeDir === 'left') head[0]--;
        if (snakeDir === 'right') head[0]++;
        if (head[0] < 0 || head[0] >= snakeW || head[1] < 0 || head[1] >= snakeH) {
            endSnake("GAME OVER! Врезался в стену!\n(◎_◎;) n00b detected!");
            return;
        }
        if (snake.some(s => s[0] === head[0] && s[1] === head[1])) {
            endSnake("GAME OVER! Съел сам себя!\n(O_O) EPIC FAIL!");
            return;
        }
        snake.unshift(head);
        if (snakeFood && head[0] === snakeFood[0] && head[1] === snakeFood[1]) {
            snakeScore++;
            snakeFood = randomFood();
            playSound(1200, 0.1);
        } else {
            snake.pop();
        }
        drawSnake();
    } catch (e) {
        endSnake("ERROR: Snake crashed!\n(°ロ°) Твой 486-й не тянет!");
    }
}

function endSnake(msg) {
    try {
        clearInterval(snakeInterval);
        snakeActive = false;
        gameControls.style.display = 'none';
        typeOutput(msg + "\nДля новой игры: snake\n(¬‿¬) Змейка > твоя жизнь!");
    } catch (e) {
        output.textContent = "ERROR: Game end failed!\n(ಥ﹏ಥ) Твой CRT сгорел?";
    }
}

function startSnake() {
    try {
        cleanupAllGamesAndAnimations();
        snakeActive = true;
        snakeDir = 'right';
        snakeScore = 0;
        snake = [[5, 5], [4, 5], [3, 5]];
        snakeFood = randomFood();
        drawSnake();
        gameControls.style.display = 'flex';
        const btnUp = gameControls.querySelector('[data-dir="up"]');
        const btnDown = gameControls.querySelector('[data-dir="down"]');
        const btnLeft = gameControls.querySelector('[data-dir="left"]');
        const btnRight = gameControls.querySelector('[data-dir="right"]');
        if (btnUp) btnUp.style.display = '';
        if (btnDown) btnDown.style.display = '';
        if (btnLeft) btnLeft.style.display = '';
        if (btnRight) btnRight.style.display = '';
        clearInterval(snakeInterval);
        snakeInterval = setInterval(moveSnake, 150);
    } catch (e) {
        typeOutput("ERROR: Snake failed to start!\n(・_・;) Твой 486-й сгорел?");
    }
}

let tetrisInterval = null;
let tetrisPiece = null;
let tetrisPos = [0, 0];
let tetrisBoard = [];
let tetrisScore = 0;
const tetrisW = 10;
const tetrisH = 24;

const tetriminos = [
    { shape: [[1, 1, 1, 1]], color: '█' }, // I
    { shape: [[1, 1], [1, 1]], color: '█' }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '█' }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: '█' }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: '█' }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: '█' }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: '█' }  // L
];

function newTetrisPiece() {
    try {
        const piece = tetriminos[Math.floor(Math.random() * tetriminos.length)];
        tetrisPiece = { shape: piece.shape.map(row => [...row]), color: piece.color };
        tetrisPos = [Math.floor(tetrisW / 2) - Math.floor(tetrisPiece.shape[0].length / 2), 0];
        if (checkTetrisCollision()) {
            endTetris("GAME OVER!\n(・_・;) Твой 486-й не тянет!");
        }
    } catch (e) {
        endTetris("ERROR: Tetris crashed!\n(°ロ°) Твой 486-й сгорел?");
    }
}

function checkTetrisCollision(offsetX = 0, offsetY = 0, shape = tetrisPiece.shape) {
    try {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = tetrisPos[0] + x + offsetX;
                    const boardY = tetrisPos[1] + y + offsetY;
                    if (
                        boardX < 0 || boardX >= tetrisW ||
                        boardY >= tetrisH ||
                        (boardY >= 0 && tetrisBoard[boardY] && tetrisBoard[boardY][boardX])
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    } catch (e) {
        return true;
    }
}

function mergeTetrisPiece() {
    try {
        for (let y = 0; y < tetrisPiece.shape.length; y++) {
            for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
                if (tetrisPiece.shape[y][x]) {
                    const boardY = tetrisPos[1] + y;
                    if (boardY >= 0) {
                        if (!tetrisBoard[boardY]) tetrisBoard[boardY] = Array(tetrisW).fill(0);
                        tetrisBoard[boardY][tetrisPos[0] + x] = 1;
                    }
                }
            }
        }
        let linesCleared = 0;
        tetrisBoard = tetrisBoard.filter(row => row && row.some(cell => !cell));
        linesCleared = tetrisH - tetrisBoard.length;
        for (let i = 0; i < linesCleared; i++) {
            tetrisBoard.unshift(Array(tetrisW).fill(0));
        }
        tetrisScore += linesCleared * 100;
        playSound(1200, 0.1);
        newTetrisPiece();
    } catch (e) {
        endTetris("ERROR: Tetris crashed!\n(ಠ_ಠ) Твой 486-й сгорел?");
    }
}

function rotateTetrisPiece() {
    try {
        const newShape = Array(tetrisPiece.shape[0].length).fill().map(() => Array(tetrisPiece.shape.length).fill(0));
        for (let y = 0; y < tetrisPiece.shape.length; y++) {
            for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
                newShape[x][tetrisPiece.shape.length - 1 - y] = tetrisPiece.shape[y][x];
            }
        }
        if (!checkTetrisCollision(0, 0, newShape)) {
            tetrisPiece.shape = newShape;
            playSound(1000, 0.05);
        }
    } catch (e) {}
}

function drawTetris() {
    try {
        let field = Array(tetrisH).fill().map(() => Array(tetrisW).fill('□'));
        for (let y = 0; y < tetrisBoard.length; y++) {
            for (let x = 0; x < tetrisW; x++) {
                if (tetrisBoard[y] && tetrisBoard[y][x]) {
                    field[y][x] = '█';
                }
            }
        }
        for (let y = 0; y < tetrisPiece.shape.length; y++) {
            for (let x = 0; x < tetrisPiece.shape[y].length; x++) {
                if (tetrisPiece.shape[y][x] && tetrisPos[1] + y >= 0) {
                    field[tetrisPos[1] + y][tetrisPos[0] + x] = tetrisPiece.color;
                }
            }
        }
        output.innerHTML = '';
        const gameField = document.createElement('div');
        gameField.className = 'game-field';
        const pre = document.createElement('pre');
        pre.style.cssText = "margin:0; font-family:'Courier New', monospace; font-size:inherit; line-height:1; letter-spacing:0; background:none; border:none; padding:0; text-align:left;";
        pre.textContent = `Тетрис (стрелки/кнопки/свайпы)\nПодсчёт: ${tetrisScore}\n╔${"═".repeat(tetrisW)}╗\n${field.map(r => "║" + r.join('') + "║").join('\n')}\n╚${"═".repeat(tetrisW)}╝\n${tetrisScore > 500 ? "(¬‿¬) Ты читер или задрот?!" : "(ಠ_ಠ) Твой скилл как Win95!"}`;
        gameField.appendChild(pre);
        output.appendChild(gameField);
    } catch (e) {
        endTetris("ERROR: Tetris crashed!\n(ಥ﹏ಥ) Твой 486-й сгорел?");
    }
}

function moveTetris() {
    try {
        if (!checkTetrisCollision(0, 1)) {
            tetrisPos[1]++;
            drawTetris();
        } else {
            mergeTetrisPiece();
            drawTetris();
        }
    } catch (e) {
        endTetris("ERROR: Tetris crashed!\n(¬_¬) Твой 486-й сгорел?");
    }
}

function endTetris(msg) {
    try {
        clearInterval(tetrisInterval);
        tetrisActive = false;
        gameControls.style.display = 'none';
        typeOutput(msg + "\nДля новой игры: tetris\n(¬_¬) Тетрис > твоя жизнь!");
    } catch (e) {
        output.textContent = "ERROR: Game end failed!\n(ಠ_ಠ) Твой CRT сгорел?";
    }
}

function startTetris() {
    try {
        cleanupAllGamesAndAnimations();
        tetrisActive = true;
        tetrisBoard = Array(tetrisH).fill().map(() => Array(tetrisW).fill(0));
        tetrisScore = 0;
        newTetrisPiece();
        drawTetris();
        gameControls.style.display = 'flex';
        const btnUp = gameControls.querySelector('[data-dir="up"]');
        const btnDown = gameControls.querySelector('[data-dir="down"]');
        const btnLeft = gameControls.querySelector('[data-dir="left"]');
        const btnRight = gameControls.querySelector('[data-dir="right"]');
        if (btnUp) btnUp.style.display = '';
        if (btnDown) btnDown.style.display = '';
        if (btnLeft) btnLeft.style.display = '';
        if (btnRight) btnRight.style.display = '';
        clearInterval(tetrisInterval);
        tetrisInterval = setInterval(moveTetris, 400);
    } catch (e) {
        typeOutput("ERROR: Tetris failed to start!\n(ಥ﹏ಥ) Твой 486-й сгорел?");
    }
}

let invadersInterval = null;
let invadersPlayer = [23, 15];
let invadersAliens = [];
let invadersBullets = [];
let invadersEnemyBullets = [];
let invadersMysteryShip = null;
let invadersScore = 0;
let invadersLives = 3;
const invadersW = 48;
const invadersH = 16;

function drawInvaders() {
    try {
        let field = Array(invadersH).fill().map(() => Array(invadersW).fill(' '));
        field[invadersPlayer[1]][invadersPlayer[0]] = '^';
        invadersBullets.forEach(b => {
            if (b[1] >= 0 && b[1] < invadersH) field[b[1]][b[0]] = '|';
        });
        invadersEnemyBullets.forEach(b => {
            if (b[1] >= 0 && b[1] < invadersH) field[b[1]][b[0]] = 'v';
        });
        invadersAliens.forEach(a => {
            if (a[1] >= 0 && a[1] < invadersH) field[a[1]][a[0]] = '*';
        });
        if (invadersMysteryShip && invadersMysteryShip[1] >= 0 && invadersMysteryShip[1] < invadersH) {
            field[invadersMysteryShip[1]][invadersMysteryShip[0]] = 'O';
        }
        output.innerHTML = '';
        const gameField = document.createElement('div');
        gameField.className = 'game-field';
        const pre = document.createElement('pre');
        pre.style.cssText = "margin:0; font-family:'Courier New', monospace; font-size:inherit; line-height:1; letter-spacing:0; background:none; border:none; padding:0; text-align:left;";
        pre.textContent = `Space Invaders (стрелки/кнопки/свайпы, огонь: пробел/стрелка вверх)\nПодсчёт: ${invadersScore} | Жизни: ${invadersLives}\n╔${"═".repeat(invadersW)}╗\n${field.map(r => "║" + r.join('') + "║").join('\n')}\n╚${"═".repeat(invadersW)}╝\n${invadersScore > 500 ? "(¬‿¬) Ты военно-космический асс!" : "(ಠ_ಠ) Спаси Землю, хацкер!"}`;
        gameField.appendChild(pre);
        output.appendChild(gameField);
    } catch (e) {
        endInvaders("ERROR: Invaders crashed!\n(ಥ﹏ಥ) Твой 486-й сгорел?");
    }
}

function moveInvaders() {
    try {
        let minX = Math.min(...invadersAliens.map(a => a[0]));
        let maxX = Math.max(...invadersAliens.map(a => a[0]));
        let maxY = Math.max(...invadersAliens.map(a => a[1]));
        let dir = invadersAliens[0][2];
        if (maxX >= invadersW - 1 && dir === 1) {
            invadersAliens.forEach(a => { a[1]++; a[2] = -1; });
        } else if (minX <= 0 && dir === -1) {
            invadersAliens.forEach(a => { a[1]++; a[2] = 1; });
        } else {
            invadersAliens.forEach(a => { a[0] += a[2]; });
        }
        if (maxY >= invadersH - 1) {
            endInvaders("GAME OVER! Пришельцы захватили уКрим!\n(¬_¬) n00b detected!");
            return;
        }
        invadersBullets = invadersBullets.filter(b => b[1] >= 0);
        invadersBullets.forEach(b => b[1]--);
        invadersEnemyBullets = invadersEnemyBullets.filter(b => b[1] < invadersH);
        invadersEnemyBullets.forEach(b => b[1]++);
        if (Math.random() < 0.05 && invadersAliens.length > 0) {
            const shooter = invadersAliens[Math.floor(Math.random() * invadersAliens.length)];
            invadersEnemyBullets.push([shooter[0], shooter[1] + 1]);
            playSound(800, 0.05);
        }
        if (Math.random() < 0.01 && !invadersMysteryShip) {
            invadersMysteryShip = [0, 0, 1];
        }
        if (invadersMysteryShip) {
            invadersMysteryShip[0] += invadersMysteryShip[2];
            if (invadersMysteryShip[0] < 0 || invadersMysteryShip[0] >= invadersW) {
                invadersMysteryShip = null;
            }
        }
        invadersBullets.forEach(b => {
            invadersAliens = invadersAliens.filter(a => !(a[0] === b[0] && a[1] === b[1]));
            if (invadersMysteryShip && b[0] === invadersMysteryShip[0] && b[1] === invadersMysteryShip[1]) {
                invadersScore += 100;
                invadersMysteryShip = null;
                playSound(1200, 0.1);
            }
        });
        invadersEnemyBullets.forEach(b => {
            if (b[0] === invadersPlayer[0] && b[1] === invadersPlayer[1]) {
                invadersLives--;
                playSound(600, 0.1);
                if (invadersLives <= 0) {
                    endInvaders("GAME OVER! Ты подбит!\n(ಠ_ಠ) n00b detected!");
                    return;
                }
            }
        });
        if (invadersAliens.length === 0) {
            invadersScore += 100;
            initInvaders();
        }
        drawInvaders();
    } catch (e) {
        endInvaders("ERROR: Invaders crashed!\n(¬‿¬) Твой 486-й сгорел?");
    }
}

function initInvaders() {
    invadersAliens = [];
    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 16; x++) {
            invadersAliens.push([x * 3 + 2, y, 1]);
        }
    }
}

function endInvaders(msg) {
    try {
        clearInterval(invadersInterval);
        invadersActive = false;
        gameControls.style.display = 'none';
        typeOutput(msg + "\nДля новой игры: invaders\n(ಥ﹏ಥ) Спаси Землю снова!");
    } catch (e) {
        output.textContent = "ERROR: Game end failed!\n(¬_¬) Твой CRT сгорел?";
    }
}

function startInvaders() {
    try {
        cleanupAllGamesAndAnimations();
        invadersActive = true;
        invadersPlayer = [23, 15];
        invadersBullets = [];
        invadersEnemyBullets = [];
        invadersMysteryShip = null;
        invadersScore = 0;
        invadersLives = 3;
        initInvaders();
        drawInvaders();
        gameControls.style.display = 'flex';
        const btnUp = gameControls.querySelector('[data-dir="up"]');
        const btnDown = gameControls.querySelector('[data-dir="down"]');
        const btnLeft = gameControls.querySelector('[data-dir="left"]');
        const btnRight = gameControls.querySelector('[data-dir="right"]');
        if (btnUp) btnUp.style.display = '';
        if (btnDown) btnDown.style.display = 'none';
        if (btnLeft) btnLeft.style.display = '';
        if (btnRight) btnRight.style.display = '';
        clearInterval(invadersInterval);
        invadersInterval = setInterval(moveInvaders, 900);
    } catch (e) {
        typeOutput("ERROR: Invaders failed to start!\n(ಠ_ಠ) Твой 486-й сгорел?");
    }
}

let breakoutInterval = null;
let breakoutPaddle = [22, 15];
let breakoutBall = [24, 14];
let breakoutBallDir = [1, -1];
let breakoutBlocks = [];
let breakoutScore = 0;
let breakoutLives = 3;
const breakoutW = 48;
const breakoutH = 16;

function drawBreakout() {
    try {
        let field = Array(breakoutH).fill().map(() => Array(breakoutW).fill(' '));
        field[breakoutPaddle[1]][breakoutPaddle[0]] = '=';
        field[breakoutPaddle[1]][breakoutPaddle[0] + 1] = '=';
        field[breakoutPaddle[1]][breakoutPaddle[0] + 2] = '=';
        if (breakoutBall[1] >= 0 && breakoutBall[1] < breakoutH) {
            field[breakoutBall[1]][breakoutBall[0]] = 'o';
        }
        breakoutBlocks.forEach(b => {
            if (b[1] >= 0 && b[1] < breakoutH) field[b[1]][b[0]] = '#';
        });
        output.innerHTML = '';
        const gameField = document.createElement('div');
        gameField.className = 'game-field';
        const pre = document.createElement('pre');
        pre.style.cssText = "margin:0; font-family:'Courier New', monospace; font-size:inherit; line-height:1; letter-spacing:0; background:none; border:none; padding:0; text-align:left;";
        pre.textContent = `Breakout (стрелки/кнопки/свайпы)\nПодсчёт: ${breakoutScore} | Жизни: ${breakoutLives}\n╔${"═".repeat(breakoutW)}╗\n${field.map(r => "║" + r.join('') + "║").join('\n')}\n╚${"═".repeat(breakoutW)}╝\n${breakoutScore > 500 ? "(¬‿¬) Ты мастер катания шаров!" : "(ಠ_ಠ) Бей блоки, хацкер!"}`;
        gameField.appendChild(pre);
        output.appendChild(gameField);
    } catch (e) {
        endBreakout("ERROR: Breakout crashed!\n(ъ-ъ) Твой 486-й сгорел?");
    }
}

function moveBreakout() {
    try {
        let nextX = breakoutBall[0] + breakoutBallDir[0];
        let nextY = breakoutBall[1] + breakoutBallDir[1];
        if (nextX < 0 || nextX >= breakoutW) breakoutBallDir[0] = -breakoutBallDir[0];
        if (nextY < 0) breakoutBallDir[1] = -breakoutBallDir[1];
        if (nextY >= breakoutH) {
            breakoutLives--;
            playSound(600, 0.1);
            if (breakoutLives <= 0) {
                endBreakout("GAME OVER! Шарик упал!\n(╥_╥) n00b detected!");
                return;
            }
            breakoutBall = [24, 14];
            breakoutBallDir = [1, -1];
        }
        if (nextY === breakoutPaddle[1] && nextX >= breakoutPaddle[0] && nextX < breakoutPaddle[0] + 3) {
            breakoutBallDir[1] = -breakoutBallDir[1];
            playSound(1000, 0.05);
        }
        breakoutBlocks = breakoutBlocks.filter(b => !(b[0] === nextX && b[1] === nextY));
        if (breakoutBlocks.some(b => b[0] === nextX && b[1] === nextY)) {
            breakoutBallDir[1] = -breakoutBallDir[1];
            breakoutScore += 10;
            playSound(1200, 0.1);
        }
        breakoutBall = [nextX, nextY];
        if (breakoutBlocks.length === 0) {
            breakoutScore += 100;
            initBreakoutBlocks();
        }
        drawBreakout();
    } catch (e) {
        endBreakout("ERROR: Breakout crashed!\n(×_×) Твой 486-й сгорел?");
    }
}

function initBreakoutBlocks() {
    breakoutBlocks = [];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < breakoutW; x += 2) {
            breakoutBlocks.push([x, y]);
        }
    }
}

function endBreakout(msg) {
    try {
        clearInterval(breakoutInterval);
        breakoutActive = false;
        gameControls.style.display = 'none';
        typeOutput(msg + "\nДля новой игры: breakout\n(¬‿¬) Бей блоки снова!");
    } catch (e) {
        output.textContent = "ERROR: Game end failed!\n(ಥ﹏ಥ) Твой CRT сгорел?";
    }
}

function startBreakout() {
    try {
        cleanupAllGamesAndAnimations();
        breakoutActive = true;
        breakoutPaddle = [22, 15];
        breakoutBall = [24, 14];
        breakoutBallDir = [1, -1];
        breakoutScore = 0;
        breakoutLives = 3;
        initBreakoutBlocks();
        drawBreakout();
        gameControls.style.display = 'flex';
        const btnUp = gameControls.querySelector('[data-dir="up"]');
        const btnDown = gameControls.querySelector('[data-dir="down"]');
        const btnLeft = gameControls.querySelector('[data-dir="left"]');
        const btnRight = gameControls.querySelector('[data-dir="right"]');
        if (btnUp) btnUp.style.display = 'none';
        if (btnDown) btnDown.style.display = 'none';
        if (btnLeft) btnLeft.style.display = '';
        if (btnRight) btnRight.style.display = '';
        clearInterval(breakoutInterval);
        breakoutInterval = setInterval(moveBreakout, 200);
    } catch (e) {
        typeOutput("ERROR: Breakout failed to start!\n(°Д°) Твой 486-й сгорел?");
    }
}

document.addEventListener('keydown', function(e) {
    try {
        if (snakeActive) {
            if (e.key === 'ArrowUp' && snakeDir !== 'down') snakeDir = 'up';
            if (e.key === 'ArrowDown' && snakeDir !== 'up') snakeDir = 'down';
            if (e.key === 'ArrowLeft' && snakeDir !== 'right') snakeDir = 'left';
            if (e.key === 'ArrowRight' && snakeDir !== 'left') snakeDir = 'right';
            playSound(1000, 0.05);
        } else if (tetrisActive) {
            if (e.key === 'ArrowLeft' && !checkTetrisCollision(-1, 0)) tetrisPos[0]--;
            if (e.key === 'ArrowRight' && !checkTetrisCollision(1, 0)) tetrisPos[0]++;
            if (e.key === 'ArrowDown' && !checkTetrisCollision(0, 1)) tetrisPos[1]++;
            if (e.key === 'ArrowUp') rotateTetrisPiece();
            drawTetris();
            playSound(1000, 0.05);
            e.preventDefault();
        } else if (invadersActive) {
            if (e.key === 'ArrowLeft' && invadersPlayer[0] > 0) invadersPlayer[0]--;
            if (e.key === 'ArrowRight' && invadersPlayer[0] < invadersW - 1) invadersPlayer[0]++;
            if (e.key === ' ' || e.key === 'ArrowUp') {
                invadersBullets.push([invadersPlayer[0], invadersPlayer[1] - 1]);
                playSound(1000, 0.05);
            }
            drawInvaders();
            playSound(1000, 0.05);
            e.preventDefault();
        } else if (breakoutActive) {
            if (e.key === 'ArrowLeft' && breakoutPaddle[0] > 0) breakoutPaddle[0]--;
            if (e.key === 'ArrowRight' && breakoutPaddle[0] < breakoutW - 3) breakoutPaddle[0]++;
            drawBreakout();
            playSound(1000, 0.05);
            e.preventDefault();
        }
    } catch (e) {
        typeOutput("ERROR: Input failed!\n(⊙_☉) Твой 486-й сгорел?");
    }
});

gameControls.addEventListener('click', function(e) {
    try {
        if (!snakeActive && !tetrisActive && !invadersActive && !breakoutActive) return;
        if (e.target.classList.contains('game-btn')) {
            let dir = e.target.getAttribute('data-dir');
            if (snakeActive) {
                if (dir === 'up' && snakeDir !== 'down') snakeDir = 'up';
                if (dir === 'down' && snakeDir !== 'up') snakeDir = 'down';
                if (dir === 'left' && snakeDir !== 'right') snakeDir = 'left';
                if (dir === 'right' && snakeDir !== 'left') snakeDir = 'right';
            } else if (tetrisActive) {
                if (dir === 'left' && !checkTetrisCollision(-1, 0)) tetrisPos[0]--;
                if (dir === 'right' && !checkTetrisCollision(1, 0)) tetrisPos[0]++;
                if (dir === 'down' && !checkTetrisCollision(0, 1)) tetrisPos[1]++;
                if (dir === 'up') rotateTetrisPiece();
                drawTetris();
            } else if (invadersActive) {
                if (dir === 'left' && invadersPlayer[0] > 0) invadersPlayer[0]--;
                if (dir === 'right' && invadersPlayer[0] < invadersW - 1) invadersPlayer[0]++;
                if (dir === 'up') {
                    invadersBullets.push([invadersPlayer[0], invadersPlayer[1] - 1]);
                    playSound(1000, 0.05);
                }
                drawInvaders();
            }
            e.target.classList.add('active');
            setTimeout(() => e.target.classList.remove('active'), 100);
            playSound(1000, 0.05);
        }
    } catch (e) {
        typeOutput("ERROR: Control failed!\n(ಠ_ಠ) Твой 486-й сгорел?");
    }
});

let touchStartX = 0, touchStartY = 0;
output.addEventListener('touchstart', function(e) {
    try {
        if (!snakeActive && !tetrisActive && !invadersActive && !breakoutActive) return;
        e.preventDefault();
        let t = e.touches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
    } catch (e) {}
});

output.addEventListener('touchend', function(e) {
    try {
        if (!snakeActive && !tetrisActive && !invadersActive && !breakoutActive) return;
        e.preventDefault();
        let t = e.changedTouches[0];
        let dx = t.clientX - touchStartX;
        let dy = t.clientY - touchStartY;
        if (snakeActive) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 40 && snakeDir !== 'left') snakeDir = 'right';
                if (dx < -40 && snakeDir !== 'right') snakeDir = 'left';
            } else {
                if (dy > 40 && snakeDir !== 'up') snakeDir = 'down';
                if (dy < -40 && snakeDir !== 'down') snakeDir = 'up';
            }
        } else if (tetrisActive) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 40 && !checkTetrisCollision(1, 0)) tetrisPos[0]++;
                if (dx < -40 && !checkTetrisCollision(-1, 0)) tetrisPos[0]--;
            } else {
                if (dy > 40 && !checkTetrisCollision(0, 1)) tetrisPos[1]++;
                if (dy < -40) rotateTetrisPiece();
            }
            drawTetris();
        } else if (invadersActive) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 40 && invadersPlayer[0] < invadersW - 1) invadersPlayer[0]++;
                if (dx < -40 && invadersPlayer[0] > 0) invadersPlayer[0]--;
            } else if (dy < -40) {
                invadersBullets.push([invadersPlayer[0], invadersPlayer[1] - 1]);
                playSound(1000, 0.05);
            }
            drawInvaders();
        } else if (breakoutActive) {
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 40 && breakoutPaddle[0] < breakoutW - 3) breakoutPaddle[0]++;
                if (dx < -40 && breakoutPaddle[0] > 0) breakoutPaddle[0]--;
            }
            drawBreakout();
        }
        playSound(1000, 0.05);
    } catch (e) {
        typeOutput("ERROR: Touch failed!\n(>_<) Твой 486-й сгорел?");
    }
});

function updateCursorPosition() {
    try {
        const value = input.value;
        const font = window.getComputedStyle(input).font;
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.style.font = font;
        span.textContent = value || ' ';
        document.body.appendChild(span);
        const width = span.offsetWidth;
        span.remove();
        cursor.style.left = (input.offsetLeft + width + 4) + 'px';
    } catch (e) {}
}

input.addEventListener('input', () => {
    try {
        updateCursorPosition();
        playSound(900, 0.03);
    } catch (e) {}
});

input.addEventListener('focus', () => {
    try {
        cursor.style.display = 'inline-block';
        updateCursorPosition();
    } catch (e) {}
});

input.addEventListener('blur', () => {
    try {
        cursor.style.display = 'none';
    } catch (e) {}
});

window.addEventListener('resize', () => {
    try {
        updateCursorPosition();
    } catch (e) {}
});

setTimeout(updateCursorPosition, 100);

function handleCommand(cmd) {
    try {
        if (cmd === "exit") {
            window.location.href = "/";
            return;
        }
        if (cmd === "snake") {
            startSnake();
            input.value = "";
            input.blur();
            return;
        }
        if (cmd === "tetris") {
            startTetris();
            input.value = "";
            input.blur();
            return;
        }
        if (cmd === "invaders") {
            startInvaders();
            input.value = "";
            input.blur();
            return;
        }
        if (cmd === "breakout") {
            startBreakout();
            input.value = "";
            input.blur();
            return;
        }
        if (cmd === "guess") {
            startGuess();
            return;
        }
        if (cmd === "cls") {
            output.textContent = "";
            input.value = "";
            return;
        }
        if (guessActive) {
            handleGuess(cmd);
            return;
        }
        if (cmd === "1337") {
            document.body.style.background = '#00f';
            document.body.style.color = '#ff0';
            typeOutput(commands[cmd]);
            setTimeout(() => {
                document.body.style.background = '#111';
                document.body.style.color = '#0f0';
            }, 3000);
            input.value = "";
            return;
        }
        const response = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
        if (cmd === "matrix") {
            input.value = "";
            return;
        }
        typeOutput(response || "ERROR 404: Команда не найдена!\n(ಠ_ಠ) Твой 486-й сгорел, ламер?\nПопробуй help!");
        input.value = "";
    } catch (e) {
        typeOutput("ERROR: Command failed!\n(¬_¬) Твой 486-й сгорел?");
    }
}

input.addEventListener('keydown', function(e) {
    try {
        if (snakeActive || tetrisActive || invadersActive || breakoutActive) return;
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            handleCommand(cmd);
        }
    } catch (e) {
        typeOutput("ERROR: Command failed!\n(¬_¬) Твой 486-й сгорел?");
    }
});

function startGuess() {
    try {
        cleanupAllGamesAndAnimations();
        guessActive = true;
        guessNumber = Math.floor(Math.random() * 100) + 1;
        guessTries = 0;
        typeOutput("Угадай число от 1 до 100.\n(¬_¬) Не облажайся, как Win98!");
        input.value = "";
        input.focus();
    } catch (e) {
        typeOutput("ERROR: Guess failed to start!\n(*-*) Твой 486-й сгорел?");
    }
}

function handleGuess(val) {
    try {
        guessTries++;
        let num = parseInt(val, 10);
        if (isNaN(num) || num < 1 || num > 100) {
            typeOutput("\n(ಠ_ಠ) Это не число, это твой IQ!");
            return;
        }
        if (num === guessNumber) {
            typeOutput(`\nПоздравляю! Угадал за ${guessTries} попыток.\n(¬‿¬) Читеришь, поди?\nДля новой игры: guess`);
            guessActive = false;
        } else if (num < guessNumber) {
            typeOutput(`\n${num} -- мало!\n(・_・) Скилл как 56K-модем!`);
        } else {
            typeOutput(`\n${num} -- много!\n(°ロ°) Ты как Windows ME!`);
        }
        input.value = "";
        input.focus();
    } catch (e) {
        typeOutput("ERROR: Guess failed!\n(×_×) Твой 486-й сгорел?");
    }
}

const menuItems = Array.from(document.querySelectorAll('.doc-menu-item'));
let menuIndex = 0;
function focusMenu(idx) {
    try {
        menuItems.forEach((el, i) => {
            el.classList.toggle('active', i === idx);
        });
        menuItems[idx].focus();
    } catch (e) {}
}

document.addEventListener('keydown', function(e) {
    try {
        if (document.activeElement === input || snakeActive || tetrisActive || invadersActive || breakoutActive || guessActive) return;
        if (e.key === 'ArrowRight') {
            menuIndex = (menuIndex + 1) % menuItems.length;
            focusMenu(menuIndex);
            playSound(1000, 0.05);
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft') {
            menuIndex = (menuIndex - 1 + menuItems.length) % menuItems.length;
            focusMenu(menuIndex);
            playSound(1000, 0.05);
            e.preventDefault();
        }
        if (e.key === 'Enter') {
            menuItems[menuIndex].click();
            playSound(1000, 0.05);
            e.preventDefault();
        }
    } catch (e) {}
});

menuItems.forEach((el, i) => {
    el.addEventListener('click', () => {
        try {
            window.open(el.href, el.target === '_blank' ? '_blank' : '_self');
            playSound(1000, 0.05);
        } catch (e) {}
    });
    el.addEventListener('focus', () => {
        try {
            menuIndex = i;
            focusMenu(menuIndex);
        } catch (e) {}
    });
});
focusMenu(menuIndex);