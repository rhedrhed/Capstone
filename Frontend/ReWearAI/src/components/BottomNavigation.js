import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';

const tabs = [
  {
    name: 'Dashboard',
    icon: 'grid-outline',
  },
  {
    name: 'Analysis',
    icon: 'sparkles-outline',
  },
  {
    name: 'Upload',
    icon: 'camera-outline',
  },
  {
    name: 'Pricing',
    icon: 'trending-up-outline',
  },
  {
    name: 'Listings',
    icon: 'pricetag-outline',
  },
];

export default function BottomNavigation({ active, onNavigate }) {
  return (
    <View style={styles.container}>

      {tabs.map((tab) => {

        const selected = active === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onNavigate(tab.name)}
          >

            <Ionicons
              name={tab.icon}
              size={23}
              color={selected ? COLORS.primary : COLORS.muted}
            />

            <Text
              style={[
                styles.label,
                selected && styles.activeLabel,
              ]}
            >
              {tab.name}
            </Text>

          </TouchableOpacity>
        );
      })}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EFEDE8',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  label: {
    fontSize: 10,
    color: COLORS.muted,
  },

  activeLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});