import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // La URL base de tu backend
  // Puedes agregar aquí headers por defecto, tiempo de espera, etc.
});

export default axiosInstance;
