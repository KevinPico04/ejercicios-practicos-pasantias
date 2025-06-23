import axios from '../api/axiosConfig';

export const fetchProducts = () => {
  return axios.get('/products'); // 
};

export const createProduct = (productData) => {
  return axios.post('/products', productData);
};
