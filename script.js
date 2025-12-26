// your code goes here
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const slider = document.querySelector(".slides");

let current = 0;
let interval = 3000;
let timer = null;
let holdTimer = null;
let isPaused = false;

/* ---------- core ---------- */
function showSlide(index) {
  slides.forEach((s) => s.classList.remove("active"));
  dots.forEach((d) => d.classList.remove("active"));

  slides[index].classList.add("active");
  dots[index].classList.add("active");
  current = index;
}

/* ---------- autoplay ---------- */
function startAutoPlay() {
  if (timer || isPaused) return;

  timer = setInterval(() => {
    showSlide((current + 1) % slides.length);
  }, interval);
}

function stopAutoPlay() {
  clearInterval(timer);
  timer = null;
}

/* ---------- dots ---------- */
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(+dot.dataset.slide);
    stopAutoPlay();
    startAutoPlay();
  });
});

/* ---------- swipe ---------- */
let startX = 0;

slider.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;

  holdTimer = setTimeout(() => {
    isPaused = true;
    stopAutoPlay();
  }, 2000);
});

slider.addEventListener("touchend", (e) => {
  clearTimeout(holdTimer);

  let endX = e.changedTouches[0].clientX;
  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      showSlide((current + 1) % slides.length);
    } else {
      showSlide((current - 1 + slides.length) % slides.length);
    }
  }

  isPaused = false;
  startAutoPlay();
});

/* ---------- mouse hover ---------- */
slider.addEventListener("mouseenter", () => {
  holdTimer = setTimeout(() => {
    isPaused = true;
    stopAutoPlay();
  }, 2000);
});

slider.addEventListener("mouseleave", () => {
  clearTimeout(holdTimer);
  isPaused = false;
  startAutoPlay();
});

/* ---------- init ---------- */
startAutoPlay();
