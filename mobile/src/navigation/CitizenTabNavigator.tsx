import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PlusCircle, User } from 'lucide-react-native';
import { CitizenOverviewScreen } from '../screens/citizen/CitizenOverviewScreen';
import { SubmitGrievanceScreen } from '../screens/citizen/SubmitGrievanceScreen';
import { CitizenProfileScreen } from '../screens/citizen/CitizenProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export function CitizenTabNavigator() {
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
        name="Overview"
        component={CitizenOverviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Submit"
        component={SubmitGrievanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CitizenProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
