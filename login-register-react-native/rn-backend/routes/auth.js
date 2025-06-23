const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importar el modelo de Usuario
const router = express.Router();

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se almacenan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ruta para registrar un nuevo usuario
router.post('/register', upload.single('image'), async (req, res) => {
  try {
    const { name, email, phone, latitude, longitude, password } = req.body;
    const image = req.file; // La imagen subida se encuentra en req.file

    console.log('--- INICIO DE REGISTRO (SIN ENCRIPTACIÓN) ---');
    console.log('Datos recibidos para registro:', { name, email, phone, latitude, longitude });
    if (!image) {
      console.log('Error: No se ha subido ninguna imagen.');
    } else {
      console.log('Imagen recibida:', image.originalname);
    }

    // Validación de los campos
    if (!name || !email || !phone || !latitude || !longitude || !password || !image) {
      console.log('Error de validación: Faltan campos obligatorios.');
      return res.status(400).json({ message: 'Por favor completa todos los campos' });
    }

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Error de validación: El correo ${email} ya está registrado.`);
      return res.status(400).json({ message: 'Este correo ya está registrado' });
    }

    // Validación de la contraseña (aún se recomienda una longitud mínima)
    if (password.length < 6) {
      console.log('Error de validación: La contraseña es demasiado corta.');
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Aquí se guarda la contraseña sin encriptar
    const plainPassword = password; // Guardar la contraseña SIN encriptar
    console.log('Contraseña sin encriptar:', plainPassword);

    // Crear un nuevo usuario
    const newUser = new User({
      name,
      email,
      phone,
      password: plainPassword,  // Guardar la contraseña SIN encriptar
      location: { latitude, longitude },
      image: image.path, // Guardar la ruta de la imagen en la base de datos
    });

    // Guardar el usuario en la base de datos
    await newUser.save();
    console.log('Usuario guardado en la base de datos con ID:', newUser._id);

    // Crear un token JWT para el usuario
    const payload = { user: { id: newUser._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 * 24 }, (err, token) => {
      if (err) {
        console.error('Error al firmar el token JWT durante el registro:', err);
        throw err;
      }
      console.log('Token JWT generado para el nuevo usuario.');
      res.status(201).json({ 
        message: 'Usuario registrado correctamente', 
        user: { _id: newUser._id, email: newUser.email, name: newUser.name }, // Envía solo datos relevantes del usuario
        token 
      });
    });

  } catch (error) {
    console.error('Error fatal al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  } finally {
    console.log('--- FIN DE REGISTRO ---');
  }
});

// Ruta para autenticar el usuario (login)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('--- INTENTO DE INICIO DE SESIÓN ---');
  console.log('Email recibido:', email);
  console.log('Contraseña recibida:', password); // PELIGROSO EN PRODUCCIÓN

  try {
    // 1. Buscar el usuario por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[LOGIN ERROR]: Usuario no encontrado para el email: ${email}`);
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    console.log(`[LOGIN INFO]: Usuario encontrado: ${user.email}`);

    // Comparar la contraseña con la almacenada en la base de datos (sin encriptación)
    const isMatch = (password === user.password); // Comparación directa sin encriptación
    if (!isMatch) {
      console.log('[LOGIN ERROR]: La contraseña NO coincide para el usuario:', user.email);
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    console.log('[LOGIN INFO]: Contraseña coincide. ¡Autenticación exitosa!');

    // Crear un token JWT para el usuario
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) {
        console.error('[LOGIN ERROR]: Error al firmar el token JWT:', err);
        return res.status(500).json({ message: 'Error generando token' });
      }
      console.log('[LOGIN INFO]: Token JWT generado y enviado.');
      res.json({ message: 'Usuario autenticado correctamente', token, user });
    });

  } catch (error) {
    console.error('[LOGIN FATAL ERROR]: Error general durante la autenticación:', error);
    res.status(500).json({ message: 'Error al autenticar el usuario', error: error.message });
  } finally {
    console.log('--- FIN DE INICIO DE SESIÓN ---');
  }
});

module.exports = router;
