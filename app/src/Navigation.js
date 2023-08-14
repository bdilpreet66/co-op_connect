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
import ViewResumeScreen from './screens/resume/ViewResumeScreen';
import EventListScreen from './screens/events/EventListScreen';
import ViewEventScreen from './screens/events/ViewEventsScreen';

import theme from './theme/theme';
import CompanyListScreen from './screens/companies/CompanyListScreen';
import ViewCompanyScreen from './screens/companies/CompanyEventsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const EventStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="EventList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventList" component={EventListScreen} options={{ title: 'Events' }} />
      <Stack.Screen name="ViewEvent" component={ViewEventScreen} options={{ title: 'View Event' }} />
    </Stack.Navigator>
  );
}

export const CompanyStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="CompanyList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyList" component={CompanyListScreen} />
      <Stack.Screen name="ViewCompany" component={ViewCompanyScreen} />
    </Stack.Navigator>
  );
}

function UserDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Events">
      <Drawer.Screen
        name="Events"
        component={EventStackScreen}
        options={{
          drawerIcon: ({ color, size, focused }) => (<Ionicons name="calendar" size={size} color={focused ? theme.colors.primary : color} />),
          drawerLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? theme.colors.primary : color }}>
              Events
            </Text>
          )
        }}
      />
      <Drawer.Screen
        name="Companies"
        component={CompanyStackScreen}
        options={{
          drawerIcon: ({ color, size, focused }) => (<Ionicons name="business" size={size} color={focused ? theme.colors.primary : color} />),
          drawerLabel: ({ focused, color }) => (
            <Text style={{ color: focused ? theme.colors.primary : color }}>
              Companies
            </Text>
          )
        }}
      />
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
              Logout
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
