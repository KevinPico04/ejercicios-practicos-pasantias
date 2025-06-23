import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a la galería');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result);
    }
  };

  const addProduct = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Por favor complete nombre y precio');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', name);
    formData.append('price', price);

    if (image) {
      formData.append('photo', {
        uri: image.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      await axios.post('http://10.0.2.2:4000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert('Éxito', 'Producto agregado');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar producto');
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <TextInput
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ marginBottom: 10, borderBottomWidth: 1 }}
      />
      <Button title="Seleccionar Imagen" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />
      )}
      <Button title="Guardar Producto" onPress={addProduct} />
    </View>
  );
}
