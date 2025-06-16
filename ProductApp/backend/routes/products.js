const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Config multer para guardar imagenes
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Obtener productos del usuario autenticado
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Crear producto con imagen
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, price } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = new Product({
      user: req.user.id,
      name,
      price,
      imageUrl,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
