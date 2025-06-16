import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LanguageContext } from '../context/LanguageContext';

const ProductForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const { translate } = useContext(LanguageContext);

  const takePhoto = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' && galleryStatus !== 'granted') {
        Alert.alert(
          translate('permission_denied'),
          translate('camera_permission_message')
        );
        return;
      }

      Alert.alert(
        translate('select_source'),
        translate('choose_image_source'),
        [
          {
            text: translate('take_photo'),
            onPress: async () => {
              try {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });

                console.log('Camera result:', result);

                if (!result.canceled && result.assets && result.assets.length > 0) {
                  setImage(result.assets[0].uri);
                }
              } catch (error) {
                console.error('Camera error:', error);
                Alert.alert('Error', translate('camera_error'));
              }
            }
          },
          {
            text: translate('choose_from_gallery'),
            onPress: async () => {
              try {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });

                console.log('Gallery result:', result);

                if (!result.canceled && result.assets && result.assets.length > 0) {
                  setImage(result.assets[0].uri);
                }
              } catch (error) {
                console.error('Gallery error:', error);
                Alert.alert('Error', translate('gallery_error'));
              }
            }
          },
          {
            text: translate('cancel'),
            style: 'cancel'
          }
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', translate('permission_error'));
    }
  };

  const handleSubmit = () => {
    if (!name || !price) {
      Alert.alert('Error', translate('fill_all_fields'));
      return;
    }

    onSubmit({
      name,
      price: parseFloat(price),
      image,
    });

    setName('');
    setPrice('');
    setImage(null);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.label}>{translate('product_name')}</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder={translate('product_name')}
      />

      <Text style={styles.label}>{translate('product_price')}</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder={translate('product_price')}
        keyboardType="numeric"
      />

      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Button 
            title={translate('change_image')} 
            onPress={takePhoto} 
          />
        </View>
      ) : (
        <Button 
          title={translate('add_image')} 
          onPress={takePhoto} 
        />
      )}

      <Button title={translate('save')} onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default ProductForm;
