// Simple product data (placeholder)
const PRODUCTS = [
  {id:1,title:'Wireless Headphones',price:59.99,category:'electronics'},
  {id:2,title:'Stainless Steel Kettle',price:29.95,category:'home'},
  {id:3,title:'Classic Tee (Blue)',price:14.99,category:'fashion'},
  {id:4,title:'Building Blocks Set',price:24.5,category:'toys'},
  {id:5,title:'Bluetooth Speaker',price:39.99,category:'electronics'},
  {id:6,title:'Memory Foam Pillow',price:19.99,category:'home'},
  {id:7,title:'Sneakers - Unisex',price:49.99,category:'fashion'},
  {id:8,title:'Kids Puzzle Game',price:12.99,category:'toys'}
];

// App state
let state = {
  products: PRODUCTS,
  cart: JSON.parse(localStorage.getItem('bdd_cart')||'{}')
};

function formatMoney(n){return '$'+n.toFixed(2)}

function renderProducts(filterText='', category='all'){
  const container = document.getElementById('products');
  container.innerHTML='';
  const list = state.products.filter(p=>{
    if(category!=='all' && p.category!==category) return false;
    if(!filterText) return true;
    return p.title.toLowerCase().includes(filterText.toLowerCase());
  });
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className='product-card';
    card.innerHTML = `
      <div class="product-thumb">Image</div>
      <h4 class="product-title">${p.title}</h4>
      <div class="product-meta"><span class="product-price">${formatMoney(p.price)}</span></div>
      <div class="product-actions">
        <button class="add-btn" data-id="${p.id}">Add to cart</button>
        <button class="fav-btn" aria-label="Favourite">♡</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function saveCart(){
  localStorage.setItem('bdd_cart', JSON.stringify(state.cart));
  updateCartCount();
}

function addToCart(id){
  const key = String(id);
  if(state.cart[key]) state.cart[key].qty += 1;
  else{
    const p = state.products.find(x=>x.id===id);
    state.cart[key] = {id:p.id,title:p.title,price:p.price,qty:1};
  }
  saveCart();
}

function removeFromCart(id){
  const key = String(id);
  delete state.cart[key];
  saveCart();
  renderCart();
}

function changeQty(id, delta){
  const key = String(id);
  if(!state.cart[key]) return;
  state.cart[key].qty += delta;
  if(state.cart[key].qty<=0) removeFromCart(id);
  else saveCart();
  renderCart();
}

function updateCartCount(){
  const count = Object.values(state.cart).reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent = count;
}

function renderCart(){
  const container = document.getElementById('cartItems');
  container.innerHTML='';
  const items = Object.values(state.cart);
  if(items.length===0){
    container.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cartTotal').textContent = formatMoney(0);
    updateCartCount();
    return;
  }
  let total = 0;
  items.forEach(it=>{
    total += it.price * it.qty;
    const el = document.createElement('div');
    el.className='cart-item';
    el.innerHTML = `
      <div class="cart-item-thumb">Img</div>
      <div class="cart-item-info">
        <div><strong>${it.title}</strong></div>
        <div class="muted">${formatMoney(it.price)} × ${it.qty}</div>
        <div style="margin-top:.5rem;display:flex;gap:.5rem">
          <button onclick="changeQty(${it.id},-1)">-</button>
          <button onclick="changeQty(${it.id},1)">+</button>
          <button onclick="removeFromCart(${it.id})">Remove</button>
        </div>
      </div>
    `;
    container.appendChild(el);
  });
  document.getElementById('cartTotal').textContent = formatMoney(total);
  updateCartCount();
}

function toggleCart(open){
  const el = document.getElementById('cartSidebar');
  if(open) el.classList.add('open'); else el.classList.remove('open');
  el.setAttribute('aria-hidden', String(!open));
}

function wireEvents(){
  document.addEventListener('click', e=>{
    const add = e.target.closest('.add-btn');
    if(add){
      addToCart(Number(add.dataset.id));
      renderCart();
    }
  });

  document.getElementById('cartToggle').addEventListener('click', ()=>toggleCart(true));
  document.getElementById('closeCart').addEventListener('click', ()=>toggleCart(false));
  document.getElementById('checkoutBtn').addEventListener('click', ()=>alert('Checkout placeholder — integrate your payment gateway.'));

  document.getElementById('searchInput').addEventListener('input', e=>{
    renderProducts(e.target.value, document.getElementById('categoryFilter').value);
  });

  document.getElementById('categoryFilter').addEventListener('change', e=>{
    renderProducts(document.getElementById('searchInput').value, e.target.value);
  });
}

// Expose some functions to global for inline handlers
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  renderProducts();
  wireEvents();
  renderCart();
});
