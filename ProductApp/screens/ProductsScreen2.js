import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name} - ${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Agregar Producto" onPress={() => navigation.navigate('AddProduct')} />
      
      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : products.length === 0 ? (
        <Text style={styles.emptyText}>No hay productos disponibles.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id || item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Button title="Cerrar Sesión" onPress={logout} color="#d9534f" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
  },
  listContainer: {
    marginVertical: 20,
  },
});
