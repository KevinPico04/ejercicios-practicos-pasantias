import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LanguageSelector from '../components/LanguageSelector';
import { LanguageContext } from '../context/LanguageContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { translate } = useContext(LanguageContext);

  return (
    <View style={styles.container}>
      <LanguageSelector />
      <Text style={styles.title}>{translate('welcome')}</Text>
      <Button
        title={translate('products')}
        onPress={() => navigation.navigate('Products')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50, // Agrega espacio superior para que el Picker no esté oculto
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
