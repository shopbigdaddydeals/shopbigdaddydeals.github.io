/* products.js - sample product data and render helpers */
const PRODUCTS = [
  {id:101,title:'Wireless Headphones',price:79.99,category:'electronics',desc:'Comfortable, long battery life',img:'../images/prod1.svg'},
  {id:102,title:'Smart Watch',price:129.99,category:'electronics',desc:'Track activity & notifications',img:'../images/prod2.svg'},
  {id:103,title:'Copper Kettle',price:34.99,category:'home',desc:'Fast boiling stainless steel',img:'../images/prod3.svg'},
  {id:104,title:'Memory Foam Pillow',price:24.99,category:'home',desc:'Sleep better with memory foam',img:'../images/prod4.svg'},
  {id:105,title:'Classic Tee',price:19.99,category:'fashion',desc:'Soft cotton, multiple colors',img:'../images/prod5.svg'},
  {id:106,title:'Running Sneakers',price:69.99,category:'fashion',desc:'Lightweight and durable',img:'../images/prod6.svg'},
  {id:107,title:'Puzzle Set',price:14.99,category:'toys',desc:'Family fun puzzle',img:'../images/prod7.svg'},
  {id:108,title:'Blocks Set',price:29.99,category:'toys',desc:'Creative building blocks',img:'../images/prod8.svg'}
];

function findProductById(id){return PRODUCTS.find(p=>p.id===Number(id));}

function renderProductCard(p){
  const el = document.createElement('article');
  el.className = 'product-card';
  el.innerHTML = `
    <div class="product-thumb"><img src="${p.img}" alt="${p.title}"/></div>
    <h3 class="product-title">${p.title}</h3>
    <div class="product-price">$${p.price.toFixed(2)}</div>
    <p class="muted">${p.desc}</p>
    <div class="product-actions">
      <button class="btn-cta add-to-cart" data-id="${p.id}">Add to cart</button>
      <a class="btn-link" href="product.html?id=${p.id}">View</a>
    </div>
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
});
