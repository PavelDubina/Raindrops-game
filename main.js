const gamePlace = document.querySelector('.game--place');
const wave = document.querySelector('.wave');
const displayValue = document.querySelector('.display--input');
const buttons = document.querySelector('.button-container');
const scoreBoard = document.querySelector('.score--num');
const mainAudio = document.querySelector('.main--theme');
const opArr = ['+','-','*','/'];
let gameOver = false;
let gameItaration = 0; // Количество проигрышей
let score = 0; //количество очков





//Передача значение на дисплей и сравнение с каплями
function updateDisplay(e){
    if(displayValue.value.length < 3 && e.target.dataset.num) {
        displayValue.value += e.target.dataset.num
    }
    switch(e.target.dataset.but){
        case '+': displayValue.value = '';
        break;
        case 'delete': displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
        break;
        case 'Enter': for(let key of document.querySelectorAll('.circle')){
            if(eval(key.textContent) === +displayValue.value){
                score += 10; 
                gamePlace.removeChild(key); 
                break;  
            } else score = score <= 0 ? 0 : score - 10;
        }
        displayValue.value = '';
        scoreBoard.textContent = score;
    }  
}

//Передача значения на дисплей с клавиатуры и сравнение с другими каплями
function updateDisplayWithKeyboard(e){
    if(e.location !== 3) return; // Проверяем действительно ли нажата кнопка поля numpad
    switch(e.key){
        case '+': displayValue.value = '';
        break;
        case '.': displayValue.value = displayValue.value.substring(0, displayValue.value.length - 1);
        break;
        case 'Enter': for(let key of document.querySelectorAll('.circle')){
            if(eval(key.textContent) === +displayValue.value){
                score += 10;
                gamePlace.removeChild(key);
                break;
            } else score = score <= 0 ? 0 : score - 10;    
        }
        displayValue.value = '';
        scoreBoard.innerHTML = score;
        break;
        default: 
        if(displayValue.value.length < 3) {
            displayValue.value += e.key
        } 
    }
}

//Создание капель
function createCircle(timeAddCircle){
    const circle = document.createElement('div');
    const firstOperand = document.createElement('span');
    const secondOperand = document.createElement('span');
    const operation = document.createElement('span');
    circle.className = 'circle';
    operation.className = 'operation';
    circle.style.left = randomPosition();
    circle.append(firstOperand, operation, secondOperand);
    innerCircle(secondOperand, operation, firstOperand);
    gamePlace.append(circle);
    animate(circle, 10000); // Добавление анимации
    setTimeout(() => {
        if(!gameOver){
            createCircle(timeAddCircle);
        } else {
            gamePlace.removeChild(circle)
        }
    }, timeAddCircle);
}

//Определение позиции left
function randomPosition(min = 0, max = 85){
    return Math.floor(Math.random() * (max - min) + min) + '%';
}
//Определение высоты воды
function findHeightWave(){
    return gamePlace.offsetHeight - wave.offsetHeight;
}
//Добавление анимации капле с динамической высотой и удаление после окончания анимации
function animate(circle, time){
    circle.animate([ { top: 0 },
        { top: `${findHeightWave() - circle.offsetHeight}px`} ],
      time).finished.then(()=> {
          try{
            gamePlace.removeChild(circle);
            gameItaration++;
            wave.style.height = `${wave.offsetHeight + 20}px` //!!!! вопрос
            if(gameItaration === 2) {gameOver = !gameOver}; // Если количество проигрышей больше
          } catch {
              return;
          }
               
        });         
}

//Определение операнд
function operandRandom(min = 0, max = 100){
    return Math.round(Math.random() * (max - min) + min);
}
function operationRandom(min = 0, max = 3){
    return opArr[Math.round(Math.random() * (max - min) + min)];
}

//Наполнение капли значениями
function innerCircle(fO, op, sO){
    const first = operandRandom(0,10);
    const second = operandRandom(0,10);
    const oper = operationRandom(0,1);
    if(first > second) return innerCircle(fO, op, sO);
    fO.innerHTML = first;
    sO.innerHTML = second;
    op.innerHTML = oper; 
}
 




createCircle(5000);





 buttons.addEventListener('click', updateDisplay);
 window.addEventListener('keydown', updateDisplayWithKeyboard);



 mainAudio.play();