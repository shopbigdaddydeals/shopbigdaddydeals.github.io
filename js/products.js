/* products.js - sample product data and render helpers */
const PRODUCTS = [
  {id:201,title:'BDD Luxe Runner',price:189.00,category:'mens',desc:'Performance runner with premium knit and signature sole.',img:'/images/prod1.svg',colors:['Black','Ivory'],sizes:['7','8','9','10','11']},
  {id:202,title:'Heritage Trench Coat',price:399.00,category:'womens',desc:'Tailored stormproof trench with classic cut.',img:'/images/prod2.svg',colors:['Camel','Black'],sizes:['S','M','L']},
  {id:203,title:'Monogram Leather Bag',price:749.00,category:'accessories',desc:'Limited edition leather tote with embossed BDD monogram.',img:'/images/prod3.svg',colors:['Tan'],sizes:[]},
  {id:204,title:'Playfair Knit Sweater',price:129.00,category:'womens',desc:'Soft knit with dropped shoulder and refined hem.',img:'/images/prod4.svg',colors:['Ivory','Charcoal'],sizes:['S','M','L']},
  {id:205,title:'Classic Tee (Premium)',price:49.00,category:'mens',desc:'Pima cotton tee with subtle logo.',img:'/images/prod5.svg',colors:['White','Black'],sizes:['S','M','L','XL']},
  {id:206,title:'Gold Accent Cap',price:59.00,category:'accessories',desc:'Adjustable cap with gold hardware.',img:'/images/prod6.svg',colors:['Black'],sizes:[]},
  {id:207,title:'Everyday Denim',price:159.00,category:'mens',desc:'Japanese selvedge denim with refined fit.',img:'/images/prod7.svg',colors:['Indigo'],sizes:['30','32','34','36']},
  {id:208,title:'Silk Scarf',price:89.00,category:'accessories',desc:'Hand-rolled silk scarf with printed motif.',img:'/images/prod8.svg',colors:['Cream'],sizes:[]}
];

function findProductById(id){return PRODUCTS.find(p=>p.id===Number(id));}

function renderProductCard(p){
  const el = document.createElement('article');
  el.className = 'product-card';
  el.innerHTML = `
    <div class="product-thumb">
      <img class="lazy" data-src="${p.img}" alt="${p.title}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" />
      <div class="actions-overlay overlay">
        <button class="quick-view" data-id="${p.id}">Quick View</button>
        <button class="wish-btn" data-id="${p.id}">♡</button>
        <button class="add-to-cart" data-id="${p.id}">Add</button>
      </div>
    </div>
    <h3 class="product-title">${p.title}</h3>
    <div class="product-price">$${p.price.toFixed(2)}</div>
    <p class="muted">${p.desc}</p>
  `;
  return el;
}

function renderGrid(targetId, list){
  const grid = document.getElementById(targetId);
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach(p=>{
    const item = renderProductCard(p);
    item.classList.add('masonry-item');
    grid.appendChild(item);
  });
}

