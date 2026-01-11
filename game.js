const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/XeIKgR4ZN/';

let model, webcam;
let playerScore = 0;
let enemyScore = 0;
let canPlay = true;
let yourPlay = '';
let title, webcamContainer, canvas, allowCam, playBtn, playBtn2;
let playerScoreLabel, enemyScoreLabel, scoreCompareLabel, startRoundBtn, playerSide, sideSeparator, enemySide, playerChoice, enemyChoice, countdown, result;
let mode3Btn, mode5Btn, modeInfBtn;
let mode = 0;
let gameOver = false;
let menu = '';


async function init() {
    const modelURL = MODEL_URL + 'model.json';
    const metadataURL = MODEL_URL + 'metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    webcam = new tmImage.Webcam(200, 200, true);

    await webcam.setup();
    await webcam.play();
    document.getElementById('webcam-container').appendChild(webcam.canvas);

    window.requestAnimationFrame(loop);

    initGame();
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let highestProb = 0;
    let bestPrediction = '';

    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestPrediction = prediction[i].className;
        }
    }
    if (highestProb >= 0.7 && canPlay) {
       yourPlay = bestPrediction;
    }
    if (yourPlay == 'Rock') {
        playerChoice.src = 'images/rock_img.png';
    } else if (yourPlay == 'Paper') {
        playerChoice.src = 'images/paper_img.png';
    } else {
        playerChoice.src = 'images/scissors_img.png';
    }
}

function initGame() {
    allowCam = document.getElementsByClassName('allow-cam');

    title = document.getElementById('title');
    webcamContainer = document.getElementById('webcam-container');
    canvas = document.querySelector('#webcam-container canvas');

    playBtn = document.getElementById('play-btn');

    quitBtn = document.getElementById('quit-btn');

    tutorialLabel = document.getElementById('tutorial-label');
    examples = document.getElementsByClassName('examples');
    playBtn2 = document.getElementById('play-btn-2');

    mode3Btn = document.getElementById('mode3-btn');
    mode5Btn = document.getElementById('mode5-btn');
    modeInfBtn = document.getElementById('mode-inf-btn');

    playerScoreLabel = document.getElementById('player-score');
    enemyScoreLabel = document.getElementById('enemy-score');

    startRoundBtn = document.getElementById('start-round-btn');
    playerSide = document.getElementById('player-side');
    sideSeparator = document.getElementById('side-separator');
    enemySide = document.getElementById('enemy-side');

    playerChoice = document.getElementById('player-choice');
    enemyChoice = document.getElementById('enemy-choice');
    countdown = document.getElementById('countdown');
    result = document.getElementById('result');
    
    playBtn.addEventListener('click', openTutorial);

    quitBtn.addEventListener('click', goBack);

    playBtn2.addEventListener('click', playGame);

    mode3Btn.addEventListener('click', () => modeSelect(3));
    mode5Btn.addEventListener('click', () => modeSelect(5));
    modeInfBtn.addEventListener('click', () => modeSelect(Infinity));

    startRoundBtn.addEventListener('click', startRound);

    for (i of allowCam) {
        i.style.display = 'none';
    }
    title.style.display = 'block';
    webcamContainer.style.display = 'block';
    canvas.style.display = 'block';
    playBtn.style.display = 'block';
}

function openTutorial() {
    title.style.display = 'none'
    playBtn.style.display = 'none';

    tutorialLabel.style.display = 'block';

    webcamContainer.style.marginTop = '7.5vw';
    webcamContainer.style.left = '15%';
    webcamContainer.style.width = '17.5vw';
    webcamContainer.style.height = '17.5vw';

    playerChoice.style.display = 'block';
    playerChoice.style.width = '20vw';
    playerChoice.style.top = '30vw';

    for (let i of examples) {
        i.style.display = 'block'
    }

    quitBtn.style.display = 'flex';
    playBtn2.style.display = 'flex';

    menu = 'tutorialMenu'
    
}

function playGame() {
    tutorialLabel.style.display = 'none';
    playBtn2.style.display = 'none';
    for (let i of examples) {
        i.style.display = 'none';
    }
    
    webcamContainer.style.marginTop = '5vw';
    webcamContainer.style.left = '50%';
    webcamContainer.style.width = '25vw';
    webcamContainer.style.height = '25vw';

    playerChoice.style.display = 'none';
    playerChoice.style.width = '30vw';
    playerChoice.style.top = '25%';

    mode3Btn.style.display = 'flex';
    mode5Btn.style.display = 'flex';
    modeInfBtn.style.display = 'flex';

    menu = 'modeSelect'
}

const modeSelect = (modeChoice) => {
    mode3Btn.style.display = 'none';
    mode5Btn.style.display = 'none';
    modeInfBtn.style.display = 'none';

    quitBtn.textContent = 'Quit';

    startRoundBtn.style.display = 'block';
    playerSide.style.display = 'flex';
    enemySide.style.display = 'flex';
    sideSeparator.style.display = 'block';
    playerScoreLabel.style.display = 'block';
    enemyScoreLabel.style.display = 'block';

    playerScore = 0;
    enemyScore = 0;
    playerScoreLabel.textContent = playerScore;
    enemyScoreLabel.textContent = enemyScore;

    menu = 'gameMenu'

    mode = modeChoice;
    return mode;
}

