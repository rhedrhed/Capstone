import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/colors';

export default function InfoCard({ label, value }) {
  return (
    <View style={styles.card}>

      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value || 'Not available'}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surfaceLow,
    padding: 12,
    borderRadius: 10,
    flex: 1,
  },

  label: {
    fontSize: 11,
    color: COLORS.secondaryText,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 5,
  },
});
