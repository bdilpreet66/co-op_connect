import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import your screens here
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogoutScreen from './screens/LogoutScreen';
import ViewResumeScreen from './screens/resume/ViewResumeScreen'

import theme from './theme/theme';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function UserDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Resume">
      <Drawer.Screen
        name="Resume"
        component={ViewResumeScreen}
        options={{
          drawerIcon: ({ color, size, focused }) => (<Ionicons name="mail-open" size={size} color={focused ? theme.colors.primary : color} />),
          drawerLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? theme.colors.primary : color }}>
              Resume
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{
          drawerIcon: ({ color, size, focused }) => (<Ionicons name="log-out" size={size} color={focused ? theme.colors.primary : color} />),
          drawerLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? theme.colors.primary : color }}>
              Resume
            </Text>
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="userDrawer" component={UserDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}