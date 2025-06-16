import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:4000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos');
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

  return (
    <View>
      <Button title="Agregar Producto" onPress={() => navigation.navigate('AddProduct')} />
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item.name} - ${item.price}</Text>
          </View>
        )}
      />
      <Button title="Cerrar Sesión" onPress={logout} />
    </View>
  );
}
