import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProductFormRouteProp = RouteProp<RootStackParamList, 'ProductForm'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductForm'>;

const ProductFormScreen = () => {
  const route = useRoute<ProductFormRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const productoEdit = route.params?.producto;

  const [nombre, setNombre] = useState(productoEdit ? productoEdit.nombre : '');
  const [precio, setPrecio] = useState(productoEdit ? String(productoEdit.precio) : '');

  const handleSave = () => {
    // Aquí puedes implementar guardar el producto (nuevo o editado)
    // Por ahora solo regresa a la lista
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{productoEdit ? 'Editar Producto' : 'Crear Producto'}</Text>

      <Text>Nombre:</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del producto"
      />

      <Text>Precio:</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        placeholder="Precio"
        keyboardType="numeric"
      />

      <Button title="Guardar" onPress={handleSave} />
    </View>
  );
};

export default ProductFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    marginBottom: 16,
    borderRadius: 6,
  },
});
