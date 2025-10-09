// homepage.js - logic for country picker, slogan behavior, videos and model photo reveals
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

  function showSlogan(){ sloganWrap.setAttribute('aria-hidden','false'); sloganWrap.classList.add('visible');
    // After a short delay, enable scroll fade (fade out when scrolled)
    setTimeout(()=>{ window.addEventListener('scroll', sloganFadeOnScroll); }, 800);
  }

  function sloganFadeOnScroll(){ const rect = sloganWrap.getBoundingClientRect(); if(rect.bottom < 60){ sloganWrap.classList.remove('visible'); window.removeEventListener('scroll', sloganFadeOnScroll); } }

  // Videos placeholders: create 3 video elements (placeholders)
  const videosRoot = document.createElement('section'); videosRoot.className='videos-grid container';
  for(let i=0;i<3;i++){
    const vwrap = document.createElement('div'); vwrap.className='video-placeholder';
    const v = document.createElement('video'); v.autoplay=true; v.muted=true; v.loop=true; v.playsInline=true; v.setAttribute('aria-hidden','true'); v.setAttribute('playsinline','');
    // Use provided video for the first placeholder
    if(i===0){ const src=document.createElement('source'); src.src='/assets/videos/your-paragraph-text.mp4'; src.type='video/mp4'; v.appendChild(src); }
    vwrap.appendChild(v); videosRoot.appendChild(vwrap);
  }
  document.querySelector('body').insertBefore(videosRoot, document.querySelector('.featured'));

  // Model photos section
  const modelsSection = document.createElement('section'); modelsSection.className='models';
  const mg = document.createElement('div'); mg.className='models-grid container';
  for(let i=1;i<=6;i++){ const it=document.createElement('div'); it.className='model-item'; const img=document.createElement('img'); img.className='lazy'; img.dataset.src='/images/prod'+((i%8)+1)+'.svg'; img.alt='Model '+i; it.appendChild(img); const cap=document.createElement('div'); cap.className='model-caption'; cap.textContent = 'Model '+i; it.appendChild(cap); mg.appendChild(it);} modelsSection.appendChild(mg);
  document.querySelector('body').insertBefore(modelsSection, document.querySelector('#newsletter'));

  // Intersection observer for videos and models to add reveal class
  const io = new IntersectionObserver(entries=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); const v = en.target.querySelector('video'); if(v && !v.src){ /* placeholder - keep empty */ } } }) },{threshold:0.18});
  document.querySelectorAll('.video-placeholder,.model-item,.slogan-wrap').forEach(el=>io.observe(el));

  // footer flag helper
  function setFooterFlag(data){ const existing = document.querySelector('.footer-flag'); if(existing) existing.remove(); const f = document.createElement('div'); f.className='footer-flag'; f.textContent = data.name + ' ' + (data.flag||''); document.body.appendChild(f); }

});
