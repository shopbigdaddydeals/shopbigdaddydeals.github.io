/* main.js - UI interactions and small enhancements */
document.addEventListener('DOMContentLoaded', ()=>{
  // Preloader
  const pre = document.getElementById('preloader'); if(pre) setTimeout(()=>pre.style.display='none',700);

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
