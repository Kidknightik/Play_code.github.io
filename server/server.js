import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("API is running");
});

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
  }
];

app.get("/products", (req, res) => {
  res.json(products);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
