import React, { useState } from 'react';

import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import BottomNavigation from './src/components/BottomNavigation';

import DashboardScreen from './src/screens/DashboardScreen';
import UploadScreen from './src/screens/UploadScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import PricingScreen from './src/screens/PricingScreen';
import ListingScreen from './src/screens/ListingScreen';

import { COLORS } from './src/constants/colors';

export default function App() {

  const [activeScreen, setActiveScreen] = useState('Dashboard');

  const navigate = (screen) => {
    setActiveScreen(screen);
  };

  const renderScreen = () => {

    switch (activeScreen) {

      case 'Dashboard':
        return <DashboardScreen onNavigate={navigate} />;

      case 'Upload':
        return <UploadScreen onNavigate={navigate} />;

      case 'Analysis':
        return <AnalysisScreen onNavigate={navigate} />;

      case 'Pricing':
        return <PricingScreen onNavigate={navigate} />;

      case 'Listings':
        return <ListingScreen onNavigate={navigate} />;

      default:
        return <DashboardScreen onNavigate={navigate} />;

    }

  };

  return (

    <SafeAreaProvider>

      <SafeAreaView style={styles.container} edges={['top']}>

        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />

        <View style={styles.content}>
          {renderScreen()}
        </View>

        <BottomNavigation
          active={activeScreen}
          onNavigate={navigate}
        />

      </SafeAreaView>

    </SafeAreaProvider>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
  },

});