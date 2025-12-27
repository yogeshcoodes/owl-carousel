/* =====================================================
   GLOBAL SWIPE LOCK
   Purpose:
   - User agar 1 sec me 30–40 swipe kare
   - To UI pagal na ho
   - 1 action ke baad 0.2 sec ka cooldown
===================================================== */

let canSwipe = true;

function lockSwipe(){
  canSwipe = false;              // swipe temporarily disable
  setTimeout(() => {
    canSwipe = true;             // swipe re-enable after 0.2 sec
  }, 200);
}


/* =====================================================
   FADE CAROUSEL
   Features:
   - Infinite loop
   - Autoplay
   - Smart pause on interaction
   - Pause on touch-hold
===================================================== */

const fadeSlides = document.querySelectorAll(".fade-slide");   // all fade slides
const fadeDots   = document.querySelectorAll("#fade-dots .dot"); // dots
const fadeBox    = document.getElementById("fadeCarousel");    // carousel container
const fadePrev   = document.getElementById("fadePrev");        // left arrow
const fadeNext   = document.getElementById("fadeNext");        // right arrow

let fadeCurrent = 0;           // current slide index
let fadeAutoTimer = null;      // autoplay interval reference
let pauseUntilRelease = false; // true when user is holding touch


/* -----------------------------------------------------
   Show specific fade slide (with infinite wrapping)
----------------------------------------------------- */
function showFadeSlide(i){

  // remove active state from all slides & dots
  fadeSlides.forEach(s => s.classList.remove("active"));
  fadeDots.forEach(d => d.classList.remove("active"));

  // infinite loop logic
  if(i < 0) i = fadeSlides.length - 1;
  if(i >= fadeSlides.length) i = 0;

  // activate selected slide & dot
  fadeSlides[i].classList.add("active");
  fadeDots[i].classList.add("active");

  fadeCurrent = i; // update current index
}


/* -----------------------------------------------------
   Start autoplay
----------------------------------------------------- */
function startFadeAuto(){
  clearInterval(fadeAutoTimer);   // safety clear
  fadeAutoTimer = setInterval(() => {
    showFadeSlide(fadeCurrent + 1);
  }, 3000);
}


/* -----------------------------------------------------
   Pause autoplay temporarily
   - default pause: 1 sec
----------------------------------------------------- */
function pauseFade(ms = 1000){
  clearInterval(fadeAutoTimer);

  // agar user touch hold me hai → resume mat karo
  if(pauseUntilRelease) return;

  setTimeout(startFadeAuto, ms);
}

// start autoplay on load
startFadeAuto();


/* -----------------------------------------------------
   Arrow controls
----------------------------------------------------- */
fadePrev.onclick = () => {
  if(!canSwipe) return;     // spam protection
  lockSwipe();
  pauseFade();
  showFadeSlide(fadeCurrent - 1);
};

fadeNext.onclick = () => {
  if(!canSwipe) return;
  lockSwipe();
  pauseFade();
  showFadeSlide(fadeCurrent + 1);
};


/* -----------------------------------------------------
   Dot controls
----------------------------------------------------- */
fadeDots.forEach(dot => {
  dot.onclick = () => {
    if(!canSwipe) return;
    lockSwipe();
    pauseFade();
    showFadeSlide(+dot.dataset.slide);
  };
});


/* -----------------------------------------------------
   Swipe + Touch Hold (Mobile UX)
----------------------------------------------------- */
let fadeStartX = 0;

fadeBox.addEventListener("touchstart", e => {
  fadeStartX = e.touches[0].clientX; // starting touch position
  pauseUntilRelease = true;          // mark hold state
  clearInterval(fadeAutoTimer);      // hard pause autoplay
});

