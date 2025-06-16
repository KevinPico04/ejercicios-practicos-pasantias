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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;