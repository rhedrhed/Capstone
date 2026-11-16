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

import InfoCard from '../components/InfoCard';

import { COLORS } from '../constants/colors';

import { garmentData } from '../constants/mockDataTemp';

export default function AnalysisScreen({ onNavigate }) {

  return (
    <View style={styles.container}>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.session}>
          SESSION ID: {garmentData.id || '—'}
        </Text>

        <GarmentImage
          source={garmentData.image}
          style={styles.garment}
        />

        <View style={styles.overlayInfo}>

          <Text style={styles.overlayTitle}>
            AI Detection Visualization
          </Text>

          <Text style={styles.overlaySubtitle}>
            Detection regions will appear after model integration.
          </Text>

        </View>

        <View style={styles.metrics}>

          <InfoCard
            label="AUTHENTICITY"
            value={
              garmentData.authenticity !== null
                ? `${garmentData.authenticity}%`
                : 'Pending'
            }
          />

          <InfoCard
            label="CONDITION"
            value={garmentData.condition || 'Pending'}
          />

        </View>

        <SectionHeader title="Garment Information" />

        <View style={styles.information}>

          <InfoCard label="Detected Brand" value={garmentData.brand} />

          <InfoCard label="Garment Type" value={garmentData.type} />

          <InfoCard label="Era / Vintage" value={garmentData.era} />

          <InfoCard label="Colorway" value={garmentData.color} />

          <InfoCard label="Material" value={garmentData.material} />

          <InfoCard label="Defect Log" value={garmentData.defects.join(', ')} />

        </View>

        <View style={styles.explanation}>

          <Text style={styles.explanationTitle}>
            AI Analysis Explanation
          </Text>

          <Text style={styles.explanationText}>
            Detailed model findings will be displayed here once the AI models are connected.
          </Text>

        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => onNavigate('Pricing')}
        >

          <Text style={styles.buttonText}>
            View Resale Valuation & Comps
          </Text>

          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />

        </TouchableOpacity>

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
    paddingBottom: 25,
  },

  session: {
    fontSize: 11,
    color: COLORS.muted,
    marginBottom: 12,
  },

  garment: {
    width: '100%',
    height: 370,
    borderRadius: 14,
  },

  overlayInfo: {
    padding: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 15,
  },

  overlayTitle: {
    fontWeight: '700',
    color: COLORS.text,
  },

  overlaySubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

  metrics: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  information: {
    gap: 8,
  },

  explanation: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },

  explanationTitle: {
    fontWeight: '700',
    color: COLORS.text,
  },

  explanationText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 8,
    lineHeight: 20,
  },

  button: {
    backgroundColor: COLORS.primaryContainer,
    padding: 16,
    borderRadius: 30,
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

});