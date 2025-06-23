import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductItem from './ProductItem';
import { LanguageContext } from '../context/LanguageContext';

const ProductList = ({ products = [] }) => {
  const { translate } = useContext(LanguageContext);

  if (!products.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text>{translate('no_products')}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => (item.id ? item.id.toString() : item._id)}
      renderItem={({ item }) => <ProductItem product={item} />}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default ProductList;
