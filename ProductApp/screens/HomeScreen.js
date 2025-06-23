import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LanguageSelector from '../components/LanguageSelector';
import { LanguageContext } from '../context/LanguageContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { translate } = useContext(LanguageContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LanguageSelector />
        <Text style={styles.title}>{translate('welcome')}</Text>
        <Button
          title={translate('products')}
          onPress={() => navigation.navigate('Products')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Centrar verticalmente
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
