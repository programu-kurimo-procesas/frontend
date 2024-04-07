import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { theme } from './src/core/theme'
import { useState } from 'react'
import { LogBox } from 'react-native'
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens'
import MyTabs from './src/components/NavBar'

const Stack = createStackNavigator()

export default function App() {
  const [userData, setUserData] = useState(null); // Initialize userData state

  // Function to update userData state
  const updateUser = (userData) => {
    setUserData(userData);
  };
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="StartScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen
            name="LoginScreen"
            // Pass navigation and updateUser as props to LoginScreen
            component={(props) => <LoginScreen {...props} updateUser={updateUser} />}
          />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ProductsScreen">
            {() => <MyTabs userData={userData} />}
          </Stack.Screen>
          <Stack.Screen
            name="ResetPasswordScreen"
            component={ResetPasswordScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}
