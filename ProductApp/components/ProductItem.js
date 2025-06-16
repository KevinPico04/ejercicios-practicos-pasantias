import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const ProductItem = ({ product }) => {
  const { translate } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      {product.image && (
        <Image source={{ uri: product.image }} style={styles.image} />
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text>{translate('product_price')}: ${product.price.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  details: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductItem;