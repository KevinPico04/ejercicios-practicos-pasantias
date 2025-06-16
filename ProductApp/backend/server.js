require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
app.use(cors());
app.use(express.json());

// Para servir imágenes subidas
app.use('/uploads', express.static('uploads'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB conectado');
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  })
  .catch(err => console.log(err));
