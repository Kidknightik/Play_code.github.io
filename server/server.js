import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  {
    id: 1,
    title: "iPhone 15",
    price: 1200,
    category: "phones",
    image: "https://via.placeholder.com/300x200?text=iPhone+15"
  },
  {
    id: 2,
    title: "Samsung Galaxy S24",
    price: 1100,
    category: "phones",
    image: "https://via.placeholder.com/300x200?text=Galaxy+S24"
  },
  {
    id: 3,
    title: "MacBook Pro 14",
    price: 2500,
    category: "laptops",
    image: "https://via.placeholder.com/300x200?text=MacBook+Pro"
  }
];

// получить все товары
app.get("/products", (req, res) => {
  res.json(products);
});

// получить товар по id
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
