const API = 'https://play-code-api.onrender.com';

const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progressBar');

const stages = document.querySelectorAll('.stage');
let step = 0;

openModal.onclick = () => modal.classList.remove('hidden');

prevBtn.onclick = () => {
  if (step > 0) step--;
  update();
};

nextBtn.onclick = async () => {
  if (step < stages.length - 1) {
    step++;
    update();
  } else {
    await submit();
    modal.classList.add('hidden');
    step = 0;
    update();
    loadProducts();
  }
};

function update() {
  stages.forEach((s, i) => s.classList.toggle('active', i === step));
  progressBar.style.width = `${(step + 1) * 25}%`;
}

async function submit() {
  const fd = new FormData();
  fd.append('category', category.value);
  fd.append('title', title.value);
  fd.append('description', description.value);
  fd.append('price', price.value);
  fd.append('image', image.files[0]);

  await fetch(`${API}/products`, { method: 'POST', body: fd });
}

/* PRODUCTS */

const productsDiv = document.getElementById('products');
const categoryFilter = document.getElementById('categoryFilter');
let allProducts = [];

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  allProducts = await res.json();
  render(allProducts);
}

function render(list) {
  productsDiv.innerHTML = '';
  list.forEach(p => {
    const d = document.createElement('div');
    d.className = 'product';
    d.innerHTML = `
      <span class="badge">${p.category}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price} ₽</div>
      <button class="primary-btn">Купить</button>
    `;
    productsDiv.appendChild(d);
  });
}

categoryFilter.onchange = () => {
  const v = categoryFilter.value;
  render(v === 'all' ? allProducts : allProducts.filter(p => p.category === v));
};

loadProducts();
