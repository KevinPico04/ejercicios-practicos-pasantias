// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const productRoutes = require('./routes/products'); // Mantener la importación de rutas de productos
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config(); // Cargar variables de entorno

const app = express();

// --- CONFIGURACIÓN DE PUERTO Y BASE URL ---
const PORT = process.env.PORT || 4000;
const BACKEND_IP = '192.168.100.198'; // Asegúrate de que esta sea la IP real de tu máquina
const BASE_URL = `http://${BACKEND_IP}:${PORT}`;

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); // Para manejar CORS (en desarrollo, se deja abierto)
app.use(express.json()); // Para manejar JSON en las solicitudes
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos (imágenes)

// --- ASEGURAR EXISTENCIA DE CARPETAS DE UPLOADS ---
// Carpeta para imágenes de productos
const productUploadDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
  console.log(`Carpeta de subidas de productos creada: ${productUploadDir}`);
}

// Carpeta para imágenes de usuarios (nueva)
const userUploadDir = path.join(__dirname, 'uploads', 'users');
if (!fs.existsSync(userUploadDir)) {
  fs.mkdirSync(userUploadDir, { recursive: true });
  console.log(`Carpeta de subidas de usuarios creada: ${userUploadDir}`);
}

// Carpeta para imágenes por defecto (si se usa en el modelo User)
const defaultUploadDir = path.join(__dirname, 'uploads', 'default');
if (!fs.existsSync(defaultUploadDir)) {
  fs.mkdirSync(defaultUploadDir, { recursive: true });
  console.log(`Carpeta de imágenes por defecto creada: ${defaultUploadDir}`);
  // Opcional: Si quieres copiar una imagen por defecto automáticamente, hazlo aquí
  // Ejemplo: fs.copyFileSync(path.join(__dirname, 'assets', 'default_user.png'), path.join(defaultUploadDir, 'user.png'));
}

// --- CONEXIÓN A LA BASE DE DATOS ---
connectDB()
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
    process.exit(1); // Sale del proceso si la conexión a la DB falla
  });

// --- MIDDLEWARE DE AUTENTICACIÓN JWT ---
const authenticateUser = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporciona token de autorización.' });
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado o formato inválido (debe ser "Bearer TOKEN").' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Añade el payload decodificado al objeto request
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado. Por favor, inicia sesión de nuevo.' });
    }
    return res.status(401).json({ message: 'Token no válido.' });
  }
};

// --- CONFIGURACIÓN DE MULTER PARA IMÁGENES DE USUARIO ---
const userImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users'); // Guarda las imágenes de usuario en 'uploads/users'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadUserImage = multer({ storage: userImageStorage });

// --- RUTAS DE AUTENTICACIÓN (LOGIN/REGISTER) ---
app.use('/api/auth', authRoutes);

// --- RUTA PUT PARA ACTUALIZAR UN USUARIO ---
// Protegida por autenticación y con manejo de subida de imagen de perfil
app.put('/api/auth/update/:id', authenticateUser, uploadUserImage.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const imageFile = req.file; // La nueva imagen de perfil subida por multer

    // AÑADIR ESTOS CONSOLE.LOGS PARA DEPURAR SI EL ERROR PERSISTE
    console.log('req.body recibido en update user:', req.body);
    console.log('req.file recibido en update user:', req.file);

    // Verificar que el ID del token coincide con el ID del usuario que se intenta actualizar
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para actualizar este usuario.' });
    }

    // Buscar el usuario existente para actualizar
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar campos individualmente solo si están presentes en req.body (para actualizaciones parciales)
    if (req.body.name !== undefined) {
      userToUpdate.name = req.body.name;
    }
    if (req.body.email !== undefined) {
      // Opcional: Validar unicidad del email si se actualiza y no es el email actual del usuario
      if (req.body.email !== userToUpdate.email) {
          const existingUserWithEmail = await User.findOne({ email: req.body.email });
          if (existingUserWithEmail && existingUserWithEmail._id.toString() !== userId) {
              return res.status(400).json({ message: 'Este correo electrónico ya está en uso por otro usuario.' });
          }
      }
      userToUpdate.email = req.body.email;
    }
    if (req.body.phone !== undefined) {
      userToUpdate.phone = req.body.phone;
    }

    // Manejar la ubicación (latitud y longitud)
    const latNum = parseFloat(req.body.latitude);
    const lonNum = parseFloat(req.body.longitude);

    if (req.body.latitude !== undefined && !isNaN(latNum)) {
      userToUpdate.location.latitude = latNum;
    }
    if (req.body.longitude !== undefined && !isNaN(lonNum)) {
      userToUpdate.location.longitude = lonNum;
    }
    // Asegurarse de que el objeto location exista antes de asignar propiedades si no existe
    if (!userToUpdate.location) {
        userToUpdate.location = { latitude: 0, longitude: 0 }; // Inicializar si es null/undefined
    }


    // Si se subió una nueva imagen, actualiza la ruta de la imagen
    if (imageFile) {
      // Opcional: Eliminar la imagen anterior si no es la por defecto
      if (userToUpdate.image && userToUpdate.image !== 'uploads/default/user.png' && fs.existsSync(path.join(__dirname, userToUpdate.image))) {
        fs.unlink(path.join(__dirname, userToUpdate.image), (err) => {
          if (err) console.error('Error al eliminar la imagen antigua del usuario:', err);
          else console.log('Imagen antigua del usuario eliminada:', userToUpdate.image);
        });
      }
      userToUpdate.image = imageFile.path; // Guarda la nueva ruta relativa
    }

    // Guarda los cambios en la base de datos
    const updatedUser = await userToUpdate.save();

    // Construir la URL completa de la imagen para la respuesta al frontend
    const userResponse = updatedUser.toObject();
    if (userResponse.image) {
      userResponse.image = `${BASE_URL}/${userResponse.image}`;
    }

    res.status(200).json({ message: 'Usuario actualizado', user: userResponse });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: 'Errores de validación:', errors });
    }
    res.status(500).json({ message: 'Error interno del servidor al actualizar el usuario.', error: error.message });
  }
});

// --- RUTA DELETE PARA ELIMINAR UN USUARIO ---
// Protegida por autenticación
app.delete('/api/auth/delete/:id', authenticateUser, async (req, res) => {
  try {
    const userId = req.params.id;
    if (req.user.id !== userId) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para eliminar este usuario.' });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    // Opcional: Eliminar la imagen del usuario al eliminarlo
    if (deletedUser.image && deletedUser.image !== 'uploads/default/user.png' && fs.existsSync(path.join(__dirname, deletedUser.image))) {
      fs.unlink(path.join(__dirname, deletedUser.image), (err) => {
        if (err) console.error('Error al eliminar la imagen del usuario al borrarlo:', err);
        else console.log('Imagen de usuario eliminada al borrarlo:', deletedUser.image);
      });
    }
    res.status(200).json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el usuario.', error: error.message });
  }
});

// --- RUTAS DE PRODUCTOS ---
// ESTO SE MANTIENE SIN CAMBIOS Y USA SU PROPIO MULTER INTERNAMENTE EN routes/products.js
// Asegúrate de que este 'require' esté después de definir 'authenticateUser'
app.use('/api/products', authenticateUser, productRoutes);

// --- INICIAR EL SERVIDOR ---
app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${BASE_URL}`);
});