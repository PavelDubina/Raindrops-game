const continueButton = document.querySelector('.reload--game'); // statistics window continue button              
const gameContainer = document.querySelector('.game--container'); // общее окно игры
const fullButton = document.querySelector('.full--button') // enlarge screen button
const gamePlace = document.querySelector('.game--place'); // game window
const wave = document.querySelector('.wave'); // wave
const wave2 = document.querySelector('.wave2');
const displayValue = document.querySelector('.display--input'); // display
const buttonPad = document.querySelector('.button-container'); // container with all keys
const buttons = document.querySelectorAll('.grid'); // all keys together
const scoreBoard = document.querySelector('.score--num'); // Score window
const mainAudio = document.querySelector('.main--theme'); // background music
const dropSound = document.querySelector('.drop--sound'); // the sound of a drop falling into water
const correctSound = document.querySelector('.right--sound'); // sound with correct answer
const failSound = document.querySelector('.fail--sound'); // sound on wrong answer
const sunSound = document.querySelector('.sun--sound') // sound when solving expressions in the sun
const failBoarder = document.querySelector('.fail--text'); // pop-up notification about minus points in case of wrong answer
const statsBoard = document.querySelector('.game--stats'); // statistics window
const scorePoins = document.querySelector('.score--point'); // the Score value in the statistics window
const accuracyPoint = document.querySelector('.accuracy'); // percentage of correct answers in the statistics window
const solvePoint = document.querySelector('.solve'); // the value of the number of correct answers in the statistics window
const perMinutePoint = document.querySelector('.per--minute'); // the value of the number of correct answers per minute in the statistics window
const soundButton = document.querySelector('.sound--button'); // music button
const opArr = localStorage.getItem('operation') ? [...localStorage.getItem('operation')] : ['+', '-', '*', '/']; // check localStorage and take an array from there, if it is not there, then use the default // array of operators
const timeForRemoveSplashes = 1000;
const defaultScoreValue = 10;
const timeForRemoveFailBoarder = 500;
const scoreValueForLvUp = {
    lv1: 50,
    lv2: 200,
    lv3: 400
}
const minCreateTime = 1000;
const decreaseCreateTime = 20;
const decreaseAnimateTime = 30;
const randomTimeValue = {
    min: 15000,
    max: 60000
}
const randomPositionValue = {
    min: 0,
    max: 85
}
const randomOperandValue = {
    min: 0,
    max: 100
}
const randomOperationValue = {
    min: 0,
    max: 3
}
const convertToPercentageValue = 100;
const msPerSec = 1000;
const secPerMinute = 60;
const indexOfOperations = {
    first: 0,
    second: 1,
    third: 2,
    fourth: 3
}
let gameOver = false; // flag indicating whether the game is over or not
let gameIteration = 0; // the initial number of drops hitting the water (will increase and affect the gameOver flag)
let score = 0; // Initial Score                                          
let scorePrice = 10; // the number of points awarded for the first correct answer (for each subsequent correct answer will increase, and for an incorrect one will decrease)
let animationTime = 9000; // the initial duration of the fall animation (will decrease, making the game more difficult)
let createTime = 5000; // initial drop creation time (will decrease, making the game more difficult)
let gameOverCount = 3; // the number of drops hitting the water to end the game
let lvOperand = 10; // initial range of operand (will increase, making the game more difficult)
let lvOperation = localStorage.getItem('operation') ? opArr.length - 1 : 0; // starting index of the array of operators (will increase to 3, adding new operators and making the game more difficult)
let correctAnswers = 0; // initial number of correct answers
let countDrops = 0; // the initial number of drops created
let isSound = true;

const createSplashes = (one) => { // creating splashes
    let img = new Image(8, 8);
    img.src = 'untitled.svg';
    img.className = 'spray';
    img.style.left = `${one.offsetLeft + one.offsetWidth/2}px`;
    img.style.top = `${one.offsetTop + one.offsetHeight/2}px`;
    gamePlace.append(img);
}

