const API_URL = "https://play-code-api.onrender.com/products";

fetch(API_URL)
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("products");

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Цена: ${product.price} $</p>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));
