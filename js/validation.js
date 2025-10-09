/* validation.js - simple form validation utilities */
function simpleValidate(form){
  const inputs = Array.from(form.querySelectorAll('[required]'));
  for(const inp of inputs){ if(!inp.value.trim()){ inp.focus(); return false; } }
  return true;
}

document.addEventListener('click', e=>{
  const show = e.target.closest('.show-pw');
  if(show){ const target = document.getElementById(show.dataset.target); if(target){ target.type = target.type === 'password' ? 'text' : 'password'; show.textContent = (show.textContent==='Show'?'Hide':'Show'); } }
});

document.addEventListener('submit', e=>{
  if(e.target.matches('.auth-form')||e.target.matches('#contactForm')||e.target.matches('#checkoutForm')||e.target.matches('#newsletterForm')){
    if(!simpleValidate(e.target)){ e.preventDefault(); alert('Please fill the required fields.'); }
  }
});
