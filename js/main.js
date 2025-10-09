/* main.js - UI interactions and small enhancements */
document.addEventListener('DOMContentLoaded', ()=>{
  // Preloader will be hidden on full load (see window.load handler)

  // Year
  const y = document.getElementById('currentYear'); if(y) y.textContent = new Date().getFullYear();

  // Menu toggle
  const menu = document.getElementById('menuToggle'); if(menu){ menu.addEventListener('click', ()=>{ const nav=document.getElementById('mainNav'); if(nav) nav.classList.toggle('open'); }); }

  // Wire add-to-cart buttons
  document.addEventListener('click', e=>{
    const atc = e.target.closest('.add-to-cart');
    if(atc){ addToCart(atc.dataset.id); alert('Added to cart'); }
  });

  // Typed text simple animation (cycles keywords)
  const words = ['Electronics','Fashion','Home','Gadgets','Daily Deals'];
  const el = document.getElementById('typed'); if(el){ let i=0; setInterval(()=>{ el.textContent = words[i++%words.length]; },2000); }

  // Newsletter submit (demo)
  const nf = document.getElementById('newsletterForm'); if(nf){ nf.addEventListener('submit', e=>{ e.preventDefault(); alert('Thanks for subscribing!'); nf.reset(); }); }

  // Navbar change on scroll
  const nav = document.querySelector('.site-nav');
  function onScroll(){ if(window.scrollY>80) nav.classList.add('scrolled'); else nav.classList.remove('scrolled'); }
  onScroll(); window.addEventListener('scroll', onScroll);

  // AOS-like simple init: add 'aos-animate' when element in viewport
  const aosEls = document.querySelectorAll('[data-aos]');
  const obs = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('aos-animate'); obs.unobserve(en.target); } }) },{threshold:0.12});
  aosEls.forEach(el=>{ el.classList.add('aos-init'); obs.observe(el); });

  // Hero video fallback: hide video if not supported
  const hv = document.getElementById('heroVideo'); if(hv){ hv.addEventListener('error', ()=>{ hv.style.display='none'; document.querySelector('.hero-overlay').style.background='linear-gradient(90deg,rgba(0,0,0,.35),rgba(0,0,0,.05))' }) }
});

// Hide preloader on window load with smooth fade
window.addEventListener('load', ()=>{
  const pre = document.getElementById('preloader');
  if(!pre) return;
  // If GSAP is ready, use it for smooth fade; otherwise use CSS class
  if(window.gsap){
    gsap.to(pre,{opacity:0,duration:0.7,onComplete:()=>{ pre.style.display='none'; }});
  } else {
    pre.classList.add('fade-out'); setTimeout(()=>{ pre.style.display='none'; },700);
  }
});

// Dynamically load GSAP + ScrollTrigger and initialize hero animations + custom cursor
(function loadGsap(){
  function loadScript(src, cb){ const s=document.createElement('script'); s.src=src; s.onload=cb; document.head.appendChild(s); }
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', ()=>{
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', initGsap);
  });
  function initGsap(){
    try{ gsap.registerPlugin(ScrollTrigger); }catch(e){}
    // simple hero neon pulse
    if(window.gsap){
      gsap.to('.neon-title',{textShadow:'0 0 24px rgba(0,230,255, .9)',repeat:-1,yoyo:true,duration:2,ease:'sine.inOut'});

      // product reveal using ScrollTrigger for any .product-card
      gsap.utils.toArray('.product-card').forEach((card)=>{
        gsap.from(card,{y:30,opacity:0,duration:0.7,scrollTrigger:{trigger:card, start:'top 85%'}});
      });
    }
  }

  // custom cursor movement
  const cursor = document.getElementById('cursor');
  if(cursor){ document.addEventListener('mousemove', e=>{ cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }); }

  // simple neon canvas background (moving gradient blobs)
  const canvas = document.getElementById('neonCanvas');
  if(canvas){ const ctx = canvas.getContext('2d'); function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; } resize(); window.addEventListener('resize', resize);
    let t=0; function draw(){ t+=0.01; ctx.clearRect(0,0,canvas.width,canvas.height); const grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height); grd.addColorStop(0,'rgba(0,230,255,' + (0.2 + Math.abs(Math.sin(t))*0.2) + ')'); grd.addColorStop(1,'rgba(255,45,149,' + (0.12 + Math.abs(Math.cos(t))*0.12) + ')'); ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height); requestAnimationFrame(draw); } draw(); }
})();
