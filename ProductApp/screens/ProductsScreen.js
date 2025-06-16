import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { LanguageContext } from '../context/LanguageContext';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const { translate } = useContext(LanguageContext);

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