// Auto-initialize some grids if present
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('featuredGrid')){
    renderGrid('featuredGrid', PRODUCTS.slice(0,4));
  }
  if(document.getElementById('shopGrid')){
    // Pagination / Load More
    const perPage = 4; let page = 0;
    const gridId = 'shopGrid';
    function currentList(){
      const c = document.getElementById('shopCategory').value || 'all';
      const s = (document.getElementById('shopSearch').value||'').trim().toLowerCase();
      return PRODUCTS.filter(p=> (c==='all'||p.category===c) && (!s||p.title.toLowerCase().includes(s)) );
    }
    function renderPage(reset){
      const all = currentList();
      if(reset){ page=0; document.getElementById(gridId).innerHTML=''; }
      const slice = all.slice(page*perPage, (page+1)*perPage);
      slice.forEach(p=>{ const el = renderProductCard(p); el.classList.add('masonry-item'); document.getElementById(gridId).appendChild(el); });
      // GSAP stagger reveal if available
      if(window.gsap){ gsap.from(document.querySelectorAll('#'+gridId+' .masonry-item'),{opacity:0,y:20,duration:0.6,stagger:0.08}); }
      page++;
      // hide load more if no more
      const moreBtn = document.getElementById('loadMoreBtn'); if(moreBtn) moreBtn.style.display = (page*perPage < all.length) ? 'inline-block' : 'none';
    }
    renderPage(true);
    // wire filters and load more
    document.getElementById('shopCategory').addEventListener('change', ()=>renderPage(true));
    document.getElementById('shopSearch').addEventListener('input', ()=>renderPage(true));
    document.getElementById('loadMoreBtn').addEventListener('click', ()=>renderPage(false));
    // Infinite scroll: load next page when near bottom
    let loadingNext = false;
    function checkScroll(){ if(loadingNext) return; const rect = document.getElementById(gridId).getBoundingClientRect(); if(rect.bottom - window.innerHeight < 300){ const all = currentList(); if(page*perPage < all.length){ loadingNext=true; setTimeout(()=>{ renderPage(false); loadingNext=false; }, 300); } } }
    window.addEventListener('scroll', checkScroll);
    // expose to global for testing
    window.reloadShop = ()=>renderPage(true);
  }

  // product detail page population
  if(document.getElementById('pdTitle')){
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const p = findProductById(id) || PRODUCTS[0];
    document.getElementById('pdTitle').textContent = p.title;
    document.getElementById('pdDesc').textContent = p.desc;
    document.getElementById('pdPrice').textContent = '$'+p.price.toFixed(2);
    const img = document.getElementById('pdImage'); if(img) img.src = p.img;
    // thumbs
    const thumbs = document.getElementById('pdThumbs'); if(thumbs){ p.images = p.images || [p.img]; p.images.forEach(src=>{ const t=document.createElement('img'); t.src=src; t.addEventListener('click', ()=>{ document.getElementById('pdImage').src = src; }); thumbs.appendChild(t); }); }

    // sizes
    const sizesWrap = document.getElementById('pdSizes'); if(sizesWrap){ (p.sizes||[]).forEach(s=>{ const b=document.createElement('button'); b.textContent=s; b.addEventListener('click', ()=>{ document.querySelectorAll('#pdSizes button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); }); sizesWrap.appendChild(b); }); }

    // colors
    const colorsWrap = document.getElementById('pdColors'); if(colorsWrap){ (p.colors||[]).forEach(c=>{ const b=document.createElement('button'); b.textContent=c; b.addEventListener('click', ()=>{ document.querySelectorAll('#pdColors button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); }); colorsWrap.appendChild(b); }); }

    document.getElementById('addToCartBtn').addEventListener('click', ()=>{
      // collect selected options
      const selectedSize = document.querySelector('#pdSizes button.active')?.textContent || null;
      const selectedColor = document.querySelector('#pdColors button.active')?.textContent || null;
      // fly to cart animation if gsap is available
      const imgEl = document.getElementById('pdImage');
      if(window.gsap && imgEl){
        const flyer = imgEl.cloneNode(); flyer.style.position='fixed'; flyer.style.left = imgEl.getBoundingClientRect().left+'px'; flyer.style.top = imgEl.getBoundingClientRect().top+'px'; flyer.style.width = imgEl.offsetWidth+'px'; flyer.style.zIndex=9999; document.body.appendChild(flyer);
        gsap.to(flyer,{duration:0.9,x:window.innerWidth-80 - imgEl.getBoundingClientRect().left, y: -imgEl.getBoundingClientRect().top + 20, scale:0.18, opacity:0.8, ease:'power2.in', onComplete:()=>{ flyer.remove(); addToCartAnimated(p.id,1, {size:selectedSize,color:selectedColor}); }});
      } else { addToCart(p.id); alert('Added to cart'); }
    });
    // simple zoom lens hover
    const imgEl2 = document.getElementById('pdImage'); const lens = document.getElementById('zoomLens');
    if(imgEl2 && lens){ imgEl2.addEventListener('mousemove', function(e){ lens.style.display='block'; const rect = imgEl2.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; lens.style.left = (x - lens.offsetWidth/2) + 'px'; lens.style.top = (y - lens.offsetHeight/2) + 'px'; }); imgEl2.addEventListener('mouseleave', ()=>{ lens.style.display='none'; }); }
  }

  // Global handlers: quick view, wishlist, add-to-cart
  document.addEventListener('click', e=>{
    const q = e.target.closest('.quick-view'); if(q){ const id=q.dataset.id; openQuickView(id); }
    const w = e.target.closest('.wish-btn'); if(w){ toggleWish(w.dataset.id); }
    const atc = e.target.closest('.add-to-cart'); if(atc){ addToCartAnimated(atc.dataset.id); }
  });

  function openQuickView(id){ const p = findProductById(id); const modal = document.createElement('div'); modal.className='quick-modal'; modal.innerHTML=`<div class='box'><h3>${p.title}</h3><img src='${p.img}' style='max-width:280px'/><p>${p.desc}</p><div style="display:flex;gap:.5rem;margin-top:.5rem"><button class='btn-cta' onclick="addToCartAnimated(${p.id})">Add to cart</button><button onclick='this.closest(".quick-modal").remove()' class='btn-link'>Close</button></div></div>`; document.body.appendChild(modal); }
});
