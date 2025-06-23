// routes/products.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product'); // Importar el modelo de Producto
const router = express.Router();

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products'); // Carpeta donde se almacenan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para agregar un nuevo producto
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description, userId } = req.body; // userId se recibe del formData
    const image = req.file; // La imagen subida estará en req.file

    if (!name || !description || !userId || !image) {
      return res.status(400).json({ message: 'Por favor completa todos los campos y sube una imagen.' });
    }

    // Crear un nuevo producto
    const newProduct = new Product({
      name,
      description,
      image: image.path, // Guardamos la ruta de la imagen en la base de datos
      user: userId, // Asociamos el producto con el userId recibido
    });

    // Guardar el producto en la base de datos
    await newProduct.save();

    // Retornar la respuesta al cliente con la URL completa de la imagen
    res.status(201).json({
      message: 'Producto creado correctamente',
      product: {
        _id: newProduct._id,
        name: newProduct.name,
        description: newProduct.description,
        // ¡Importante! Aquí debes usar la IP de tu servidor backend real si no es localhost
        image: `http://192.168.100.198:4000/${newProduct.image}`,
      }
    });

  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// Ruta para obtener los productos de un usuario específico
// ¡IMPORTANTE! Asegúrate de que esta ruta esté protegida por tu middleware de autenticación en server.js
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId; // Obtener el ID del usuario de los parámetros de la URL

    // Obtener los productos solo del usuario especificado
    const products = await Product.find({ user: userId }); // Filtramos por el userId

    // Agregar la URL completa de la imagen para cada producto
    const productsWithFullUrl = products.map(product => {
      const productObj = product.toObject(); // Convertir a objeto JS plano
      return {
        ...productObj,
        // ¡Importante! Aquí debes usar la IP de tu servidor backend real si no es localhost
        image: `http://192.168.100.198:4000/${productObj.image}` // URL completa de la imagen
      };
    });

    res.json(productsWithFullUrl); // Devuelve la lista de productos del usuario

  } catch (err) {
    console.error('Error al obtener los productos:', err.message);
    res.status(500).send('Error interno del servidor al obtener los productos.');
  }
});

module.exports = router;