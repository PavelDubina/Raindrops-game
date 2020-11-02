const demonstration = () => {

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
    let gameIteration = 0;                                                                  // начальное количество капель, попавших в воду (будет увеличиваться и влиять на флаг gameOver)
    let animationTime = 9000;                                                               // начальная длительность анимации падения (будет уменьшаться, усложняя игру)
    let createTime = 5000
    let countDrop = 0;
    const finishCountDrop = 4;                                                              // конец демонстраци после 4-й созданной капли
    let gameOverCount = 3;
    
    const createSpray = (drop) => {                                                              // создаём брызги
        let img = new Image(8, 8);
        img.src = 'untitled.svg';
        img.className = 'spray';
        img.style.left = `${drop.offsetLeft + drop.offsetWidth/2}px`;
        img.style.top = `${drop.offsetTop + drop.offsetHeight/2}px`;
        gamePlace.append(img); 
    }
    
    const useEnter = () =>{                                                                    // функция нажатия на клавишу Enter
        const drop = document.querySelector('.circle');           
                    createSpray(drop);                                                                 
                    gamePlace.removeChild(drop);                                             // удаляем с игрового поля решенную каплю
                   setTimeout(() => {                                                       // через время удаляем элемент с брызгами
                    gamePlace.removeChild(document.querySelector('.spray'));                
                   }, 1000);                            
            displayValue.value = '';                                                        // обнуляем дисплей                                               
    }
    
    const updateDisplay = (e) => {                                                              // передача значения кнопок на дисплей при вводе мышкой                 
        displayValue.value += e.target.dataset.num; 
        if(e.target.dataset.but === 'Enter'){ 
            useEnter();
        } 
    }
    
    const createDrop = () => {                                                                          // функция создания капель
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
            if(countDrop === finishCountDrop) return;                                                             // заканчиваем демонстрацию
            if(countDrop > 0) {
                createTime = 1200;
                animationTime = 6000
            }                                                                          
            createDrop();                                                                           
        }, createTime);
        countDrop++;
    }
    
    
    const randomPosition = (min = 0, max = 85) => {                                                                     // определение случайной позиции капли
        return Math.floor(Math.random() * (max - min) + min) + '%';
    }
    
    
    const findHeightWave = () => {                                                                                      // определения высоты воды
        return gamePlace.offsetHeight - wave.offsetHeight;
    }
    
    
    const animate = (circle, time) => {                                                                                 // функция, добавляющая капле анимацию keyframes
        circle.animate([ { top: 0 },                                                                    
            { top: `${findHeightWave() - circle.offsetHeight}px`} ],
          time).finished
            .then(()=> {
              try{                                                                                                  // .finished возвращает промис и используем .then и try-catch, т.к. если элемент удаляется, а анимация не закончилась, то в консоле било ошибку
                gamePlace.removeChild(circle);                                                                      // после окончания анимации, а именно падения капли в воду, удаляем её
                gameIteration++;                                                                                    // увеличиваем количество капель, упавших в воду
                wave.style.height = `${wave.offsetHeight + 20}px`;
                wave2.style.height = `${wave.offsetHeight + 20}px`                                                   // повышаем уровень воды
                if(gameIteration >= gameOverCount) { 
                    failBoarder.innerHTML = 'Game Over';                                                            // отображаем в всплывающем окне сообщение Game Over
                    failBoarder.classList.add('open');  
                }; 
              } catch {                                                                                             // если ошибка, выходим
                  return;
              }      
        });         
    }
    
    const operandRandom = (min = 0, max = 50) => {                                                                     // определение случайных операнд
        return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    }
    
    const operationRandom = (min = 0, max = 1) => {                                                                     // определение случайного оператора
        return opArr[Math.floor(min + Math.random() * (max + 1 - min))];
    }
    
    const innerCircle = (firstOperand, operation, secondOperand) => {                                                                               // функция заполнения капли содержимым
        firstOperand.innerHTML = countDrop > 0 ? operandRandom() : '7';
        secondOperand.innerHTML = countDrop > 0 ? operandRandom() : '2';
        operation.innerHTML = countDrop > 0 ? operationRandom() : '+';
    }
    
     
    const fullScreen = () => {                                                                                          // функция разворачивающая приложение во весь экран
        if(document.fullscreenElement){
            gameContainer.classList.remove('full-screen');
            gamePlace.classList.remove('full--game--place');
            document.exitFullscreen()    
        } else{
            gameContainer.classList.add('full-screen');
            gamePlace.classList.add('full--game--place');
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

    const showDemonstrationDrop = (ms) => {                                                                            // время через которое начнутся искусственные клики
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms)
        })
    }

    const addClassActive = (index) => {                                                                                 // добавления класса подсветки кнопки
        buttons[index].click();
        buttons[index].classList.add('num--active');
    }

    const removeClassActive = (index) => {                                                                              // удаление класса подсветки кнопки
        buttons[index].classList.remove('num--active');
    }

    window.addEventListener('load', () => {                                                                         // искусственный клик на кнопки для демонстрации
    showDemonstrationDrop(3500)
        .then(() => {
            return new Promise(resolve => {
                addClassActive(2);
                setTimeout(() => {
                removeClassActive(2);
                resolve();
                    }, 500)
                })
            })
        .then(() => {
                addClassActive(10)
                setTimeout(() => {
                removeClassActive(10);  
                }, 500)
    })
})

    document.addEventListener("keypress", (e) => {                                                            // убераем стандартное срабатывание клавиши Enter при полноэкранном режиме
        if (e.key === 'Enter') {
          e.preventDefault()
        }
      });
      
    createDrop();                                                                                                   // запуск
}
demonstration()
setTimeout(() => {
    document.location.reload();  
   }, 20000); 


