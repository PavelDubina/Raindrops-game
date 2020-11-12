const fullButton = document.querySelector('.full--button')
const gameContainer = document.querySelector('.container');
const firstInput = document.querySelector('.first--input');
const operationInput = document.querySelector('.operation--input');
const secondInput = document.querySelector('.second--input');
const play = document.querySelector('.play');
const skip = document.querySelector('.skip');

const runFullScreenMode = () => { // The ability to extend the application to full screen
    if (document.fullscreenElement) {
        gameContainer.classList.remove('full-screen');
        document.exitFullscreen()
    } else {
        gameContainer.classList.add('full-screen');
        document.documentElement.requestFullscreen();
    }
    if (gameContainer.classList.contains('full-screen')) {
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
}

const limitInput = (e) => { // we check whether the entered value meets the established requirements and if not, then we correct it  // after which we write to local memory
    e.target.value = e.target.value.replace(/([^0-9\-])/g, '');
    if (!/([\-])/g.test(e.target.value) && +e.target.value > 100) e.target.value = 100;
    localStorage.setItem('first', e.target.value)
}

window.addEventListener('load', () => {
    if (localStorage.getItem('full') === 'true') { // check if the "full screen" button was pressed in the main menu
        gameContainer.classList.add('full-screen')
    } else {
        gameContainer.classList.remove('full-screen')
    }
})

firstInput.addEventListener('blur', limitInput);

operationInput.addEventListener('blur', () => {
    operationInput.value = operationInput.value.replace(/([^+\-/*])/g, '');
    localStorage.setItem('operation', operationInput.value)
})

secondInput.addEventListener('blur', limitInput)

skip.addEventListener('click', () => { // if we press the Skip key, the game starts in default mode
    localStorage.removeItem('first');
    localStorage.removeItem('operation');
    localStorage.removeItem('second');
})

fullButton.addEventListener('click', runFullScreenMode);

document.addEventListener("keypress", function (e) { // remove the standard Enter key response in full screen mode
    if (e.key === 'Enter') {
        e.preventDefault()
    }
});