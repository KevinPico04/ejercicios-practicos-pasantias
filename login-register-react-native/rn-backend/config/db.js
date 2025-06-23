const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar las variables de entorno
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Termina el proceso si la conexión falla
  }
};

module.exports = connectDB;