const useSun = (sun, drop) => { // sun interaction function
    if (!!sun) {
        const sunny = sun.children;
        const firstOperand = sunny[0].textContent;
        const secondOperand = sunny[2].textContent;
        const operation = sunny[1].textContent;
        const operationEqualsDivision = sunny[1].textContent === '÷';
        const operationEqualsMultiplication = sunny[1].textContent === '×';
        if (eval(`${firstOperand}${operationEqualsDivision ? '/' : operationEqualsMultiplication? '*' : operation}${secondOperand}`) === +displayValue.value) { // сравниваем значение на дисплее с результатом выражения внутри солнца и меняем значения оператора с красивого на читаемое Eval
            if (isSound) {
                sunSound.play();
            }
            drop.forEach(drop => {
                createSplashes(drop); //creating splashes         
                gamePlace.removeChild(drop); //remove all drops from the playing field
                setTimeout(() => { // after a while, remove the element with splashes
                    gamePlace.removeChild(document.querySelector('.spray'));
                }, timeForRemoveSplashes);
            });
            gamePlace.removeChild(sun); // remove the sun
            displayValue.value = ''; // reset the display
        }
    }
}

const useEnter = () => { // function of pressing the Enter key
    const drop = document.querySelectorAll('.circle');
    const sun = document.querySelector('.sun');
    if (!displayValue.value) return; // if the display is blank, nothing happens
    useSun(sun, drop);
    for (let one of drop) {
        const children = one.children; // create the variable 'children' of the blob 
        const firstOperand = children[0].textContent;
        const secondOperand = children[2].textContent;
        const operation = children[1].textContent;
        const operationEqualsDivision = children[1].textContent === '÷';
        const operationEqualsMultiplication = children[1].textContent === '×';
        if (eval(`${firstOperand}${operationEqualsDivision ? '/' : operationEqualsMultiplication ? '*' : operation}${secondOperand}`) === +displayValue.value) { // we iterate over all the drops that are on the playing field at the moment of pressing enter and compare the value on the display with the result of the expression inside the drop and change the values ​​of the operator from beautiful to readable Eval                       
            correctAnswers++;
            if (isSound) {
                correctSound.currentTime = 0; // reset the sound of the correct answer to the beginning and turn it on
                correctSound.play();
            }
            score += scorePrice = scorePrice < defaultScoreValue ? defaultScoreValue : scorePrice; // add the current ScorePrice value to Score
            scorePrice++; // increase ScorePrice
            createSplashes(one); // creating splashes         
            gamePlace.removeChild(one); // remove the solved drop from the playing field
            setTimeout(() => { // after a while, remove the element with splashes
                gamePlace.removeChild(document.querySelector('.spray'));
            }, timeForRemoveSplashes);
            break;
        } else {
            if (!!sun) {
                displayValue.value = ''; // reset the display
                return;
            }
            if (one !== drop[drop.length - 1]) continue; // if the answer is incorrect, then we check that among all the drops on the playing field there is no correct expression inside
            if (isSound) {
                failSound.currentTime = 0;
                failSound.play(); // reset the sound of the wrong answer to the beginning and turn it on
            }
            failBoarder.innerHTML = -(scorePrice < defaultScoreValue ? defaultScoreValue : scorePrice); // display the number of points taken from Score in the pop-up window
            failBoarder.classList.add('open'); // add a class to this window to show it
            setTimeout(() => { // after the specified time, delete and return this window to opacity 0
                failBoarder.classList.remove('open');
            }, timeForRemoveFailBoarder);
            score = score - scorePrice <= 0 ? 0 : score - scorePrice; // subtract the current ScorePrice value from Score
        }
    }
    displayValue.value = ''; // reset the display
    scoreBoard.textContent = score; // displaying the current number of points in the Score
}


const activateButtons = (e) => { // backlighting of buttons when entering from the keyboard
    buttons.forEach(btn => {
        if (e.code.includes('Numpad') && btn.dataset.num === e.key && e.getModifierState("NumLock") || btn.dataset.btn === e.code && e.getModifierState("NumLock")) {
            btn.classList.toggle('activate');
        }
    });
}

const updateDisplay = (e) => {
    if (displayValue.value.length < 3 && e.target.dataset.num) { // transferring the value of buttons to the display when typing with a mouse
        displayValue.value += e.target.dataset.num
    }
    switch (e.target.dataset.btn) {
        case 'NumpadAdd':
            displayValue.value = '';
            break;
        case 'NumpadDecimal':
            displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
            break;
        case 'NumpadEnter':
            useEnter();
    }
}

const updateDisplayWithKeyboard = (e) => { // transmission of key values ​​to the display during keyboard input
    if (!e.code.includes('Numpad') || !e.getModifierState("NumLock")) return; // check if numpad field button is actually clicked
    console.log(e.getModifierState("NumLock"))
    switch (e.code) {
        case 'NumpadDivide':
        case 'NumpadMultiply':
        case 'NumpadSubtract':
            return;
        case 'NumpadAdd':
            displayValue.value = '';
            break;
        case 'NumpadDecimal':
            displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
            break;
        case 'NumpadEnter':
            useEnter();
            break;
        default:
            if (displayValue.value.length < 3) displayValue.value += e.key;
    }
    activateButtons(e);
}

