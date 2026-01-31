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

// Функция отправки товара на сервер
async function submit() {
  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;
  const price = document.getElementById('price').value;

  // Валидация обязательных полей
  if (!title || !description || !category || !price || isNaN(price) || price <= 0) {
    alert('Пожалуйста, заполните все поля корректно: название, описание, категория и цена (число > 0).');
    return;
  }

  const imageInput = document.getElementById('image');
  const imageFile = imageInput.files[0];

  // Создаем FormData для отправки файла и данных
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('category', category);
  formData.append('price', price);

  if (imageFile) {
    formData.append('image', imageFile); // Отправляем файл
  }

  try {
    const response = await fetch(`${API}/products`, {
      method: 'POST',
      body: formData, // FormData автоматически устанавливает Content-Type: multipart/form-data
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ошибка сервера: ${response.status} ${error}`);
    }

    const result = await response.json();
    console.log('Товар добавлен:', result);

    // Сброс формы
    document.querySelector('#category').form.reset();
    document.getElementById('image').value = ''; // Очистить input file
    document.querySelector('.product-image').src = ''; // Очистить превью (если бы было)

    alert('Товар успешно добавлен!');
  } catch (error) {
    console.error('Ошибка при добавлении товара:', error);
    alert('Ошибка при добавлении товара: ' + error.message);
  }
}

// Добавление превью изображения в модалке
document.getElementById('image').onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    // Создаем превью изображения (если его еще нет — добавляем)
    let preview = document.querySelector('.image-preview');
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'image-preview';
      preview.style.marginTop = '12px';
      preview.style.textAlign = 'center';
      const stage = document.querySelector('.stage:nth-child(3)'); // Изображение — третья стадия
      stage.appendChild(preview);
    }
    preview.innerHTML = `<img src="${event.target.result}" style="max-width: 100%; max-height: 150px; border-radius: 10px;" />`;
  };
  reader.readAsDataURL(file);
};

const productsDiv = document.getElementById('products');
const categoryFilter = document.getElementById('categoryFilter');
let allProducts = [];

productsDiv.addEventListener('click', (e) => {
  if (e.target.classList.contains('buy-btn')) {
    const productId = e.target.dataset.id;
    alert(`Покупка товара ${productId} (в образовательных целях!)`);
  }
});

async function loadProducts() {
  productsDiv.innerHTML = '<div class="loading">Загрузка...</div>';
  try {
    // идут работы над api сервера
    //const res = await fetch(`${API}/products`);
    //if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    res = '[{"id":1,"title":"Пополнение steam на 1000 рублей","price":1099,"category":"Steam","image":"https://via.placeholder.com/300x200?text=iPhone+15"},{"id":2,"title":"Пополнение steam на 500 рублей","price":549,"category":"Steam","image":"https://via.placeholder.com/300x200?text=Galaxy+S24"},{"id":3,"title":"Discord Nitro на 1 месяц","price":399,"category":"Discord"},{"id":4,"title":"Discord Nitro на 1 год","price":3299,"category":"Discord"},{"id":5,"title":"Youtube Premium на 1 год","price":1599,"category":"Youtube"}]'
    allProducts = await res.json();
    render(allProducts);
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error);
    productsDiv.innerHTML = '<div class="error">Не удалось загрузить товары. Попробуйте позже.</div>';
  }
}

function render(list) {
  productsDiv.innerHTML = '';
  if (list.length === 0) {
    productsDiv.innerHTML = '<div class="empty">Нет товаров в этой категории.</div>';
    return;
  }

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

// Загружаем товары при старте
loadProducts();
