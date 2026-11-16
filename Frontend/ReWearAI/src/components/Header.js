import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';

export default function Header() {

  return (
    <View style={styles.header}>

      <View style={styles.left}>

        <TouchableOpacity style={styles.profile}>
          <Ionicons name="person" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={COLORS.text}
          />
        </TouchableOpacity>

      </View>

      <Text style={styles.title}>
        ReWear AI
      </Text>

      <View style={styles.right} />

    </View>
  );
}

const styles = StyleSheet.create({

  header: {
    height: 60,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  profile: {
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  right: {
    width: 68,
  },

});