import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';

import Svg, {
  Path,
  Line,
} from 'react-native-svg';

import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';

import GarmentImage from '../components/GarmentImage';

import { COLORS } from '../constants/colors';

import { garmentData, comparableItems } from '../constants/mockDataTemp';

export default function PricingScreen({ onNavigate }) {

  const [strategy, setStrategy] = useState('balanced');

  const [customVisible, setCustomVisible] = useState(false);

  const [customPrice, setCustomPrice] = useState('');

  const [selectedPrice, setSelectedPrice] = useState(
    garmentData.estimatedPrice
  );

  const strategies = {
    quick: garmentData.quickSalePrice,
    balanced: garmentData.balancedPrice,
    profit: garmentData.maximumProfitPrice,
  };

  const selectStrategy = (type) => {
    setStrategy(type);
    setSelectedPrice(strategies[type]);
  };

  const applyCustomPrice = () => {

    const value = Number(customPrice);

    if (!customPrice || !Number.isFinite(value) || value <= 0) {
      return;
    }

    setSelectedPrice(value);
    setCustomVisible(false);

  };

  return (
    <View style={styles.container}>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.garmentCard}>

          <GarmentImage
            source={garmentData.image}
            style={styles.garmentImage}
          />

          <View style={{ flex: 1 }}>

            <Text style={styles.garmentName}>
              {garmentData.name || 'Garment Name'}
            </Text>

            <Text style={styles.muted}>
              Resale valuation
            </Text>

          </View>

        </View>

        <Text style={styles.sectionTitle}>
          Pricing Strategy
        </Text>

        <View style={styles.strategyContainer}>

          {Object.entries(strategies).map(([key, value]) => (

            <TouchableOpacity
              key={key}
              style={[
                styles.strategy,
                strategy === key && styles.activeStrategy,
              ]}
              onPress={() => selectStrategy(key)}
            >

              <Text
                style={[
                  styles.strategyName,
                  strategy === key && styles.activeText,
                ]}
              >
                {key === 'quick'
                  ? 'Liquidate'
                  : key === 'balanced'
                  ? 'Balanced'
                  : 'Max Profit'}
              </Text>

              <Text
                style={[
                  styles.strategyPrice,
                  strategy === key && styles.activeText,
                ]}
              >
                {value !== null ? `$${value}` : '—'}
              </Text>

            </TouchableOpacity>

          ))}

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Market Density Curve
          </Text>

          <Svg width="100%" height="150" viewBox="0 0 340 120">

            <Line
              x1="0"
              y1="110"
              x2="340"
              y2="110"
              stroke="#BFCABA"
              strokeWidth="1"
            />

            <Path
              d="M0 110 Q40 100 80 75 Q120 20 170 15 Q220 20 260 75 Q300 100 340 110"
              stroke={COLORS.primary}
              strokeWidth="3"
              fill="none"
            />

          </Svg>

          <Text style={styles.muted}>
            Market distribution visualization will use actual pricing data.
          </Text>

          <Text style={styles.targetPrice}>
            Target Price: {selectedPrice !== null ? `$${selectedPrice}` : '—'}
          </Text>

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Verified Sold Comps
          </Text>

          {comparableItems.length === 0 ? (

            <Text style={styles.muted}>
              Comparable sold garments will appear here.
            </Text>

          ) : (

            comparableItems.map((item, index) => (

              <View key={index} style={styles.compRow}>

                <Text>{item.name}</Text>

                <Text>${item.price}</Text>

              </View>

            ))

          )}

        </View>

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Estimated Payout
          </Text>

          <Text style={styles.targetPrice}>
            {selectedPrice !== null
              ? `$${(selectedPrice * 0.89).toFixed(2)}`
              : '—'}
          </Text>

          <Text style={styles.muted}>
            Illustrative estimate only. Actual fees will depend on the selected marketplace.
          </Text>

        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onNavigate('Listings')}
        >

          <Text style={styles.buttonText}>
            Generate AI Resale Listing
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setCustomVisible(true)}
        >

          <Text style={styles.secondaryText}>
            Adjust Custom Price
          </Text>

        </TouchableOpacity>

      </ScrollView>

      <Modal
        visible={customVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCustomVisible(false)}
      >

        <View style={styles.modalBackground}>

          <View style={styles.modal}>

            <Text style={styles.sectionTitle}>
              Fine-Tune Price
            </Text>

            <Text style={styles.muted}>
              Enter your desired listing price.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter price"
              keyboardType="numeric"
              value={customPrice}
              onChangeText={setCustomPrice}
            />

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={applyCustomPrice}
            >

              <Text style={styles.buttonText}>
                Confirm Price
              </Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCustomVisible(false)}
              style={styles.secondaryButton}
            >

              <Text style={styles.secondaryText}>
                Cancel
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

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

  garmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
    marginBottom: 22,
  },

  garmentImage: {
    width: 65,
    height: 75,
  },

  garmentName: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.text,
  },

  muted: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  strategyContainer: {
    flexDirection: 'row',
    gap: 7,
    marginBottom: 20,
  },

  strategy: {
    flex: 1,
    backgroundColor: COLORS.surfaceMedium,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeStrategy: {
    backgroundColor: COLORS.primaryContainer,
  },

  strategyName: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },

  strategyPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },

  activeText: {
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
  },

  targetPrice: {
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 10,
  },

  compRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  primaryButton: {
    backgroundColor: COLORS.primaryContainer,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  secondaryButton: {
    padding: 15,
    alignItems: 'center',
  },

  secondaryText: {
    color: COLORS.primary,
    fontWeight: '700',
  },

  modalBackground: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'flex-end',
  },

  modal: {
    backgroundColor: COLORS.surface,
    padding: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  input: {
    backgroundColor: COLORS.surfaceLow,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    fontSize: 16,
  },

});