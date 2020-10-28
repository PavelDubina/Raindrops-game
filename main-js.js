const fullSize = document.querySelector('.full--button');
const container = document.querySelector('.container');

fullSize.addEventListener('click', () => {
    container.classList.toggle('full-screen');
    if(container.classList.contains('full-screen')){
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
})
