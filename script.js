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
  // Validate required fields
  if (!title.value || !price.value || !category.value) {
    alert('Please fill required fields');
    return;
  }
  
  // Clear form after submit
  const form = document.querySelector('#category').form;
  form.reset();
}

// Add image preview in modal
image.onchange = function(e) {
  if (e.target.files[0]) {
    // Show image preview
    const reader = new FileReader();
    reader.onload = function(event) {
      // Create/show preview
    }
    reader.readAsDataURL(e.target.files[0]);
  }
}

/* PRODUCTS */

const productsDiv = document.getElementById('products');
const categoryFilter = document.getElementById('categoryFilter');
let allProducts = [];

// Add event delegation for buy buttons
productsDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('buy-btn')) {
    const productId = e.target.dataset.id;
    // Handle purchase logic
    alert(`Buying product ${productId}`);
  }
});

// Add loading spinner during API calls
async function loadProducts() {
  productsDiv.innerHTML = '<div class="loading">Loading...</div>';
  try {
    const res = await fetch(`${API}/products`);
    allProducts = await res.json();
    render(allProducts);
  } catch (error) {
    productsDiv.innerHTML = '<div class="error">Failed to load products</div>';
  }
}

function render(list) {
  productsDiv.innerHTML = '';
  list.forEach(p => {
    const d = document.createElement('div');
    d.className = 'product';
    d.innerHTML = `
      <img src="${p.image || 'default-image.jpg'}" alt="${p.title}" class="product-image">
      <span class="badge">${p.category}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price">${p.price} ₽</div>
      <button class="primary-btn buy-btn" data-id="${p.id}">Купить</button>
    `;
    
    productsDiv.appendChild(d);
  });
}

categoryFilter.onchange = () => {
  const v = categoryFilter.value;
  render(v === 'all' ? allProducts : allProducts.filter(p => p.category === v));
};

loadProducts();
