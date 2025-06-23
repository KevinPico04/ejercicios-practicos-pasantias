import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { translate } = useContext(LanguageContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert(translate('error'), translate('please_fill_all_fields'));
      return;
    }
    try {
      const res = await axios.post('/register', { username, password });
      await login(res.data); // Auto login on successful registration
    } catch (error) {
      Alert.alert(translate('error'), translate('registration_failed'));
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translate('register')}</Text>
      <TextInput
        placeholder={translate('username')}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder={translate('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={translate('register')} onPress={handleRegister} />
      <Button title={translate('go_to_login')} onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});
