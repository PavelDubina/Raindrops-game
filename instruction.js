function demonstration(){
    const gameContainer = document.querySelector('.game--container');                       // общее окно игры
    const fullButton = document.querySelector('.full--button')                              // кнопка увеличения размера экрана
    const gamePlace = document.querySelector('.game--place');                               // игровое окно
    const wave = document.querySelector('.wave'); 
    const wave2 = document.querySelector('.wave2');                                          // волна
    const displayValue = document.querySelector('.display--input');                         // дисплей
    const buttonPad = document.querySelector('.button-container');                          // контейнер со всеми клавишами 
    const buttons = document.querySelectorAll('.grid');                                     // все клавиши вместе
    const failBoarder = document.querySelector('.fail--text');                              // всплывающее уведомление об минусе очков при неправильном ответе
    const opArr = ['+','-'];                                                                // массив операторов
    let gameItaration = 0;                                                                  // начальное количество капель, попавших в воду (будет увеличиваться и влиять на флаг gameOver)
    let animationTime = 9000;                                                               // начальная длительность анимации падения (будет уменьшаться, усложняя игру)
    let createTime = 5000
    let countDrop = 0;
    let gameOverCount = 3;
    
    
    function createSpray(one){                                                              // создаём брызги
        let img = new Image(8, 8);
        img.src = 'untitled.svg';
        img.className = 'spray';
        img.style.left = `${one.offsetLeft + one.offsetWidth/2}px`;
        img.style.top = `${one.offsetTop + one.offsetHeight/2}px`;
        gamePlace.append(img); 
    }
    
    function useEnter(){                                                                    // функция нажатия на клавишу Enter
        const drop = document.querySelectorAll('.circle');
        if(!displayValue.value) return;                                                     // если дисплей пуст, ничего не происходит
                for(let one of drop){            
                     if(eval(one.textContent) === +displayValue.value){     // перебираем все капли, находящиеся в момент нажатия enter на игровом поле и сравниваем значение на дисплее с результатом выражения внутри капли и меняем значения оператора с красивого на читаемое Eval                                                                        // увеличиваем ScorePrice
                    createSpray(one);                                                                 
                    gamePlace.removeChild(one);                                             // удаляем с игрового поля решенную каплю
                   setTimeout(() => {                                                       // через время удаляем элемент с брызгами
                    gamePlace.removeChild(document.querySelector('.spray'));                
                   }, 1000);                          
                    break;  
                }
        }
            displayValue.value = '';                                                        // обнуляем дисплей                                               
    }
    
    
    
    function updateDisplay(e){
        if(displayValue.value.length < 3 && e.target.dataset.num) {                         // передача значения кнопок на дисплей при вводе мышкой
            displayValue.value += e.target.dataset.num
        }
        switch(e.target.dataset.but){
            case 'Enter': 
            useEnter();
        }  
    }
    
    function createDrop(){                                                                          // функция создания капель
        const circle = document.createElement('div');                                               // создаем элементы div
        const firstOperand = document.createElement('span');                                        
        const secondOperand = document.createElement('span');                                       // создаем элементы span
        const operation = document.createElement('span');
        circle.className = 'circle';                                                                // добавляем классы к созданным элементам
        operation.className = 'operation';
        circle.style.left = randomPosition();                                                       // добавляем случайную позицию появления капель
        circle.append(firstOperand, operation, secondOperand);                                      
        innerCircle(firstOperand, operation, secondOperand);                                        // заполняем каплю случайным содержимым и добавляем на игровое поле
        gamePlace.append(circle);                                                                 
        animate(circle, animationTime);                                                             // добавляем каждой капле анимацию падения
        setTimeout(() => {                                                                          // определяем повторение создания капель через определенное время
            if(countDrop === 4) return;                                                             // заканчиваем демонстрацию
            if(countDrop>0) {
                createTime = 1200;
                animationTime = 6000
            }                                                                          
            createDrop();                                                                           
        }, createTime);
        countDrop++;
    }
    
    
    function randomPosition(min = 0, max = 85){                                                                     // определение случайной позиции капли
        return Math.floor(Math.random() * (max - min) + min) + '%';
    }
    
    
    function findHeightWave(){                                                                                      // определения высоты воды
        return gamePlace.offsetHeight - wave.offsetHeight;
    }
    
    
    function animate(circle, time){                                                                                 // функция, добавляющая капле анимацию keyframes
        circle.animate([ { top: 0 },                                                                    
            { top: `${findHeightWave() - circle.offsetHeight}px`} ],
          time).finished
            .then(()=> {
              try{                                                                                                  // .finished возвращает промис и используем .then и try-catch, т.к. если элемент удаляется, а анимация не закончилась, то в консоле било ошибку
                gamePlace.removeChild(circle);                                                                      // после окончания анимации, а именно падения капли в воду, удаляем её
                gameItaration++;                                                                                    // увеличиваем количество капель, упавших в воду
                wave.style.height = `${wave.offsetHeight + 20}px`;
                wave2.style.height = `${wave.offsetHeight + 20}px`                                                   // повышаем уровень воды
                if(gameItaration >= gameOverCount) { 
                    failBoarder.innerHTML = 'Game Over';                                                            // отображаем в всплывающем окне сообщение Game Over
                    failBoarder.classList.add('open');  
                }; 
              } catch {                                                                                             // если ошибка, выходим
                  return;
              }      
        });         
    }
    
    function operandRandom(min = 0, max = 50){                                                                     // определение случайных операнд
        return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    }
    
    function operationRandom(min = 0, max = 1){                                                                     // определение случайного оператора
        return opArr[Math.floor(min + Math.random() * (max + 1 - min))];
    }
    
    function innerCircle(fO, op, sO){                                                                               // функция заполнения капли содержимым
        fO.innerHTML = countDrop>0?operandRandom():'7';
        sO.innerHTML = countDrop>0?operandRandom():'2';
        op.innerHTML = countDrop>0?operationRandom():'+';
    }
    
     
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
    
    
     buttonPad.addEventListener('click', updateDisplay);                                                            // обработчик события на поле с клавишами (делегирование)
     fullButton.addEventListener('click', fullScreen);                                                              
     window.addEventListener('load', ()=> {                                                                         // искусственный клик на кнопку фоновой музыки при загрузке страницы 
        if(localStorage.getItem('full') === 'true') {                                                               // проверяем была ли нажата кнопка "во весь экран" в главном меню
        gameContainer.classList.add('full-screen');
        gamePlace.classList.add('full--game--place');
    } else {
        gameContainer.classList.remove('full-screen');
        gamePlace.classList.remove('full--game--place');
    }
    })
    window.addEventListener('load', ()=> {                                                                         // искусственный клик на кнопки для демонстрации
        setTimeout(() => {
            buttons[2].click();
            buttons[2].classList.add('num--active');
            setTimeout(() => {
                buttons[2].classList.remove('num--active');
            }, 500);
            setTimeout(() => {
                buttons[10].click();
                buttons[10].classList.add('num--active');
                setTimeout(() => {
                    buttons[10].classList.remove('num--active');
                }, 500)
            }, 500);
        }, 3500);
    })
    createDrop();                                                                                                   // запуск
}
demonstration()
setTimeout(() => {
    document.location.reload();  
   }, 20000); 


 


