const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware para proteger rutas
router.use(authMiddleware);

// Crear producto
router.post('/', async (req, res) => {
  const { name, price, imageUrl } = req.body;
  if (!name || price == null) return res.status(400).json({ message: 'Faltan datos' });

  try {
    const product = new Product({
      user: req.userId,
      name,
      price,
      imageUrl: imageUrl || '',
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
});

// Obtener todos los productos del usuario autenticado
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Actualizar producto (solo del usuario)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, imageUrl } = req.body;

  try {
    const product = await Product.findOne({ _id: id, user: req.userId });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar producto' });
  }
});

// Eliminar producto (solo del usuario)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndDelete({ _id: id, user: req.userId });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
});

module.exports = router;
