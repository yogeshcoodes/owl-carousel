/* =====================================================
   GLOBAL SWIPE LOCK
===================================================== */
let canSwipe = true;
function lockSwipe() {
  canSwipe = false;
  setTimeout(() => (canSwipe = true), 200);
}

/* =====================================================
   FADE CAROUSEL (INFINITE + SMART PAUSE)
===================================================== */
const fadeSlides = document.querySelectorAll(".fade-slide");
const fadeDots = document.querySelectorAll("#fade-dots .dot");
const fadeBox = document.getElementById("fadeCarousel");
const fadePrev = document.getElementById("fadePrev");
const fadeNext = document.getElementById("fadeNext");

let fadeCurrent = 0;
let fadeAutoTimer = null;
let pauseUntilRelease = false;
let fadeStartX = 0;
let fadeDragging = false;

/* show fade slide */
function showFadeSlide(i) {
  fadeSlides.forEach((s) => s.classList.remove("active"));
  fadeDots.forEach((d) => d.classList.remove("active"));

  if (i < 0) i = fadeSlides.length - 1;
  if (i >= fadeSlides.length) i = 0;

  fadeSlides[i].classList.add("active");
  fadeDots[i].classList.add("active");
  fadeCurrent = i;
}

/* autoplay */
function startFadeAuto() {
  clearInterval(fadeAutoTimer);
  fadeAutoTimer = setInterval(() => {
    showFadeSlide(fadeCurrent + 1);
  }, 3000);
}

function pauseFade(ms = 1000) {
  clearInterval(fadeAutoTimer);
  if (pauseUntilRelease) return;
  setTimeout(startFadeAuto, ms);
}

startFadeAuto();

/* arrows */
fadePrev.onclick = () => {
  if (!canSwipe) return;
  lockSwipe();
  pauseFade();
  showFadeSlide(fadeCurrent - 1);
};

fadeNext.onclick = () => {
  if (!canSwipe) return;
  lockSwipe();
  pauseFade();
  showFadeSlide(fadeCurrent + 1);
};

/* dots */
fadeDots.forEach((dot) => {
  dot.onclick = () => {
    if (!canSwipe) return;
    lockSwipe();
    pauseFade();
    showFadeSlide(+dot.dataset.slide);
  };
});

/* touch + mouse (fade) */
function fadeStart(x) {
  fadeStartX = x;
  pauseUntilRelease = true;
  fadeDragging = true;
  clearInterval(fadeAutoTimer);
}

function fadeEnd(x) {
  if (!fadeDragging) return;
  fadeDragging = false;
  pauseUntilRelease = false;

  let diff = x - fadeStartX;
  if (diff > 50) showFadeSlide(fadeCurrent - 1);
  if (diff < -50) showFadeSlide(fadeCurrent + 1);

  pauseFade();
}

fadeBox.addEventListener("touchstart", (e) => fadeStart(e.touches[0].clientX));
fadeBox.addEventListener("touchend", (e) =>
  fadeEnd(e.changedTouches[0].clientX)
);
fadeBox.addEventListener("mousedown", (e) => fadeStart(e.clientX));
window.addEventListener("mouseup", (e) => fadeEnd(e.clientX));

/* =====================================================
   SLIDE CAROUSEL (POLISHED + TOUCH + MOUSE)
===================================================== */
const slideTrack = document.getElementById("slideTrack");
const slideItems = document.querySelectorAll(".slide-item");
const slideDots = document.querySelectorAll("#slide-dots .dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideBox = document.getElementById("slideCarousel");

let slideCurrent = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;
let slideWidth = slideBox.offsetWidth;

/* arrow visibility */
function updateSlideArrows() {
  prevBtn.style.display = slideCurrent === 0 ? "none" : "flex";
  nextBtn.style.display =
    slideCurrent === slideItems.length - 1 ? "none" : "flex";
}

/* show slide */
function showSlide(i) {
  slideTrack.style.transition = "transform 0.35s ease";
  slideTrack.style.transform = `translateX(-${i * slideWidth}px)`;

  slideDots.forEach((d) => d.classList.remove("active"));
  slideDots[i].classList.add("active");

  slideCurrent = i;
  updateSlideArrows();
}

/* arrows */
prevBtn.onclick = () => {
  if (!canSwipe || slideCurrent === 0) return;
  lockSwipe();
  showSlide(slideCurrent - 1);
};

nextBtn.onclick = () => {
  if (!canSwipe || slideCurrent === slideItems.length - 1) return;
  lockSwipe();
  showSlide(slideCurrent + 1);
};

/* dots */
slideDots.forEach((dot) => {
  dot.onclick = () => {
    if (!canSwipe) return;
    lockSwipe();
    showSlide(+dot.dataset.slide);
  };
});

/* touch + mouse slide */
function slideStart(x) {
  if (!canSwipe) return;
  startX = x;
  currentX = x;
  isDragging = true;
  slideTrack.style.transition = "none";
}

function slideMove(x) {
  if (!isDragging) return;
  currentX = x;

  let diff = currentX - startX;

  if (
    (slideCurrent === 0 && diff > 0) ||
    (slideCurrent === slideItems.length - 1 && diff < 0)
  ) {
    diff *= 0.35;
  }

  slideTrack.style.transform = `translateX(${
    -slideCurrent * slideWidth + diff
  }px)`;
}

function slideEnd() {
  if (!isDragging || !canSwipe) return;
  isDragging = false;

  let diff = currentX - startX;
  let threshold = slideWidth * 0.3;

  if (diff < -threshold && slideCurrent < slideItems.length - 1) {
    lockSwipe();
    showSlide(slideCurrent + 1);
  } else if (diff > threshold && slideCurrent > 0) {
    lockSwipe();
    showSlide(slideCurrent - 1);
  } else {
    showSlide(slideCurrent);
  }
}

slideBox.addEventListener("touchstart", (e) =>
  slideStart(e.touches[0].clientX)
);
slideBox.addEventListener("touchmove", (e) => slideMove(e.touches[0].clientX));
slideBox.addEventListener("touchend", slideEnd);

slideBox.addEventListener("mousedown", (e) => slideStart(e.clientX));
window.addEventListener("mousemove", (e) => slideMove(e.clientX));
window.addEventListener("mouseup", slideEnd);

/* =====================================================
   RESIZE FIX (NO SIDE IMAGE FLASH)
===================================================== */
window.addEventListener("resize", () => {
  slideTrack.style.transition = "none"; // 🔥 stop animation
  slideWidth = slideBox.offsetWidth;
  slideTrack.style.transform = `translateX(-${slideCurrent * slideWidth}px)`;

  requestAnimationFrame(() => {
    slideTrack.style.transition = "transform 0.35s ease";
  });
});

/* initial state */
updateSlideArrows();