function startRound() {
    startRoundBtn.style.display = 'none';

    quitBtn.style.display = 'none';

    playerChoice.style.display = 'flex';
    enemyChoice.style.display = 'flex';

    let count = 5;
    countdown.style.display = 'block';
    countdown.textContent = count;
    const timer = setInterval(() => {
        count--;
        countdown.textContent = count;
        if (count < 0) {
            clearInterval(timer);
            playRound();
            checkScore();
            canPlay = false;
            countdown.style.display = 'none';
            let finish = 2;
            const finishTimer = setInterval(() => {
                finish--;
                if (finish < 0) {
                    finishRound();
                    clearInterval(finishTimer);
                }
            }, 1000);
        }
    }, 1000);
}

function playRound() {
    const enemyRand = Math.floor(Math.random() * 3);
    const enemyChoices = ['Rock', 'Paper', 'Scissors'];
    const enemyPlay = enemyChoices[enemyRand];
    result.style.display = 'flex';
    result.style.color = 'rgb(255, 255, 255)';
    if (enemyPlay == 'Rock') {
        enemyChoice.src = 'images/rock_img.png';
    } else if (enemyPlay == 'Paper') {
        enemyChoice.src = 'images/paper_img.png';
    } else {
        enemyChoice.src = 'images/scissors_img.png';
    }

    if (enemyPlay == 'Rock') {
        if (yourPlay == 'Rock') {
            result.textContent = 'Tie!';
        } else if (yourPlay == 'Paper') {
            result.textContent = 'You Win!';
            playerScore += 1;
            playerScoreLabel.textContent = playerScore;
        } else {
            result.textContent = 'Enemy Wins!';
            enemyScore += 1;
            enemyScoreLabel.textContent = enemyScore;
        }
    } else if (enemyPlay == 'Paper') {
        if (yourPlay == 'Rock') {
            result.textContent = 'Enemy Wins!';
            enemyScore += 1;
            enemyScoreLabel.textContent = enemyScore;
        } else if (yourPlay == 'Paper') {
            result.textContent = 'Tie!';
        } else {
            result.textContent = 'You Win!';
            playerScore += 1;
            playerScoreLabel.textContent = playerScore;
        }
    } else {
        if (yourPlay == 'Rock') {
            result.textContent = 'You Win!';
            playerScore += 1;
            playerScoreLabel.textContent = playerScore;
        } else if (yourPlay == 'Paper') {
            result.textContent = 'Enemy Wins!';
            enemyScore += 1;
            enemyScoreLabel.textContent = enemyScore;
        } else {
            result.textContent = 'Tie!';
        }
    }
}

function finishRound() {
    if (!gameOver) {
        startRoundBtn.style.display = 'block';
        quitBtn.style.display = 'flex'
    } else {
        playerSide.style.display = 'none';
        enemySide.style.display = 'none';
        sideSeparator.style.display = 'none';
        playerScoreLabel.style.display = 'none';
        enemyScoreLabel.style.display = 'none';

        mode3Btn.style.display = 'flex';
        mode5Btn.style.display = 'flex';
        modeInfBtn.style.display = 'flex';

        quitBtn.style.display = 'flex';
        quitBtn.textContent = 'Back';

        menu = 'modeSelect';
        mode = 0;
        gameOver = false;
    }

    playerChoice.style.display = 'none';
    enemyChoice.style.display = 'none';
    enemyChoice.src = 'images/question_mark_img.png';
    canPlay = true;
    result.style.display = 'none';
}

function checkScore() {
    if (mode == 3) {
        if (playerScore == 2) {
            result.style.color = 'rgb(0, 94, 153)';
            gameOver = true;
        } else if (enemyScore == 2) {
            result.style.color = 'rgb(155, 0, 0)';
            gameOver = true;
        }
    } else if (mode == 5) {
        if (playerScore == 3) {
            result.style.color = 'rgb(0, 94, 153)';
            gameOver = true;
        } else if (enemyScore == 3) {
            result.style.color = 'rgb(155, 0, 0)';
            gameOver = true;
        }
    }
}

function goBack() {
    if (menu == 'tutorialMenu') {
        tutorialLabel.style.display = 'none';
        playBtn2.style.display = 'none';
        quitBtn.style.display = 'none'
        playerChoice.style.display = 'none';
        for (i of examples) {
            i.style.display = 'none';
        }

        webcamContainer.style.marginTop = '0vw';
        webcamContainer.style.left = '50%';
        webcamContainer.style.width = '25vw';
        webcamContainer.style.height = '25vw';

        title.style.display = 'block'
        playBtn.style.display = 'block'
    } else if (menu == 'modeSelect') {
        mode3Btn.style.display = 'none';
        mode5Btn.style.display = 'none';
        modeInfBtn.style.display = 'none';

        tutorialLabel.style.display = 'block';

        webcamContainer.style.marginTop = '7.5vw';
        webcamContainer.style.left = '15%';
        webcamContainer.style.width = '17.5vw';
        webcamContainer.style.height = '17.5vw';

        playerChoice.style.display = 'block';
        playerChoice.style.width = '20vw';
        playerChoice.style.top = '30vw';

        for (i of examples) {
            i.style.display = 'block';
        }

        playBtn2.style.display = 'block';
        
        menu = 'tutorialMenu';
    } else if (menu == 'gameMenu') {
        mode3Btn.style.display = 'flex';
        mode5Btn.style.display = 'flex';
        modeInfBtn.style.display = 'flex';

        quitBtn.textContent = 'Back';

        startRoundBtn.style.display = 'none';
        playerSide.style.display = 'none';
        enemySide.style.display = 'none';
        sideSeparator.style.display = 'none';
        playerScoreLabel.style.display = 'none';
        enemyScoreLabel.style.display = 'none';

        playerScore = 0;
        enemyScore = 0;
        playerScoreLabel.textContent = playerScore;
        enemyScoreLabel.textContent = enemyScore;

        menu = 'modeSelect';
    }
}

init();