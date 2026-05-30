import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, BrainCircuit, User } from 'lucide-react-native';
import { OperationsScreen } from '../screens/officer/OperationsScreen';
import { AIWorkspaceScreen } from '../screens/officer/AIWorkspaceScreen';
import { OfficerProfileScreen } from '../screens/officer/OfficerProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export function OfficerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0B1020',
          borderTopColor: 'rgba(255,255,255,0.1)',
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.slate500,
      }}>
      <Tab.Screen
        name="Operations"
        component={OperationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AI Workspace"
        component={AIWorkspaceScreen}
        options={{
          tabBarIcon: ({ color, size }) => <BrainCircuit color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={OfficerProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
