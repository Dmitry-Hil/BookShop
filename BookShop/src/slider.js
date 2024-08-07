document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    const slideInterval = 3000; 
    let intervalId;
    let intervalRunning = false;


    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
    }

    
    function startSlideShow() {
        /*intervalId = setInterval(nextSlide, slideInterval);*/
if (!intervalRunning) { // Проверка, запущен ли интервал
            intervalId = setInterval(nextSlide, slideInterval);
            intervalRunning = true; // Установка флага
        }
    }


    function stopSlideShow() {
        clearInterval(intervalId);
 intervalRunning = false;
    }


    startSlideShow();



// Обработка клика по точкам
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow(); 
            currentIndex = index; 
            showSlide(currentIndex); 
            setTimeout(startSlideShow, 3000); // Запустить автопереключение через  секунд
        });
    });

    // Обработка клика по слайдам
    slides.forEach((slide, index) => {
        slide.addEventListener('click', () => {
            stopSlideShow(); 
            currentIndex = index; 
            showSlide(currentIndex); 
            setTimeout(startSlideShow, 3000); // Запустить автопереключение через  секунд
        });
    });

    showSlide(currentIndex); 

});

/*
const entities = [
    {
        img: './images/banner1.png',
        dot: document.querySelector('.dot-1')
    },
    {
        img: './images/banner2.png',
        dot: document.querySelector('.dot-2')
    },
    {
        img: './images/banner3.png',
        dot: document.querySelector('.dot-3')
    }
].filter(entity => entity.dot); // фильтруем только те, у которых имеются соответствующие элементы

document.addEventListener('DOMContentLoaded', function() {
    // Проверим, есть ли какие-либо актуальные сущности
    if (entities.length === 0) {
        console.warn('No valid entities found. Check your dot selectors.');
        return;
    }

    const slider = document.querySelector('.slider-content__img');
    let currentIndex = 0;

    function setEntity(index) {
        slider.style.backgroundImage = `url(${entities[index].img})`;
    }

    function makeActive(index) {
        entities[index].dot.style.opacity = 1;
    }

    function makeInactive(index) {
        entities[index].dot.style.opacity = 0.3;
    }

    function pressOnElement(index) {
        makeInactive(currentIndex);
        currentIndex = index;
        setEntity(currentIndex);
        makeActive(currentIndex);
    }

    function autoSlide() {
        makeInactive(currentIndex);
        currentIndex = (currentIndex + 1) % entities.length; // Упрощенная логика переключения
        setEntity(currentIndex);
        makeActive(currentIndex);
    }

    // Устанавливаем таймер для автопрокрутки
    setInterval(autoSlide, 5000);

    // Настраиваем события клика на точки
    for (let i = 0; i < entities.length; i++) {
        entities[i].dot.addEventListener('click', () => {
            pressOnElement(i);
        });
    }

    // Начальные состояния
    setEntity(currentIndex);
    makeActive(currentIndex);
});

console.log(entities[0].img);

*/