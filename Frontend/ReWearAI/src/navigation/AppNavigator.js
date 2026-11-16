import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import UploadScreen from '../screens/UploadScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import PricingScreen from '../screens/PricingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ListingScreen from '../screens/ListingScreen';

import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

  return (

    <Tab.Navigator

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: COLORS.primary,

        tabBarInactiveTintColor: COLORS.secondaryText,

        tabBarStyle: {
          backgroundColor: COLORS.background,
          height: 85,
          paddingBottom: 15,
          paddingTop: 10,
          borderTopWidth: 0,
        },

        tabBarIcon: ({ color, size }) => {

          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'grid-outline';
          }

          else if (route.name === 'Analysis') {
            iconName = 'sparkles-outline';
          }

          else if (route.name === 'Upload') {
            iconName = 'camera-outline';
          }

          else if (route.name === 'Pricing') {
            iconName = 'trending-up-outline';
          }

          else if (route.name === 'Listings') {
            iconName = 'pricetag-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );

        },

      })}

    >

      <Tab.Screen name="Dashboard" component={DashboardScreen} />

      <Tab.Screen name="Analysis" component={AnalysisScreen} />

      <Tab.Screen name="Upload" component={UploadScreen} />

      <Tab.Screen name="Pricing" component={PricingScreen} />

      <Tab.Screen name="Listings" component={ListingScreen} />

    </Tab.Navigator>

  );

}