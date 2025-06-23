import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { LanguageContext } from '../context/LanguageContext';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const { translate } = useContext(LanguageContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await axios.get('http://10.0.2.2:4000/api/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(res.data);
      } catch (error) {
        Alert.alert(translate('error_fetching_products') || 'Error al obtener productos');
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  return (
    <View style={styles.container}>
      <ProductForm onSubmit={handleAddProduct} />
      <ProductList products={products} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default ProductsScreen;
