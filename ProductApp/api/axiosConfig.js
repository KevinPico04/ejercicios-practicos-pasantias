import axios from 'axios';

// Usa la IP especial para el emulador Android y puerto correcto
const instance = axios.create({
  baseURL: 'http://192.168.100.198:4000/api', // Cambia si usas otro puerto
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
