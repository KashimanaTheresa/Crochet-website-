// Simple static prototype interactions and sample data
const sampleAddresses = [
  {id:1,name:'Jane Doe',phone:'+234800000000',street:'12 Broad St',city:'Lagos',state:'Lagos',postal:'100001',country:'Nigeria',default:true},
  {id:2,name:'John Smith',phone:'+234700011122',street:'34 Palm Ave',city:'Abuja',state:'FCT',postal:'900002',country:'Nigeria',default:false}
];
const sampleCart = [
  {id:101,title:'Crochet Shrug',qty:1,price:10000,img:'img/f2fd45f943b312deaa1697fd94fe6a9a[1].jpg'},
  {id:102,title:'Beach Set',qty:2,price:7000,img:'img/b331e40c8aa36f50732b95a88eb8dab8.jpg'}
];
const CART_KEY = 'crochetCart';
const sampleOrders = [
  {id:'ORD-1001',date:'2026-05-01',status:'delivered',total:17000},
  {id:'ORD-1002',date:'2026-05-28',status:'shipped',total:10000},
  {id:'ORD-1003',date:'2026-06-02',status:'pending',total:7000}
];

function loadCart(){
  const stored = localStorage.getItem(CART_KEY);
  if(stored){
    try{ return JSON.parse(stored);}catch(e){ }
  }
  return sampleCart.slice();
}

function saveCart(data){
  localStorage.setItem(CART_KEY, JSON.stringify(data));
  return data;
}

let cart = loadCart();

function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

function renderProfileHeader(){
  const name = localStorage.getItem('loggedInUser') || 'Guest';
  const profileDisplayName = $('#profileDisplayName');
  if(profileDisplayName) profileDisplayName.textContent = name;
  const credit = localStorage.getItem('cbkCredit') || '0';
  const creditBalance = $('#creditBalance');
  if(creditBalance) creditBalance.textContent = `₦${Number(credit).toLocaleString()}`;
  const overviewCredit = $('#overviewCredit');
  if(overviewCredit) overviewCredit.textContent = `₦${Number(credit).toLocaleString()}`;
}

function renderAddresses(){
  const container = $('#addressesList');
  if(!container) return;
  container.innerHTML='';
  sampleAddresses.forEach(a=>{
    const col = document.createElement('div'); col.className='col-md-6';
    col.innerHTML = `<div class="address-card">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${a.name}</strong><div class="small text-muted">${a.phone}</div>
          <div class="mt-2">${a.street}, ${a.city}, ${a.state} ${a.postal}, ${a.country}</div>
        </div>
        <div class="text-end">
          ${a.default?'<span class="badge bg-success">Default</span>':''}
          <div class="mt-2">
            <button class="btn btn-sm btn-link set-default" data-id="${a.id}">Set default</button>
            <button class="btn btn-sm btn-link edit-address" data-id="${a.id}">Edit</button>
            <button class="btn btn-sm btn-link text-danger delete-address" data-id="${a.id}">Delete</button>
          </div>
        </div>
      </div>
    </div>`;
    container.appendChild(col);
  });
}

function renderDefaultAddress(){
  const def = sampleAddresses.find(a=>a.default);
  const defaultAddressEl = $('#defaultAddress');
  if(defaultAddressEl){
    defaultAddressEl.textContent = def?`${def.name} • ${def.street}, ${def.city}, ${def.state} ${def.postal}, ${def.country}`:'No default address set.';
  }
}

function getCartCount(){
  return cart.reduce((sum,item)=>sum+item.qty,0);
}

function renderMiniCart(){
  const el = $('#miniCart'); if(!el) return;
  el.innerHTML='';
  cart.forEach(item=>{
    const line = document.createElement('div'); line.className='line';
    line.innerHTML = `<img src="${item.img}" alt=""><div class="flex-grow-1"><div>${item.title}</div><div class="small text-muted">Qty ${item.qty} • ₦${item.price.toLocaleString()}</div></div><div class="fw-bold">₦${(item.qty*item.price).toLocaleString()}</div>`;
    el.appendChild(line);
  });
  const cartCountEl = $('#cartCount'); if(cartCountEl) cartCountEl.textContent = getCartCount();
}

function renderCartItems(){
  const el = $('#cartItems'); if(!el) return;
  el.innerHTML='';
  cart.forEach(item=>{
    const card = document.createElement('div'); card.className='card p-2 mb-2';
    card.innerHTML = `<div class="d-flex align-items-center gap-3"><img src="${item.img}" style="width:72px;height:72px;object-fit:cover;border-radius:8px"><div class="flex-grow-1"><div>${item.title}</div><div class="small text-muted">₦${item.price.toLocaleString()}</div></div><div><input type="number" min="1" value="${item.qty}" class="form-control form-control-sm qty" data-id="${item.id}" style="width:72px"></div></div>`;
    el.appendChild(card);
  });
}

