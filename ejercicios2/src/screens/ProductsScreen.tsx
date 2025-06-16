import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const productos = [
  { id: '1', nombre: 'Laptop Lenovo', precio: 1200 },
  { id: '2', nombre: 'Mouse Inalámbrico', precio: 25 },
  { id: '3', nombre: 'Teclado Mecánico', precio: 70 },
  { id: '4', nombre: 'Monitor 27"', precio: 300 },
  { id: '5', nombre: 'Silla Gamer', precio: 180 },
];

const ProductsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleEdit = (producto: { id: string; nombre: string; precio: number }) => {
    navigation.navigate('ProductForm', { producto });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.price}>${item.precio}</Text>
            </View>
            <Button title="Editar" onPress={() => handleEdit(item)} />
          </View>
        )}
      />
    </View>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginVertical: 6,
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    color: '#555',
  },
});
