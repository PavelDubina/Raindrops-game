const reloadTime = 20000;
const beginDemonstration = () => {

    const gameContainer = document.querySelector('.game--container'); // general game window
    const fullButton = document.querySelector('.full--button') // enlarge screen button
    const gamePlace = document.querySelector('.game--place'); // game window
    const wave = document.querySelector('.wave');
    const wave2 = document.querySelector('.wave2'); // wave
    const displayValue = document.querySelector('.display--input'); // display
    const buttons = document.querySelectorAll('.grid'); // all keys together
    const failBoarder = document.querySelector('.fail--text'); // pop-up notification about minus points in case of wrong answer
    const opArr = ['+', '-']; // array of operators
    const finishCountDrop = 4; // end of demo after 4th created blob
    const timeForRemoveSplashes = 1000;
    const timeForCreateLastDrops = 1200;
    const timeForAnimateLastDrops = 6000;
    const timeToPressNum = 3500;
    const timeToPressEnter = 4000;
    const timeToUpEnter = 4500;
    const demonstrationAnswerNum = 9
    let gameIteration = 0; // the initial number of drops hitting the water (will increase and affect the gameOver flag)
    let animationTime = 9000; // the initial duration of the fall animation (will decrease, making the game more difficult)
    let createTime = 5000
    let countDrop = 0;
    let gameOverCount = 3;

    const createSplashes = (drop) => { // creating splashes
        let img = new Image(8, 8);
        img.src = 'untitled.svg';
        img.className = 'spray';
        img.style.left = `${drop.offsetLeft + drop.offsetWidth/2}px`;
        img.style.top = `${drop.offsetTop + drop.offsetHeight/2}px`;
        gamePlace.append(img);
    }

    const useEnterKey = () => { // function of pressing the Enter key
        const drop = document.querySelector('.circle');
        createSplashes(drop);
        gamePlace.removeChild(drop); // remove the solved drop from the playing field
        setTimeout(() => { // after a while, remove the element with splashes
            gamePlace.removeChild(document.querySelector('.spray'));
        }, timeForRemoveSplashes);
        displayValue.value = ''; // reset the display                                               
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
        animateDrop(drop, animationTime); // add falling animation to each drop
        setTimeout(() => { //we determine the repetition of the creation of drops after a certain time
            if (countDrop === finishCountDrop) return; // ending the demo
            if (countDrop > 0) {
                createTime = timeForCreateLastDrops;
                animationTime = timeForAnimateLastDrops;
            }
            createDrop();
        }, createTime);
        countDrop++;
    }

    const definiteRandomPosition = (min = 0, max = 85) => { // determination of a random drop position
        return Math.floor(Math.random() * (max - min) + min) + '%';
    }

    const findHeightWave = () => { // determination of water height
        return gamePlace.offsetHeight - wave.offsetHeight;
    }

    const animateDrop = (drop, time) => { // a function that adds keyframes animation to the drop
        drop.animate([{
                        top: 0
                    },
                    {
                        top: `${findHeightWave() - drop.offsetHeight}px`
                    }
                ],
                time).finished
            .then(() => {
                try { // .finished returns a promise and use .then and try-catch as if the element is removed, and the animation has not ended, then an error occurred in the console
                    gamePlace.removeChild(drop); // after the end of the animation, namely the drop in the water, remove it
                    gameIteration++; // we increase the number of drops falling into the water
                    wave.style.height = `${wave.offsetHeight + 20}px`;
                    wave2.style.height = `${wave.offsetHeight + 20}px` // raising the water level
                    if (gameIteration >= gameOverCount) {
                        failBoarder.innerHTML = 'Game Over'; // display the Game Over message in the pop-up window
                        failBoarder.classList.add('open');
                    };
                } catch { // if error, exit
                    return;
                }
            });
    }

    const definiteOperandRandom = (min = 0, max = 50) => { // definition of random operands
        return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    }

    const definiteOperationRandom = (min = 0, max = 1) => { // definition of a random operator
        return opArr[Math.floor(min + Math.random() * (max + 1 - min))];
    }

    const insertInsideDrop = (firstOperand, operation, secondOperand) => { // droplet filling function
        firstOperand.innerHTML = countDrop > 0 ? definiteOperandRandom() : '7';
        secondOperand.innerHTML = countDrop > 0 ? definiteOperandRandom() : '2';
        operation.innerHTML = countDrop > 0 ? definiteOperationRandom() : '+';
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
        if (gameContainer.classList.contains('full-screen')) {
            localStorage.setItem('full', true)
        } else {
            localStorage.setItem('full', false)
        }
    }

    fullButton.addEventListener('click', runFullScreenMode);

    window.addEventListener('load', () => { // artificial click on the background music button on page load
        if (localStorage.getItem('full') === 'true') { // check if the "full screen" button was pressed in the main menu
            gameContainer.classList.add('full-screen');
            gamePlace.classList.add('full--game--place');
        } else {
            gameContainer.classList.remove('full-screen');
            gamePlace.classList.remove('full--game--place');
        }
    })

    const removeClassActive = (index) => { // remove button backlight class
        buttons[index].classList.remove('num--active');
    }

    window.addEventListener('load', () => { // artificial click on buttons for demonstration
        setTimeout(() => {
            buttons[2].classList.add('num--active');
            displayValue.value = demonstrationAnswerNum
        }, timeToPressNum);
        setTimeout(() => {
            removeClassActive(2);
            useEnterKey();
            buttons[10].classList.add('num--active');
        }, timeToPressEnter)
        setTimeout(() => {
            displayValue.value = ''
            removeClassActive(10);
        }, timeToUpEnter)
    })

    document.addEventListener("keypress", (e) => { // remove the standard Enter key response in full screen mode
        if (e.key === 'Enter' || e.key ==='Space') {
            e.preventDefault()
        } else {
            return
        }
    });

    createDrop(); // launch
}
beginDemonstration()
setTimeout(() => {
    document.location.reload();
}, reloadTime);