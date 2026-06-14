const nextBtn = document.querySelector('.next')
const prevBtn = document.querySelector('.prev')
const sliderTrack = document.querySelector('.slider-track')
const dots = document.querySelector('.dots')

const images = [
  "img/slider-pictures/Type=01.png",
  "img/slider-pictures/Type=02.png",
  "img/slider-pictures/Type=03.png",
  "img/slider-pictures/Type=04.png",
  "img/slider-pictures/Type=05.png",
  "img/slider-pictures/Type=06.png",
];

let currentSlide = 0;

function renderSlide() {

const left = images[currentSlide - 1];
const center = images[currentSlide];
const right = images[currentSlide + 1];

const allDots = dots.querySelectorAll('button');

allDots.forEach((dot, index) => {
  dot.classList.toggle('active', index === currentSlide);
});
  
sliderTrack.innerHTML = `
${left ? `<img src="${left}" class="slide" alt="">` : ''}
<img src="${center}" class="slide slide-active" alt="">
${right ? `<img src="${right}" class="slide" alt="">` : ''}
`;

updateButtons();
}

nextBtn.addEventListener('click', () => {
  if (currentSlide < images.length - 1) {
    currentSlide++;
    renderSlide();
  }
});

prevBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    renderSlide();
  }
});


images.forEach((_, index) => {
  const dot = document.createElement('button');

  dot.addEventListener('click', () => {
    currentSlide = index;
    renderSlide();
  });

  dots.append(dot);
});

function updateButtons() {
  prevBtn.classList.toggle('hidden', currentSlide === 0);

  nextBtn.classList.toggle(
    'hidden',
    currentSlide === images.length - 1
  );
}

renderSlide()