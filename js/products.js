/* products.js - sample product data and render helpers */
const PRODUCTS = [
  {id:201,title:'BDD Luxe Runner',price:189.00,category:'mens',desc:'Performance runner with premium knit and signature sole.',img:'../images/prod1.svg',colors:['Black','Ivory'],sizes:['7','8','9','10','11']},
  {id:202,title:'Heritage Trench Coat',price:399.00,category:'womens',desc:'Tailored stormproof trench with classic cut.',img:'../images/prod2.svg',colors:['Camel','Black'],sizes:['S','M','L']},
  {id:203,title:'Monogram Leather Bag',price:749.00,category:'accessories',desc:'Limited edition leather tote with embossed BDD monogram.',img:'../images/prod3.svg',colors:['Tan'],sizes:[]},
  {id:204,title:'Playfair Knit Sweater',price:129.00,category:'womens',desc:'Soft knit with dropped shoulder and refined hem.',img:'../images/prod4.svg',colors:['Ivory','Charcoal'],sizes:['S','M','L']},
  {id:205,title:'Classic Tee (Premium)',price:49.00,category:'mens',desc:'Pima cotton tee with subtle logo.',img:'../images/prod5.svg',colors:['White','Black'],sizes:['S','M','L','XL']},
  {id:206,title:'Gold Accent Cap',price:59.00,category:'accessories',desc:'Adjustable cap with gold hardware.',img:'../images/prod6.svg',colors:['Black'],sizes:[]},
  {id:207,title:'Everyday Denim',price:159.00,category:'mens',desc:'Japanese selvedge denim with refined fit.',img:'../images/prod7.svg',colors:['Indigo'],sizes:['30','32','34','36']},
  {id:208,title:'Silk Scarf',price:89.00,category:'accessories',desc:'Hand-rolled silk scarf with printed motif.',img:'../images/prod8.svg',colors:['Cream'],sizes:[]}
];

function findProductById(id){return PRODUCTS.find(p=>p.id===Number(id));}

function renderProductCard(p){
  const el = document.createElement('article');
  el.className = 'product-card';
  el.innerHTML = `
    <div class="product-thumb">
      <img src="${p.img}" alt="${p.title}"/>
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
  list.forEach(p=>grid.appendChild(renderProductCard(p)));
}

// Auto-initialize some grids if present
document.addEventListener('DOMContentLoaded', ()=>{
  if(document.getElementById('featuredGrid')){
    renderGrid('featuredGrid', PRODUCTS.slice(0,4));
  }
  if(document.getElementById('shopGrid')){
    renderGrid('shopGrid', PRODUCTS);
    // wire filters
    const cat = document.getElementById('shopCategory');
    const search = document.getElementById('shopSearch');
    if(cat) cat.addEventListener('change', ()=>filterShop());
    if(search) search.addEventListener('input', ()=>filterShop());
    function filterShop(){
      const c = cat.value; const s = search.value.trim().toLowerCase();
      const list = PRODUCTS.filter(p=> (c==='all'||p.category===c) && (!s||p.title.toLowerCase().includes(s)) );
      renderGrid('shopGrid', list);
    }
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
    document.getElementById('addToCartBtn').addEventListener('click', ()=>{
      addToCart(p.id); alert('Added to cart');
    });
  }

  // Global handlers: quick view, wishlist, add-to-cart
  document.addEventListener('click', e=>{
    const q = e.target.closest('.quick-view'); if(q){ const id=q.dataset.id; openQuickView(id); }
    const w = e.target.closest('.wish-btn'); if(w){ toggleWish(w.dataset.id); }
    const atc = e.target.closest('.add-to-cart'); if(atc){ addToCartAnimated(atc.dataset.id); }
  });

  function openQuickView(id){ const p = findProductById(id); const modal = document.createElement('div'); modal.className='quick-modal'; modal.innerHTML=`<div class='box'><h3>${p.title}</h3><img src='${p.img}' style='max-width:280px'/><p>${p.desc}</p><div style="display:flex;gap:.5rem;margin-top:.5rem"><button class='btn-cta' onclick="addToCartAnimated(${p.id})">Add to cart</button><button onclick='this.closest(".quick-modal").remove()' class='btn-link'>Close</button></div></div>`; document.body.appendChild(modal); }
});
