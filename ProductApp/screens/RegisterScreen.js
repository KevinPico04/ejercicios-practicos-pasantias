import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from '../api/axiosConfig'; // ajusta ruta según tu estructura
import { LanguageContext } from '../context/LanguageContext';

export default function RegisterScreen({ navigation, route }) {
  const { translate } = useContext(LanguageContext);
  const { onRegister } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert(translate('error'), translate('fill_all_fields'));
      return;
    }
    try {
      const response = await axios.post('/register', {
        username,
        password,
      });
      const userData = response.data;
      onRegister(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      Alert.alert(translate('success'), translate('register_success'));
    } catch (error) {
      Alert.alert(translate('error'), translate('registration_failed'));
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>{translate('register')}</Text>
      <TextInput
        placeholder={translate('username')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <TextInput
        placeholder={translate('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <Button title={translate('register')} onPress={handleRegister} />
      <Button title={translate('go_to_login')} onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
