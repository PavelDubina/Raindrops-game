const container = document.querySelector('.container'); 
const firstInput = document.querySelector('.first--input');
const operationInput = document.querySelector('.operation--input');
const secondInput = document.querySelector('.second--input');
const play = document.querySelector('.play');
const skip = document.querySelector('.skip');


window.addEventListener('load', ()=> {                                                                        
    if(localStorage.getItem('full') === 'true') {                                                               // проверяем была ли нажата кнопка "во весь экран" в главном меню
    container.classList.add('full-screen')
} else {
    container.classList.remove('full-screen')
}
})

firstInput.addEventListener('blur', () => {
    localStorage.setItem('first', firstInput.value)
})
operationInput.addEventListener('blur', () => {
    localStorage.setItem('operation',operationInput.value)
})
secondInput.addEventListener('blur', () => {
    localStorage.setItem('second',secondInput.value)
})
skip.addEventListener('click', ()=> {
    localStorage.removeItem('first' );
    localStorage.removeItem('operation');
    localStorage.removeItem('second');
})
