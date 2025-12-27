/* ================= FADE CAROUSEL (UNCHANGED) ================= */
const fadeSlides = document.querySelectorAll(".fade-slide");
const fadeDots = document.querySelectorAll("#fade-dots .dot");

let fadeCurrent = 0;

function showFadeSlide(i){
  fadeSlides.forEach(s=>s.classList.remove("active"));
  fadeDots.forEach(d=>d.classList.remove("active"));
  fadeSlides[i].classList.add("active");
  fadeDots[i].classList.add("active");
  fadeCurrent = i;
}

setInterval(()=>{
  showFadeSlide((fadeCurrent+1)%fadeSlides.length);
},3000);

fadeDots.forEach(dot=>{
  dot.addEventListener("click",()=>{
    showFadeSlide(+dot.dataset.slide);
  });
});

/* ================= SLIDE CAROUSEL (AUTO PLAY REMOVED) ================= */
const slideTrack = document.getElementById("slideTrack");
const slideItems = document.querySelectorAll(".slide-item");
const slideDots = document.querySelectorAll(".slide-dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

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