function addToCart(product){
  const existing = cart.find(item=>item.id===product.id);
  if(existing){
    existing.qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  saveCart(cart);
  renderMiniCart();
  renderCartItems();
}

function renderOrders(filter='all'){
  const el = $('#ordersList'); if(!el) return;
  el.innerHTML='';
  const list = sampleOrders.filter(o=>filter==='all'?true:o.status===filter);
  list.forEach(o=>{
    const row = document.createElement('div'); row.className='card p-2 mb-2';
    const badgeClass = o.status==='pending'?'badge-pending':o.status==='shipped'?'badge-shipped':'badge-delivered';
    row.innerHTML = `<div class="d-flex justify-content-between align-items-center">
      <div><strong>${o.id}</strong><div class="small text-muted">${o.date}</div></div>
      <div class="text-end"><span class="badge-status ${badgeClass}">${o.status.toUpperCase()}</span><div class="mt-2 fw-bold">₦${o.total.toLocaleString()}</div><a href="#" class="d-block small mt-1">View details</a></div>
    </div>`;
    el.appendChild(row);
  });
}

// wiring
document.addEventListener('DOMContentLoaded',()=>{
  renderProfileHeader(); renderAddresses(); renderDefaultAddress(); renderMiniCart(); renderCartItems(); renderOrders();

  // tab nav
  $all('.profile-nav .nav-link').forEach(a=>{
    a.addEventListener('click',e=>{
      e.preventDefault(); $all('.profile-nav .nav-link').forEach(x=>x.classList.remove('active'));
      a.classList.add('active'); const tab=a.dataset.tab; $all('.profile-tab').forEach(t=>t.classList.add('d-none'));
      document.getElementById(tab).classList.remove('d-none');
    });
  });

  // add address (simple prompt-driven for prototype)
  const addAddressBtn = $('#addAddress');
  if(addAddressBtn){
    addAddressBtn.addEventListener('click',()=>{
      const name = prompt('Full name'); if(!name) return;
      const street = prompt('Street address'); if(!street) return;
      const city = prompt('City'); if(!city) return;
      const state = prompt('State/Province')||''; const postal = prompt('Postal code')||''; const country = prompt('Country')||'Nigeria';
      const id = Date.now(); sampleAddresses.push({id,name,phone:'',street,city,state,postal,country,default:false}); renderAddresses();
    });
  }

  // set default via delegation
  document.addEventListener('click', (e)=>{
    if(e.target.classList.contains('set-default')){
      const id=Number(e.target.dataset.id);
      sampleAddresses.forEach(a=>a.default = a.id===id); renderAddresses(); renderDefaultAddress();
    }
    if(e.target.classList.contains('delete-address')){
      const id=Number(e.target.dataset.id);
      if(confirm('Delete this address?')){ const idx=sampleAddresses.findIndex(a=>a.id===id); if(idx>-1) sampleAddresses.splice(idx,1); renderAddresses(); renderDefaultAddress(); }
    }
    if(e.target.classList.contains('edit-address')){
      const id=Number(e.target.dataset.id); const a=sampleAddresses.find(x=>x.id===id); if(!a) return;
      const name = prompt('Full name',a.name); if(!name) return; a.name=name; a.street=prompt('Street',a.street)||a.street; a.city=prompt('City',a.city)||a.city; renderAddresses(); renderDefaultAddress();
    }
  });

  // order filter
  const ordersFilter = $('#ordersFilter');
  if(ordersFilter){
    ordersFilter.addEventListener('change',()=>renderOrders(ordersFilter.value));
  }

  // quantity change
  document.addEventListener('change',(e)=>{
    if(e.target.classList.contains('qty')){
      const id = Number(e.target.dataset.id); const val = Number(e.target.value); const item = cart.find(i=>i.id===id); if(item){item.qty = Math.max(1,val); saveCart(cart); renderMiniCart(); renderCartItems();}
    }
  });

  document.addEventListener('click', e => {
    const button = e.target.closest('.add-cart');
    if(button){
      e.preventDefault();
      const product = {
        id: Number(button.dataset.id) || Date.now(),
        title: button.dataset.title || button.dataset.name || 'Item',
        price: Number(button.dataset.price) || 0,
        img: button.dataset.img || ''
      };
      addToCart(product);
      const originalText = button.textContent;
      button.textContent = 'Added';
      setTimeout(()=>{
        if(document.body.contains(button)) button.textContent = originalText;
      }, 1000);
    }
  });

  const checkoutBtn = $('#checkoutBtn'); if(checkoutBtn) checkoutBtn.addEventListener('click',()=>alert('Proceeding to checkout (prototype)'));
  const goCheckout = $('#goCheckout'); if(goCheckout) goCheckout.addEventListener('click',()=>alert('Proceeding to checkout (prototype)'));

});