const createDrop = () => { // droplet creation function
    const drop = document.createElement('div'); // create div elements
    const firstOperand = document.createElement('span');
    const secondOperand = document.createElement('span'); // creating span elements
    const operation = document.createElement('span');
    drop.className = 'circle'; // add classes to the created elements
    operation.className = 'operation';
    drop.style.left = definiteRandomPosition(); // add a random drop position
    drop.append(firstOperand, operation, secondOperand);
    insertInsideDrop(firstOperand, operation, secondOperand); // fill the drop with random content and add it to the playing field
    gamePlace.append(drop);
    animate(drop, animationTime); // add falling animation to each drop
    setTimeout(() => { // we determine the repetition of the creation of drops after a certain time
        if (gameOver) return; // if the gameOver flag is true, stop creating drops
        createDrop(); // if the flag is false, call the same function
        countDrops++ // increase the number of drops created
        createTime = createTime < (minCreateTime + decreaseCreateTime) ? minCreateTime : createTime - decreaseCreateTime; // reduce the time for creating drops
        lvOperand++; // increase the range of used operands
        animationTime -= decreaseAnimateTime; // reduce the drop fall time
        if (localStorage.getItem('operation')) return;
        lvOperation = score > scoreValueForLvUp.lv3 ? indexOfOperations.fourth : score > scoreValueForLvUp.lv2 ? indexOfOperations.third : score > scoreValueForLvUp.lv1 ? indexOfOperations.second : indexOfOperations.first; // increase the index of the operator array. adding new ones based on the number of points in the Score
    }, createTime);
}

const createSun = () => { // sun creation function
    if (gameOver) return;
    const sun = document.createElement('div'); // create div elements
    const firstOperand = document.createElement('span');
    const secondOperand = document.createElement('span'); // creating span elements
    const operation = document.createElement('span');
    sun.className = 'sun'; // add a class to the created element
    operation.className = 'operation';
    sun.style.left = definiteRandomPosition(); // add a random sun position
    sun.append(firstOperand, operation, secondOperand);
    insertInsideDrop(firstOperand, operation, secondOperand); // fill the sun with random content and add it to the playing field
    gamePlace.append(sun);
    animate(sun, animationTime); // add the sun fall animation
    setTimeout(() => {
        if (gameOver) return;
        createSun();
    }, definiteRandomTime());
}

const definiteRandomTime = (min = randomTimeValue.min, max = randomTimeValue.max) => { // determination the random time of the sun
    return Math.floor(Math.random() * (max - min) + min);
}


const definiteRandomPosition = (min = randomPositionValue.min, max = randomPositionValue.max) => { // determination of a random drop position
    return Math.floor(Math.random() * (max - min) + min) + '%';
}


const findHeightWave = () => { // determination of water height
    return gamePlace.offsetHeight - wave.offsetHeight;
}


const animate = (element, time) => { // a function that adds keyframes animation to the drop
    element.animate([{
                    top: 0
                },
                {
                    top: `${findHeightWave() - element.offsetHeight}px`
                }
            ],
            time).finished
        .then(() => {
            try { // .finished returns a promise and use .then and try-catch as if the element is removed, and the animation has not ended, then an error occurred in the console
                gamePlace.removeChild(element); // after the end of the animation, namely the drop in the water, remove it
                gameIteration++; // we increase the number of drops falling into the water
                wave.style.height = `${wave.offsetHeight + 20}px`
                wave2.style.height = `${wave.offsetHeight + 20}px` // raising the water level
                if (isSound) {
                    dropSound.play();
                } // turn on the sound of a drop}
                if (gameIteration >= gameOverCount) { // we compare the number of drops hitting the water required to end the game and the number of drops hitting the water
                    showGameOver(); // if the game is over, the statistics window appears        
                    gameOver = !gameOver; // toggle the gemeOver flag
                    document.querySelectorAll('.circle').forEach(drop => gamePlace.removeChild(drop)) // find all the drops on the playing field at the end of the game and clear the playing field                                                                               
                    gamePlace.removeChild(document.querySelector('.sun'))
                };
            } catch { // if error, exit
                return;
            }
        });
}

