const API = 'https://play-code-api.onrender.com';

const modal = document.getElementById('modal');
const openModal = document.getElementById('openModal');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');

const stages = document.querySelectorAll('.stage');
const steps = document.querySelectorAll('.step');

let currentStage = 0;

openModal.onclick = () => {
  modal.classList.remove('hidden');
};

prevBtn.onclick = () => {
  if (currentStage > 0) {
    currentStage--;
    updateStages();
  }
};

nextBtn.onclick = async () => {
  if (currentStage < stages.length - 1) {
    currentStage++;
    updateStages();
  } else {
    await submitProduct();
    modal.classList.add('hidden');
    currentStage = 0;
    updateStages();
    loadProducts();
  }
};

function updateStages() {
  stages.forEach((s, i) => s.classList.toggle('active', i === currentStage));
  steps.forEach((s, i) => s.classList.toggle('active', i <= currentStage));
}

async function submitProduct() {
  const formData = new FormData();
  formData.append('category', document.getElementById('category').value);
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('image', document.getElementById('image').files[0]);

  await fetch(`${API}/products`, {
    method: 'POST',
    body: formData
  });
}

/* ТОВАРЫ */

const productsDiv = document.getElementById('products');
const categoryFilter = document.getElementById('categoryFilter');
let allProducts = [];

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  allProducts = await res.json();
  renderProducts(allProducts);
}

function renderProducts(products) {
  productsDiv.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <div class="badge">${p.category}</div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price} ₽</div>
      <button>Купить</button>
    `;
    productsDiv.appendChild(div);
  });
}

categoryFilter.onchange = () => {
  const v = categoryFilter.value;
  renderProducts(v === 'all' ? allProducts : allProducts.filter(p => p.category === v));
};

loadProducts();
