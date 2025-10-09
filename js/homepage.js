// homepage.js - logic for country picker, slogan behavior, and model photo reveals
document.addEventListener('DOMContentLoaded', ()=>{
  const countryPicker = document.getElementById('countryPicker');
  const countrySelect = document.getElementById('countrySelect');
  const countryConfirm = document.getElementById('countryConfirm');
  const sloganWrap = document.getElementById('sloganWrap');
  const slogan = document.getElementById('brandSlogan');

  // restore selection
  const saved = localStorage.getItem('bdd_country');
  if(saved){ countryPicker.style.display='none'; showSlogan(); setFooterFlag(JSON.parse(saved)); }

  countryConfirm.addEventListener('click', ()=>{
    const val = countrySelect.value; const opt = countrySelect.options[countrySelect.selectedIndex];
    const flag = opt.dataset.flag || '';
    const data = {code:val,name:opt.text,flag};
    localStorage.setItem('bdd_country', JSON.stringify(data));
    // fade out picker then show slogan
    countryPicker.style.transition='opacity .45s ease'; countryPicker.style.opacity=0; setTimeout(()=>{ countryPicker.style.display='none'; showSlogan(); },420);
    setFooterFlag(data);
  });

  let sloganAnimated = false;
  function showSlogan(){ sloganWrap.setAttribute('aria-hidden','false'); sloganWrap.classList.add('visible');
    // trigger the entrance animation once for the slogan h1
    if(slogan && !sloganAnimated){ slogan.classList.add('slogan-animate'); sloganAnimated = true; }
    // After a short delay, enable scroll fade (fade out when scrolled)
    setTimeout(()=>{ window.addEventListener('scroll', sloganFadeOnScroll); }, 800);
  }

  function sloganFadeOnScroll(){ const rect = sloganWrap.getBoundingClientRect(); if(rect.bottom < 60){ sloganWrap.classList.remove('visible'); window.removeEventListener('scroll', sloganFadeOnScroll); } }


  // Model photos section
  const modelsSection = document.createElement('section'); modelsSection.className='models';
  const mg = document.createElement('div'); mg.className='models-grid container';
  for(let i=1;i<=6;i++){ const it=document.createElement('div'); it.className='model-item'; const img=document.createElement('img'); img.className='lazy'; img.dataset.src='/images/prod'+((i%8)+1)+'.svg'; img.alt='Model '+i; it.appendChild(img); const cap=document.createElement('div'); cap.className='model-caption'; cap.textContent = 'Model '+i; it.appendChild(cap); mg.appendChild(it);} modelsSection.appendChild(mg);
  document.querySelector('body').insertBefore(modelsSection, document.querySelector('#newsletter'));

  // Intersection observer for models and slogan to add reveal class
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('visible');
      }
    })
  },{threshold:0.18});
  document.querySelectorAll('.model-item,.slogan-wrap').forEach(el=>io.observe(el));

  // footer flag helper
  function setFooterFlag(data){ const existing = document.querySelector('.footer-flag'); if(existing) existing.remove(); const f = document.createElement('div'); f.className='footer-flag'; f.textContent = data.name + ' ' + (data.flag||''); document.body.appendChild(f); }

  // Photo slideshow initialization
  (function initSlideshow(){
    const wrap = document.getElementById('photoSlideshow'); if(!wrap) return;
    const slides = Array.from(wrap.querySelectorAll('.slide'));
    let idx = slides.findIndex(s=>s.classList.contains('active')); if(idx<0) idx=0; let interval = null; const delay = 3500;

    function goTo(n){ slides.forEach((s,i)=>{ s.classList.toggle('active', i===n); }); idx = n; }
    function next(){ goTo((idx+1) % slides.length); }
    function prev(){ goTo((idx-1+slides.length) % slides.length); }

    // controls
    const prevBtn = wrap.querySelector('.prev'); const nextBtn = wrap.querySelector('.next');
    if(prevBtn) prevBtn.addEventListener('click', ()=>{ pause(); prev(); restart(); });
    if(nextBtn) nextBtn.addEventListener('click', ()=>{ pause(); next(); restart(); });

    function start(){ interval = setInterval(next, delay); }
    function pause(){ if(interval){ clearInterval(interval); interval=null; } }
    function restart(){ pause(); start(); }

    // pause on hover/focus for accessibility
    wrap.addEventListener('mouseenter', pause); wrap.addEventListener('mouseleave', restart);
    wrap.addEventListener('focusin', pause); wrap.addEventListener('focusout', restart);

    // start
    start();
  })();

});
