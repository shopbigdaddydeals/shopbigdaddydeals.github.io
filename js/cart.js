/* cart.js - simple cart stored in localStorage */
const CART_KEY = 'bdd_cart_v1';
function loadCart(){return JSON.parse(localStorage.getItem(CART_KEY)||'{}');}
function saveCart(cart){localStorage.setItem(CART_KEY, JSON.stringify(cart));}
function addToCart(id, qty=1){
  const cart = loadCart(); const key = String(id);
  if(cart[key]) cart[key].qty += qty; else{
    const p = findProductById(id);
    cart[key] = {id:p.id,title:p.title,price:p.price,qty:qty};
  }
  saveCart(cart); renderNavCount();
}
function removeFromCart(id){const cart=loadCart();delete cart[String(id)];saveCart(cart);renderCartTable();renderNavCount();}
function updateQty(id,qty){const cart=loadCart(); if(cart[String(id)]){cart[String(id)].qty=qty; if(qty<=0) delete cart[String(id)]; saveCart(cart); renderCartTable(); renderNavCount();}}
function cartTotal(){const cart=loadCart(); return Object.values(cart).reduce((s,i)=>s+i.price*i.qty,0);} 

function renderNavCount(){const count = Object.values(loadCart()).reduce((s,i)=>s+i.qty,0); const el=document.getElementById('navCartCount'); if(el) el.textContent=count;}

function renderCartTable(){const container=document.getElementById('cartTable'); if(!container) return; const cart=loadCart(); if(Object.keys(cart).length===0){container.innerHTML='<p>Your cart is empty.</p>'; document.getElementById('cartTotalAmount').textContent='$0.00'; return;} let html='<table class="cart-list"><thead><tr><th>Product</th><th>Qty</th><th>Price</th><th></th></tr></thead><tbody>'; Object.values(cart).forEach(it=>{html+=`<tr><td>${it.title}</td><td><input type="number" min="1" value="${it.qty}" data-id="${it.id}" class="cart-qty"></td><td>$${(it.price*it.qty).toFixed(2)}</td><td><button class="remove-btn" data-id="${it.id}">Remove</button></td></tr>`}); html+='</tbody></table>'; container.innerHTML=html; document.getElementById('cartTotalAmount').textContent='$'+cartTotal().toFixed(2);
  // wire qty and remove
  container.querySelectorAll('.cart-qty').forEach(inp=>inp.addEventListener('change', e=>{updateQty(e.target.dataset.id, Number(e.target.value))}));
  container.querySelectorAll('.remove-btn').forEach(btn=>btn.addEventListener('click', e=>removeFromCart(e.target.dataset.id)));
}

document.addEventListener('DOMContentLoaded', ()=>{renderNavCount(); renderCartTable();});
