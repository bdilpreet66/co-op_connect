import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import your screens here
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LogoutScreen from './screens/LogoutScreen';

import PmDashboardScreen from './screens/project_manager/DashboardScreen';
import PmProjectListScreen from './screens/project_manager/project/ProjectListScreen';
import PmCreateProjectScreen from './screens/project_manager/project/CreateProjectScreen';
import PmViewProjectScreen from './screens/project_manager/project/ViewProjectScreen';
import PmHistoryScreen from './screens/project_manager/project/WorkHistoryModal';
import PmCreateTaskScreen from './screens/project_manager/project/tasks/CreateTaskScreen';
import PmViewTaskScreen from './screens/project_manager/project/tasks/ViewTaskScreen';
import PmPreReqTaskScreen from './screens/project_manager/project/tasks/PrerequisiteTasksScreen';
import PmTaskHistoryScreen from './screens/project_manager/project/tasks/WorkHistoryScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function ProjectManagerDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen
        name="Dashboard"
        component={ProjectManagerDashboardStack}
        options={{ drawerIcon: ({ color, size }) => (<Ionicons name="home" size={size} color={color} />) }}
      />
      <Drawer.Screen
        name="Projects"
        component={ProjectManagerProjectStack}
        options={{ drawerIcon: ({ color, size }) => (<Ionicons name="list-outline" size={size} color={color} />) }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        options={{ drawerIcon: ({ color, size }) => (<Ionicons name="log-out" size={size} color={color} />) }}
      />
    </Drawer.Navigator>
  );
}

function ProjectManagerProjectStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Project List" component={PmProjectListScreen} />
        <Stack.Screen name="Create Project" component={PmCreateProjectScreen} />
        <Stack.Screen name="View Project" component={PmViewProjectScreen} />
        <Stack.Screen name="Work History" component={PmHistoryScreen} />
        <Stack.Screen name="Create Task" component={PmCreateTaskScreen} />
        <Stack.Screen name="View Task" component={PmViewTaskScreen} />
        <Stack.Screen name="Pre Req Task" component={PmPreReqTaskScreen} />
        <Stack.Screen name="Task Work History" component={PmTaskHistoryScreen} />
      </Stack.Navigator>
    );
}

function ProjectManagerDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PmDashboard" component={PmDashboardScreen} /> 
      <Stack.Screen name="View Project" component={PmViewProjectScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ProjectManagerDrawer" component={ProjectManagerDrawer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
