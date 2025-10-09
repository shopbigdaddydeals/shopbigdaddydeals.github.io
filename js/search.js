// search.js - live search across products
(function(){
  function normalize(s){return (s||'').toString().toLowerCase();}

  function matchProduct(p, q){
    q = normalize(q);
    return normalize(p.title).includes(q) || normalize(p.desc).includes(q) || normalize(p.category).includes(q);
  }

  const headerInput = document.getElementById('headerSearch');
  const shopInput = document.getElementById('shopSearch');

  function onSearch(e){
    const q = e.target.value || '';
    // if on shop page we call reloadShop via filtering
    if(typeof reloadShop === 'function'){
      // update the shop search input value if triggered from header
      if(shopInput) shopInput.value = q;
      // trigger shop reload (products.js reads shopSearch)
      reloadShop();
    } else {
      // fallback: filter featured grid on homepage
      const grid = document.getElementById('featuredGrid'); if(!grid) return;
      grid.querySelectorAll('.product-card').forEach(card=>{
        const title = card.querySelector('.product-title')?.textContent || '';
        const desc = card.querySelector('.muted')?.textContent || '';
        const match = title.toLowerCase().includes(q.toLowerCase()) || desc.toLowerCase().includes(q.toLowerCase());
        card.style.display = match || q.trim()==='' ? '' : 'none';
      });
    }
  }

  if(headerInput) headerInput.addEventListener('input', onSearch);
  if(shopInput) shopInput.addEventListener('input', onSearch);
})();
