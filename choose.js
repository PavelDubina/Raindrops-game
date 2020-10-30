const fullButton = document.querySelector('.full--button')
const gameContainer = document.querySelector('.container'); 
const firstInput = document.querySelector('.first--input');
const operationInput = document.querySelector('.operation--input');
const secondInput = document.querySelector('.second--input');
const play = document.querySelector('.play');
const skip = document.querySelector('.skip');

function fullScreen(){                                                                                          // функция разворачивающая приложение во весь экран
    if(document.fullscreenElement){
        gameContainer.classList.remove('full-screen');
        document.exitFullscreen()    
    } else{
        gameContainer.classList.add('full-screen');
        document.documentElement.requestFullscreen();
    } 
    if(gameContainer.classList.contains('full-screen')){
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
}


window.addEventListener('load', ()=> {                                                                        
    if(localStorage.getItem('full') === 'true') {                                                               // проверяем была ли нажата кнопка "во весь экран" в главном меню
    gameContainer.classList.add('full-screen')
} else {
    gameContainer.classList.remove('full-screen')
}
})

firstInput.addEventListener('blur', () => {                                                                     // проверяем соответствует ли введенное значение установленным требованиям и если нет, то корректируем его
    firstInput.value = firstInput.value.replace(/([^0-9\-])/g,'');
    if(!/([\-])/g.test(firstInput.value) && +firstInput.value > 100) firstInput.value = 100;
    localStorage.setItem('first', firstInput.value)                                                             // после чего записываем в локальную память
})
operationInput.addEventListener('blur', () => {
    operationInput.value = operationInput.value.replace(/([^+\-/*])/g,'');
    localStorage.setItem('operation',operationInput.value)
})
secondInput.addEventListener('blur', () => {
    secondInput.value = secondInput.value.replace(/([^0-9\-])/g,'');
    if(!/([\-])/g.test(secondInput.value) && +secondInput.value > 100) secondInput.value = 100;
    localStorage.setItem('second',secondInput.value)
})
skip.addEventListener('click', ()=> {                                                                           // если нажимаем клавишу Skip игра запускается в режиме по умолчанию
    localStorage.removeItem('first' );
    localStorage.removeItem('operation');
    localStorage.removeItem('second');
})

fullButton.addEventListener('click', fullScreen);
