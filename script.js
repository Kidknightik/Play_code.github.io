const API = 'https://play-code-api.onrender.com';

const productsDiv = document.getElementById('products');
const addBtn = document.getElementById('addBtn');

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();

  productsDiv.innerHTML = '';

  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    div.innerHTML = `
      <img src="${API}${p.image}">
      <div class="product-info">
        <h3>${p.title}</h3>
        <p>${p.price} ₽</p>
      </div>
    `;

    productsDiv.appendChild(div);
  });
}

addBtn.onclick = async () => {
  const title = document.getElementById('title').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').files[0];

  if (!title || !price || !image) {
    alert('Заполни все поля');
    return;
  }

  const formData = new FormData();
  formData.append('title', title);
  formData.append('price', price);
  formData.append('image', image);

  await fetch(`${API}/products`, {
    method: 'POST',
    body: formData
  });

  loadProducts();
};

loadProducts();
