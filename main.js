const field = document.querySelector('.game-field');
// field의 width와 height을 알기위해 getBoundingClientRect() method를 이용.
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game-btn');
const gameScore = document.querySelector('.game-score');
const gameTimer = document.querySelector('.game-timer');

const popUp = document.querySelector('.pop-up');
const popUpRedo = document.querySelector('.pop-up-redo');
const popUpMessage = document.querySelector('.pop-up-message');

const carrotSound = new Audio('./sound/carrot_pull.mp3')
const bugSound = new Audio('./sound/bug_pull.mp3')

const bgSound = new Audio('./sound/bg.mp3')
const gameWin = new Audio('./sound/game_win.mp3')

const carrot_count = 20;
const bug_count = 10;
const carrot_size = 80;
const game_duration_sec = 20;

let started = false;
let timer = undefined;
let score = 0;


function init() {
    score = 0;
    field.innerHTML = '';
    gameScore.innerText = carrot_count;
    addItem('carrot', carrot_count, 'img/carrot.png')
    addItem('bug', bug_count, 'img/bug.png')
}

function addItem(className, count, imgPath) {
    
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - carrot_size;
    const y2 = fieldRect.height - carrot_size;

    for(let i = 0; i < count; i++) {
        const img = document.createElement('img');
        img.setAttribute('class', className);
        img.setAttribute('src', imgPath);
        const x = randomNumber(x1, x2)
        const y = randomNumber(y1, y2)
        img.style.position = 'absolute';
        img.style.top = `${y}px`
        img.style.left = `${x}px`
        field.appendChild(img)
    }
}

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}


gameBtn.addEventListener('click', () => {

    if(started) {
        stopGame();
    }
    else{
        startGame();
    }
    
});

popUpRedo.addEventListener('click', () => {
    startGame();
    hidePopUp();
})

field.addEventListener('click', onFieldClick)


function startGame() {
    started = true;
    init();
    playSound(bgSound)
    showTimerAndScore();
    showStopButton();
    startGameTimer();
}

function stopGame() {
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('Try Again?');
    stopSound(bgSound)
}


function showStopButton() {
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop')
    icon.classList.remove('fa-play')
    gameBtn.style.visibility = 'visible'
}

function hideGameButton() {
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
    gameScore.style.visibility = 'visible';
    gameTimer.style.visibility = 'visible';
}

function startGameTimer() {
    let remainingSec = game_duration_sec;
    updateTimerText(remainingSec);
    timer = setInterval(() => {
        if(remainingSec <= 0) {
            clearInterval(timer)
            finishGame(score === carrot_count);
            return;
         }
         updateTimerText(--remainingSec);
    }, 1000)
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60
    gameTimer.innerText = `${minutes}:${seconds}`
}

function showPopUpWithText(msg) {
    popUp.classList.remove('pop-up-hide');
    popUpMessage.innerText = msg;

}

function onFieldClick(event) {
    if(!started) {
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        score++;
        target.remove();
        playSound(carrotSound);
        updateScoreBoard();
        if(score === carrot_count) {
            stopGameTimer();
            finishGame(true);
        }
    }
    else if(target.matches('.bug')){
        playSound(bugSound)
        stopGameTimer();
        finishGame(false);
    }
}

function updateScoreBoard() {
    gameScore.innerText = carrot_count - score;
}

function finishGame(win) {
    started = false;
    hideGameButton();
    if(win) {
        playSound(gameWin)
    }
    else {
        playSound(bugSound)
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopUpWithText(win ? 'YOU WON!!' : 'YOU LOST..');
}

function hidePopUp() {
    popUp.classList.add('pop-up-hide');
}

function playSound(sound) {
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}