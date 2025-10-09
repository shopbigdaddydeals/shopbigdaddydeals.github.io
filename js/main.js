/* main.js - UI interactions and small enhancements */
document.addEventListener('DOMContentLoaded', ()=>{
  // Preloader
  const pre = document.getElementById('preloader'); if(pre) setTimeout(()=>pre.style.display='none',600);

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
});