const showGameOver = () => { // function of showing statistics window at the end of the game
    statsBoard.classList.add('game--stats--visible');
    scorePoins.innerHTML = score;
    accuracyPoint.innerHTML = `${Math.ceil(correctAnswers * convertToPercentageValue / countDrops)}%`;
    solvePoint.innerHTML = correctAnswers;
    perMinutePoint.innerHTML = Math.round(correctAnswers / (performance.now() / msPerSec / secPerMinute))
}

const definiteOperandRandom = (min = randomOperandValue.min, max = randomOperandValue.max) => { // definition of random operands
    max = max > randomOperandValue.max ? randomOperandValue.max : max;
    min = min > randomOperandValue.max ? randomOperandValue.max : min;
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));

}

const definiteOperationRandom = (min = randomOperationValue.min, max = randomOperationValue.max) => { // definition of a random operator
    return opArr[Math.floor(min + Math.random() * (max + 1 - min))];
}

const insertInsideDrop = (firstOperand, operation, secondOperand) => { // function of filling a drop with random content
    let firstOperandRange = localStorage.getItem('first') ? localStorage.getItem('first').split('-') : [0, lvOperand]; // we check if there is a value in localStorage and if there is, we use it, and if not, the game starts in normal mode with a gradual increase in complexity
    let secondOperandRange = localStorage.getItem('second') ? localStorage.getItem('second').split('-') : [0, lvOperand];
    if (firstOperandRange[0] > firstOperandRange[1]) firstOperandRange.reverse(); // we check the correctness of the entered data and, if necessary, correct
    if (secondOperandRange[0] > secondOperandRange[1]) secondOperandRange.reverse();
    if (secondOperandRange.length < 2) secondOperandRange = [`${secondOperandRange[0]}`, `${secondOperandRange[0]}`]; // if the array passed from localStorage contains only one element, we limit the range of values ​​to one number
    if (firstOperandRange.length < 2) firstOperandRange = [`${firstOperandRange[0]}`, `${firstOperandRange[0]}`];
    const oper = definiteOperationRandom(0, lvOperation);
    const first = definiteOperandRandom(...firstOperandRange);
    const second = definiteOperandRandom(...secondOperandRange);
    const firstCondition = first < second && oper === '*';
    const secondCondition = first < second && oper === '-';
    const thirdCondition = first % second !== 0 && oper === '/';
    const fourthCondition = first / second === 0 && oper === '/';
    const fifthContidion = oper === '*' && second > 10;
    if (firstCondition || secondCondition || thirdCondition || fourthCondition || fifthContidion) return insertInsideDrop(firstOperand, operation, secondOperand); // we test for division by zero and limit the complexity of mathematical expressions
    firstOperand.innerHTML = first;
    secondOperand.innerHTML = second;
    operation.innerHTML = oper === '/' ? '÷' : oper === '*' ? '×' : oper;
}

const runFullScreenMode = () => { // function that expands the application to full screen
    if (document.fullscreenElement) {
        gameContainer.classList.remove('full-screen');
        gamePlace.classList.remove('full--game--place');
        document.exitFullscreen()
    } else {
        gameContainer.classList.add('full-screen');
        gamePlace.classList.add('full--game--place');
        document.documentElement.requestFullscreen();
    }
}

continueButton.addEventListener('click', () => { // we reset the values ​​previously written to local memory
    localStorage.removeItem('first');
    localStorage.removeItem('operation');
    localStorage.removeItem('second');
})

buttonPad.addEventListener('click', updateDisplay); // event handler on the field with keys (delegation)

window.addEventListener('keydown', updateDisplayWithKeyboard); // keyboard keypress event handler

window.addEventListener('keyup', activateButtons); // keyboard key up event handler

fullButton.addEventListener('click', runFullScreenMode);

window.addEventListener('load', () => { // artificial click on the background music button on page load 
    soundButton.click();
    if (localStorage.getItem('full') === 'true') { // check if the "full screen" button was pressed in the main menu
        gameContainer.classList.add('full-screen');
        gamePlace.classList.add('full--game--place');
    } else {
        gameContainer.classList.remove('full-screen');
        gamePlace.classList.remove('full--game--place');
    }
})

soundButton.addEventListener('click', () => { //background music keypress event handler
    if (mainAudio.paused) {
        mainAudio.play();
        isSound = true;
    } else {
        mainAudio.pause();
        isSound = false;
    }
})

document.addEventListener("keydown", (e) => { // remove the standard Enter key response in full screen mode
    if (e.key === 'Enter' || e.code === 'Space') {
        e.preventDefault()
    }
});

createDrop();
setTimeout(() => {
    createSun();
}, definiteRandomTime());
// запуск