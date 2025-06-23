// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  // La ruta de la imagen de perfil del usuario
  image: {
    type: String,
    required: true,
    // Asegúrate de tener esta imagen en 'uploads/default/user.png' en tu backend
    default: 'uploads/default/user.png'
  },
  password: { type: String, required: true },
  // ¡RECORDATORIO DE SEGURIDAD! La contraseña NUNCA debe guardarse en texto plano.
  // Asegúrate de que en tu lógica de registro y login estés hasheando la contraseña
  // con una librería como `bcryptjs` antes de guardarla en la base de datos.
});

const User = mongoose.model('User', UserSchema);

module.exports = User;