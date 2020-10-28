const fullSize = document.querySelector('.full--button');               // кнопка увеличения размера экрана
const container = document.querySelector('.container');                 // главная страница


function localValue(){
    if(container.classList.contains('full-screen')){
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
}

fullSize.addEventListener('click', () => {                              // при нажатии на кнопку увеличения размера экрана меняем значение в localStorage в зависимости от наличия класса у главной страницы и в последующем используем это в скрипте игры 
    container.classList.toggle('full-screen');
    localValue();
})
window.addEventListener('load', ()=> {
    localValue();
})