fadeBox.addEventListener("touchend", e => {
  pauseUntilRelease = false;         // user released touch

  let diff = e.changedTouches[0].clientX - fadeStartX;

  // swipe right
  if(diff > 50){
    lockSwipe();
    showFadeSlide(fadeCurrent - 1);
  }

  // swipe left
  if(diff < -50){
    lockSwipe();
    showFadeSlide(fadeCurrent + 1);
  }

  pauseFade(); // resume autoplay after 1.5 sec
});


/* =====================================================
   SLIDE CAROUSEL
   Features:
   - Live drag
   - Edge resistance
   - No infinite loop
   - 80% swipe threshold
   - Swipe lock
===================================================== */

const slideTrack = document.getElementById("slideTrack");       // track wrapper
const slideItems = document.querySelectorAll(".slide-item");   // slides
const slideDots  = document.querySelectorAll("#slide-dots .dot");
const prevBtn    = document.getElementById("prevBtn");
const nextBtn    = document.getElementById("nextBtn");
const slideBox   = document.getElementById("slideCarousel");

let slideCurrent = 0;       // current slide index
let startX = 0;             // touch start position
let currentX = 0;           // live touch position
let isDragging = false;     // dragging flag
let slideWidth = slideBox.offsetWidth; // slide width


/* -----------------------------------------------------
   Show slide by index
----------------------------------------------------- */
function showSlide(i){
  slideTrack.style.transition = "transform 0.35s ease";
  slideTrack.style.transform = `translateX(-${i * slideWidth}px)`;

  slideDots.forEach(d => d.classList.remove("active"));
  slideDots[i].classList.add("active");

  slideCurrent = i;
}


/* -----------------------------------------------------
   Arrow buttons
----------------------------------------------------- */
prevBtn.onclick = () => {
  if(!canSwipe || slideCurrent === 0) return;
  lockSwipe();
  showSlide(slideCurrent - 1);
};

nextBtn.onclick = () => {
  if(!canSwipe || slideCurrent === slideItems.length - 1) return;
  lockSwipe();
  showSlide(slideCurrent + 1);
};


/* -----------------------------------------------------
   Dot navigation
----------------------------------------------------- */
slideDots.forEach(dot => {
  dot.onclick = () => {
    if(!canSwipe) return;
    lockSwipe();
    showSlide(+dot.dataset.slide);
  };
});


/* -----------------------------------------------------
   Touch start (begin drag)
----------------------------------------------------- */
slideBox.addEventListener("touchstart", e => {
  if(!canSwipe) return;

  startX = e.touches[0].clientX;
  currentX = startX;
  isDragging = true;

  slideTrack.style.transition = "none"; // disable animation during drag
});


/* -----------------------------------------------------
   Touch move (live drag)
----------------------------------------------------- */
slideBox.addEventListener("touchmove", e => {
  if(!isDragging) return;

  currentX = e.touches[0].clientX;
  let diff = currentX - startX;

  // edge resistance
  if(
    (slideCurrent === 0 && diff > 0) ||
    (slideCurrent === slideItems.length - 1 && diff < 0)
  ){
    diff *= 0.35;
  }

  slideTrack.style.transform =
    `translateX(${ -slideCurrent * slideWidth + diff }px)`;
});


/* -----------------------------------------------------
   Touch end (release)
----------------------------------------------------- */
slideBox.addEventListener("touchend", () => {
  if(!isDragging || !canSwipe) return;

  isDragging = false;

  let diff = currentX - startX;
  let threshold = slideWidth * 0.8; // 80% rule

  if(diff < -threshold && slideCurrent < slideItems.length - 1){
    lockSwipe();
    showSlide(slideCurrent + 1);
  }
  else if(diff > threshold && slideCurrent > 0){
    lockSwipe();
    showSlide(slideCurrent - 1);
  }
  else{
    showSlide(slideCurrent); // snap back
  }
});


/* -----------------------------------------------------
   Resize safety (responsive fix)
----------------------------------------------------- */
window.addEventListener("resize", () => {
  slideWidth = slideBox.offsetWidth;
  showSlide(slideCurrent);
});
