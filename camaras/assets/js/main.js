const progress=document.getElementById('progress');
const nav=document.getElementById('nav');
const navToggle=document.getElementById('navToggle');
const navLinks=document.getElementById('navLinks');
const navActions=document.querySelector('.nav-actions');
navToggle?.addEventListener('click',()=>{
  const expanded=navToggle.getAttribute('aria-expanded')==='true';
  navToggle.setAttribute('aria-expanded',String(!expanded));
  navLinks.classList.toggle('active');
  navActions?.classList.toggle('active');
});
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=(h>0?((scrollY/h)*100):0)+'%';
  nav.classList.toggle('scrolled',scrollY>30);
});
const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.14});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('.accordion button').forEach(btn=>btn.addEventListener('click',()=>{
  btn.classList.toggle('open');
  const marker=btn.querySelector('span:last-child');
  if(marker) marker.textContent=btn.classList.contains('open')?'-':'+';
}));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
  navLinks.classList.remove('active');
  navActions?.classList.remove('active');
  navToggle?.setAttribute('aria-expanded','false');
}));
const parallaxItems=document.querySelectorAll('.parallax-soft');
window.addEventListener('scroll',()=>{
  const offset=window.scrollY;
  parallaxItems.forEach((item,index)=>{
    const speed=(index%2===0?0.018:-0.014);
    item.style.setProperty('--parallax-shift',`${offset*speed}px`);
  });
},{passive:true});
