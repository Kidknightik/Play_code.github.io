const API = 'https://play-code-api.onrender.com';

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

categoryFilter.addEventListener('change', () => {
  const value = categoryFilter.value;

  if (value === 'all') {
    renderProducts(allProducts);
  } else {
    renderProducts(allProducts.filter(p => p.category === value));
  }
});

loadProducts();
