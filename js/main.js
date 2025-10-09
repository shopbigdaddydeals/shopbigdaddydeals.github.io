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

  // Nav-box fade based on scroll direction (only affects .nav-links.nav-boxed)
  (function navFadeOnScroll(){
    const navBox = document.querySelector('.nav-links.nav-boxed'); if(!navBox) return;
    let lastY = window.scrollY; let ticking = false; let enabled = true;

    function update(){ const y = window.scrollY; if(y <= 20){ navBox.classList.remove('nav-visible'); navBox.classList.remove('nav-hidden'); navBox.style.opacity=''; enabled = false; return; } // at top, reset and stop
      enabled = true;
      if(y > lastY + 5){ // scrolling down -> show
        navBox.classList.add('nav-visible'); navBox.classList.remove('nav-hidden');
      } else if(y < lastY - 5){ // scrolling up -> hide
        navBox.classList.add('nav-hidden'); navBox.classList.remove('nav-visible');
      }
      lastY = y;
      ticking = false;
    }

    window.addEventListener('scroll', ()=>{ if(ticking) return; ticking = true; requestAnimationFrame(update); });
  })();

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

/* Page transition overlay and navigation interception */
(function pageTransitions(){
  // create overlay element
  const overlay = document.createElement('div'); overlay.className = 'page-transition'; overlay.id = 'pageTransition'; document.body.appendChild(overlay);

  // helpers to determine same-origin, internal links, and reduced motion
  function isInternalLink(a){ try{ const url = new URL(a.href, location.href); return url.origin === location.origin; }catch(e){return false;} }
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animate out then navigate
  function navigateWithTransition(href){ if(prefersReduced){ location.href = href; return; }
    if(window.gsap){ gsap.to('#pageTransition',{duration:0.45,opacity:1, pointerEvents:'auto', ease:'power2.out', onComplete:()=>{ location.href = href; }}); }
    else { overlay.classList.add('active'); setTimeout(()=> location.href = href, 400); }
  }

  // intercept clicks on links
  document.addEventListener('click', e=>{
    const a = e.target.closest('a'); if(!a) return; // not a link
    // allow downloads, mailto, tel, blanks, external
    if(a.target === '_blank' || a.hasAttribute('download') || a.href.startsWith('mailto:') || a.href.startsWith('tel:')) return;
    if(!isInternalLink(a)) return;
    // let anchor links scroll normally
    if(a.hash && (a.pathname === location.pathname)) return;

    e.preventDefault(); const href = a.href;
    navigateWithTransition(href);
  });

  // On page show (back/forward), fade overlay out
  window.addEventListener('pageshow', ()=>{
    if(prefersReduced) return; if(window.gsap){ gsap.to('#pageTransition',{duration:0.45,opacity:0,pointerEvents:'none',ease:'power2.in'}); }
    else { overlay.classList.remove('active'); }
  });
})();

// Header search focus behavior (expands input)
(function headerSearchFocus(){
  const input = document.getElementById('headerSearch');
  const wrap = document.getElementById('headerSearchWrap');
  if(!input || !wrap) return;
  input.addEventListener('focus', ()=>wrap.classList.add('focused'));
  input.addEventListener('blur', ()=>wrap.classList.remove('focused'));
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' || e.key === 'Esc'){ if(document.activeElement === input) input.blur(); } });
})();

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

  // custom cursor removed for minimalist design — use system cursor

  // simple neon canvas background (moving gradient blobs)
  const canvas = document.getElementById('neonCanvas');
  if(canvas){ const ctx = canvas.getContext('2d'); function resize(){ canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; } resize(); window.addEventListener('resize', resize);
  // Lightweight lazy-loading for images using data-src and .lazy class
  (function lazyLoadImages(){
    if(!('IntersectionObserver' in window)){
      // eager load
      document.querySelectorAll('img[data-src]').forEach(img=>{ img.src = img.dataset.src; img.classList.add('loaded'); });
      return;
    }
    const imgs = document.querySelectorAll('img.lazy[data-src]');
    const io = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting){ const img = en.target; img.src = img.dataset.src; img.addEventListener('load', ()=>img.classList.add('loaded')); io.unobserve(img); } }) },{rootMargin:'200px 0px'});
    imgs.forEach(i=>io.observe(i));
  })();
    let t=0; function draw(){ t+=0.01; ctx.clearRect(0,0,canvas.width,canvas.height); const grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height); grd.addColorStop(0,'rgba(0,230,255,' + (0.2 + Math.abs(Math.sin(t))*0.2) + ')'); grd.addColorStop(1,'rgba(255,45,149,' + (0.12 + Math.abs(Math.cos(t))*0.12) + ')'); ctx.fillStyle = grd; ctx.fillRect(0,0,canvas.width,canvas.height); requestAnimationFrame(draw); } draw(); }
})();
