import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import axios from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { LanguageContext } from '../context/LanguageContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const { translate } = useContext(LanguageContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert(translate('error'), translate('missing_data'));
      return;
    }

    try {
      const res = await axios.post('/login', { username, password });
      await login(res.data);
    } catch (err) {
      Alert.alert(translate('error'), translate('login_failed'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{translate('login')}</Text>

      <TextInput
        placeholder={translate('username')}
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder={translate('password')}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title={translate('login')} onPress={handleLogin} />
      <View style={styles.registerButton}>
        <Button
          title={translate('go_to_register')}
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  registerButton: {
    marginTop: 10,
  },
});
