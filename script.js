/* ================= FADE CAROUSEL ================= */
const fadeSlides = document.querySelectorAll(".fade-slide");
const fadeDots = document.querySelectorAll("#fade-dots .dot");
const fadeBox = document.getElementById("fadeCarousel");
const fadePrev = document.getElementById("fadePrev");
const fadeNext = document.getElementById("fadeNext");

let fadeCurrent = 0;

function showFadeSlide(i){
  fadeSlides.forEach(s=>s.classList.remove("active"));
  fadeDots.forEach(d=>d.classList.remove("active"));
  fadeSlides[i].classList.add("active");
  fadeDots[i].classList.add("active");
  fadeCurrent = i;
}

fadePrev.onclick = ()=>{
  showFadeSlide((fadeCurrent-1+fadeSlides.length)%fadeSlides.length);
};

fadeNext.onclick = ()=>{
  showFadeSlide((fadeCurrent+1)%fadeSlides.length);
};

setInterval(()=>{
  showFadeSlide((fadeCurrent+1)%fadeSlides.length);
},3000);

fadeDots.forEach(dot=>{
  dot.onclick = ()=> showFadeSlide(+dot.dataset.slide);
});

/* swipe fade */
let fadeStartX = 0;
fadeBox.addEventListener("touchstart",e=>{
  fadeStartX = e.touches[0].clientX;
});
fadeBox.addEventListener("touchend",e=>{
  let diff = e.changedTouches[0].clientX - fadeStartX;
  if(diff > 50) fadePrev.click();
  if(diff < -50) fadeNext.click();
});


/* ================= SLIDE CAROUSEL ================= */
const slideTrack = document.getElementById("slideTrack");
const slideItems = document.querySelectorAll(".slide-item");
const slideDots = document.querySelectorAll("#slide-dots .dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideBox = document.getElementById("slideCarousel");

let slideCurrent = 0;

function showSlide(i){
  slideTrack.style.transform = `translateX(-${i*100}%)`;
  slideDots.forEach(d=>d.classList.remove("active"));
  slideDots[i].classList.add("active");
  slideCurrent = i;
}

prevBtn.onclick = ()=>{
  showSlide((slideCurrent-1+slideItems.length)%slideItems.length);
};

nextBtn.onclick = ()=>{
  showSlide((slideCurrent+1)%slideItems.length);
};

slideDots.forEach(dot=>{
  dot.onclick = ()=> showSlide(+dot.dataset.slide);
});

/* swipe slide */
let slideStartX = 0;
slideBox.addEventListener("touchstart",e=>{
  slideStartX = e.touches[0].clientX;
});
slideBox.addEventListener("touchend",e=>{
  let diff = e.changedTouches[0].clientX - slideStartX;
  if(diff > 50) prevBtn.click();
  if(diff < -50) nextBtn.click();
});
