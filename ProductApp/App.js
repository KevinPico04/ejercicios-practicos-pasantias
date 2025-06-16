import React, { useState, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider, LanguageContext } from './context/LanguageContext';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { translate } = useContext(LanguageContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si ya hay usuario guardado en AsyncStorage (sesión persistente)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error loading user from storage', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading) return null; // O pantalla splash/loading

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Login"}>
        {!user ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: translate('login') }} 
              initialParams={{ onLogin: setUser }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: translate('register') }}
              initialParams={{ onRegister: setUser }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: translate('welcome') }} 
            />
            <Stack.Screen 
              name="Products" 
              component={ProductsScreen} 
              options={{ title: translate('products') }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}
