import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import your screens here
import SplashScreen from './screens/SplashScreen';
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

import PmMemberListScreen from './screens/project_manager/members/MemberListScreen';
import PmCreateMemberScreen from './screens/project_manager/members/CreateMemberScreen';
import PmEditMemberScreen from './screens/project_manager/members/EditMemberScreen';

import MDashboardScreen from './screens/members/DashboardScreen';
import MProjectListScreen from './screens/members/project/ProjectListScreen';
import MViewTaskScreen from './screens/members/project/tasks/ViewTaskScreen';
import MWorkedHourList from './screens/members/project/tasks/workedHoursList';
import MAddWorkedHours from './screens/members/project/tasks/addWorkedHours';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Configure the screens with icons
const PmDashboardScreenOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="home" size={size} color={color} />
  ),
};

const ProjectManagerProjectStackOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="list-outline" size={size} color={color} />
  ),
};

const MemberStackOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="people" size={size} color={color} />
  ),
};

const LogoutScreenOptions = {
  tabBarIcon: ({ color, size }) => (
    <Ionicons name="log-out" size={size} color={color} />
  ),
};

function ProjectManagerTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Dashboard"
        component={ProjectManagerDashboardStack}
        options={PmDashboardScreenOptions}
      />
      <Tab.Screen
        name="Projects"
        component={ProjectManagerProjectStack}
        options={ProjectManagerProjectStackOptions}
      />
      <Tab.Screen
        name="Members"
        component={MemberStack}
        options={MemberStackOptions}
      />
      <Tab.Screen
        name="Logout"
        component={LogoutScreen}
        options={LogoutScreenOptions}
      />
    </Tab.Navigator>
  );
}

function MemberTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Dashboard" component={MemberDashboardStack} options={PmDashboardScreenOptions} />
        <Tab.Screen name="Tasks" component={MemberProjectStack} options={ProjectManagerProjectStackOptions} />
        <Tab.Screen name="Logout" component={LogoutScreen} options={LogoutScreenOptions} />
    </Tab.Navigator>
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

function MemberProjectStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Project List" component={MProjectListScreen} />
      <Stack.Screen name="View Task" component={MViewTaskScreen} />
      <Stack.Screen name="View Worked Hours" component={MWorkedHourList} />
      <Stack.Screen name="Add Worked Hours" component={MAddWorkedHours} />
    </Stack.Navigator>
  );
}

function MemberDashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Project List" component={MDashboardScreen} />
      <Stack.Screen name="View Task" component={MViewTaskScreen} />      
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

function MemberStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Member List" component={PmMemberListScreen} />
      <Stack.Screen name="Create Member" component={PmCreateMemberScreen} />
      <Stack.Screen name="Edit Member" component={PmEditMemberScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ProjectManagerTabs" component={ProjectManagerTabs} />
                <Stack.Screen name="MemberTabs" component={MemberTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
