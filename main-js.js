const fullButton = document.querySelector('.full--button');               // кнопка увеличения размера экрана
const container = document.querySelector('.container');                 // главная страница


const localValue = () => {
    if(container.classList.contains('full-screen')){
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
}

window.addEventListener('load', ()=> {
    localValue();
})

fullButton.addEventListener('click', () => {                         // при нажатии на кнопку увеличения размера экрана меняем значение в localStorage в зависимости от наличия класса у главной страницы и в последующем используем это в скрипте игры 
    if(document.fullscreenElement){
        container.classList.toggle('full-screen');
        document.exitFullscreen()  
    } else{
        container.classList.toggle('full-screen');
        document.documentElement.requestFullscreen();
    } 
    localValue(); 
})

document.addEventListener("keypress", (e) => {                                                            // убераем стандартное срабатывание клавиши Enter при полноэкранном режиме
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  });
