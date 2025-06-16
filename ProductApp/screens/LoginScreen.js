import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, route }) {
  const { onLogin } = route.params;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      const response = await axios.post('http://TU_BACKEND/api/login', {
        username,
        password,
      });
      const userData = response.data;
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      onLogin(userData);
    } catch (error) {
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={{ flex:1, justifyContent:'center', padding:20 }}>
      <Text>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
