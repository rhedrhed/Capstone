import React from 'react';

import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';

export default function GarmentImage({ source, style }) {
  return (
    <View style={[styles.container, style]}>

      {source ? (
        <Image
          source={{ uri: source }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Ionicons
          name="image-outline"
          size={36}
          color={COLORS.outline}
        />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceLow,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },

  image: {
    width: '100%',
    height: '100%',
  },
});