import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { COLORS } from '../constants/colors';

export default function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        {title}
      </Text>

      {subtitle ? (
        <Text style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
});