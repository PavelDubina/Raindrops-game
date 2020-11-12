const fullButton = document.querySelector('.full--button'); // enlarge screen button
const container = document.querySelector('.container'); // home page


const uselocalValue = () => {
    if (container.classList.contains('full-screen')) {
        localStorage.setItem('full', true)
    } else {
        localStorage.setItem('full', false)
    }
}

window.addEventListener('load', () => {
    uselocalValue();
})

fullButton.addEventListener('click', () => { // when you click on the button to increase the screen size, we change the value in localStorage, depending on the presence of a class on the main page and then use it in the game script 
    if (document.fullscreenElement) {
        container.classList.toggle('full-screen');
        document.exitFullscreen()
    } else {
        container.classList.toggle('full-screen');
        document.documentElement.requestFullscreen();
    }
    uselocalValue();
})

document.addEventListener("keypress", (e) => { // remove the standard Enter key response in full screen mode
    if (e.key === 'Enter') {
        e.preventDefault()
    }
});