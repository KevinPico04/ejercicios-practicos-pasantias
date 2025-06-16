import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { translate } = useContext(LanguageContext);
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: translate('login') }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: translate('register') }}
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
}
