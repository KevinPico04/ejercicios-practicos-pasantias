import axios from '../api/axiosConfig';

export const fetchProducts = () => {
  return axios.get('/products'); // Llama a http://localhost:5000/api/products
};

export const createProduct = (productData) => {
  return axios.post('/products', productData);
};
