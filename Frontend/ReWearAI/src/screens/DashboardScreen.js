import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';

import SectionHeader from '../components/SectionHeader';

import GarmentImage from '../components/GarmentImage';

import { COLORS } from '../constants/colors';

import {
  inventoryData,
  marketplaceData,
} from '../constants/mockDataTemp';

export default function DashboardScreen({ onNavigate }) {

  return (
    <View style={styles.container}>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>

        <SectionHeader
          title="Resale Inventory"
          subtitle="Manage your wardrobe and resale listings."
        />

        <View style={styles.marketCard}>

          <View style={styles.marketHeader}>

            <Text style={styles.marketTitle}>
              Connected Marketplaces
            </Text>

            <Text style={styles.status}>
              {marketplaceData.filter(m => m.connected).length} Active
            </Text>

          </View>

          {marketplaceData.map((market, index) => (

            <View key={index} style={styles.marketRow}>

              <Text style={styles.marketName}>
                {market.name}
              </Text>

              <Text
                style={{
                  color: market.connected
                    ? COLORS.primary
                    : COLORS.muted,
                }}
              >
                {market.connected ? 'Connected' : 'Not Connected'}
              </Text>

            </View>

          ))}

        </View>

        <View style={styles.quickStats}>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {inventoryData.length}
            </Text>
            <Text style={styles.statLabel}>
              Inventory Items
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              —
            </Text>
            <Text style={styles.statLabel}>
              Total Value
            </Text>
          </View>

        </View>

        <SectionHeader
          title="Cross-Listed Inventory"
          subtitle="Your active resale items."
        />

        {inventoryData.length === 0 ? (

          <View style={styles.emptyCard}>

            <Ionicons
              name="shirt-outline"
              size={40}
              color={COLORS.outline}
            />

            <Text style={styles.emptyTitle}>
              No Inventory Yet
            </Text>

            <Text style={styles.emptyText}>
              Your evaluated garments will appear here.
            </Text>

            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => onNavigate('Upload')}
            >

              <Text style={styles.smallButtonText}>
                Add Garment
              </Text>

            </TouchableOpacity>

          </View>

        ) : (

          inventoryData.map((item, index) => (

            <View key={index} style={styles.inventoryCard}>

              <GarmentImage
                source={item.image}
                style={styles.inventoryImage}
              />

              <Text style={styles.inventoryName}>
                {item.name}
              </Text>

              <Text style={styles.muted}>
                {item.brand}
              </Text>

            </View>

          ))

        )}

        <SectionHeader
          title="Unposted Scans & Drafts"
          subtitle="Continue working on saved garments."
        />

        <View style={styles.emptyCard}>

          <Ionicons
            name="document-outline"
            size={35}
            color={COLORS.outline}
          />

          <Text style={styles.emptyTitle}>
            No Saved Drafts
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 16,
    paddingBottom: 30,
  },

  marketCard: {
    backgroundColor: COLORS.surfaceLow,
    padding: 15,
    borderRadius: 12,
    marginBottom: 18,
  },

  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  marketTitle: {
    fontWeight: '700',
    color: COLORS.text,
  },

  status: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  marketRow: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  marketName: {
    fontWeight: '700',
    color: COLORS.text,
  },

  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    padding: 18,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

  emptyCard: {
    backgroundColor: COLORS.surface,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 22,
  },

  emptyTitle: {
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },

  emptyText: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 5,
  },

  smallButton: {
    backgroundColor: COLORS.primaryContainer,
    padding: 12,
    borderRadius: 20,
    marginTop: 15,
  },

  smallButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  inventoryCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },

  inventoryImage: {
    width: '100%',
    height: 180,
  },

  inventoryName: {
    fontWeight: '700',
    marginTop: 10,
    color: COLORS.text,
  },

  muted: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

});