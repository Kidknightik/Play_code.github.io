import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import fs from 'fs';

const app = express();
app.use(cors());

const PRODUCTS_FILE = './products.json';
const UPLOADS_DIR = './uploads';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

if (!fs.existsSync(PRODUCTS_FILE)) {
  fs.writeFileSync(PRODUCTS_FILE, '[]');
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_, file, cb) => {
    cb(null, uuid() + '.' + file.mimetype.split('/')[1]);
  }
});

const upload = multer({ storage });

// получить товары
app.get('/products', (_, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  res.json(products);
});

// добавить товар + картинку
app.post('/products', upload.none(), (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));

  const product = {
    id: uuid(),
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category
  };

  products.push(product);
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

  res.json(product);
});


// отдача картинок
app.use('/images', express.static(UPLOADS_DIR));

app.listen(3000, () => {
  console.log('API started');
});
