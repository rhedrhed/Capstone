import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';

import SectionHeader from '../components/SectionHeader';

import { COLORS } from '../constants/colors';

export default function UploadScreen({ onNavigate }) {

  const [images, setImages] = useState({
    front: null,
    back: null,
    label: null,
    defects: [],
  });

  const pickImage = async (category) => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow gallery access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;

    if (category === 'defects') {
      setImages(prev => ({
        ...prev,
        defects: [...prev.defects, uri],
      }));
    } else {
      setImages(prev => ({
        ...prev,
        [category]: uri,
      }));
    }
  };

  const slots = [
    { id: 'front', label: 'Full Front Angle' },
    { id: 'back', label: 'Full Back Angle' },
    { id: 'label', label: 'Brand & Care Tag' },
  ];

  const uploaded = [
    images.front,
    images.back,
    images.label,
  ].filter(Boolean).length;

  const startAnalysis = () => {

    if (uploaded < 3) {
      Alert.alert(
        'Incomplete Inspection',
        'Please upload all three primary garment angles.'
      );
      return;
    }

    onNavigate('Analysis');
  };

  return (
    <View style={styles.container}>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>

        <SectionHeader
          title="Garment Inspection Scan"
          subtitle="Multi-angle inspection for garment identification and condition assessment."
        />

        <View style={styles.stepCard}>

          <Text style={styles.stepActive}>1. Photos</Text>

          <Text style={styles.stepInactive}>2. Analysis</Text>

          <Text style={styles.stepInactive}>3. Valuation</Text>

        </View>

        <View style={styles.progressCard}>

          <Text style={styles.progressTitle}>
            {uploaded} of 3 primary angles uploaded
          </Text>

          <View style={styles.progressBackground}>

            <View
              style={[
                styles.progressFill,
                { width: `${(uploaded / 3) * 100}%` },
              ]}
            />

          </View>

          <Text style={styles.helper}>
            Upload clear, high-resolution photographs.
          </Text>

        </View>

        <SectionHeader
          title="Inspection Slots"
          subtitle="Tap to upload or replace."
        />

        <View style={styles.grid}>

          {slots.map(slot => (

            <TouchableOpacity
              key={slot.id}
              style={styles.imageCard}
              onPress={() => pickImage(slot.id)}
            >

              {images[slot.id] ? (

                <Image
                  source={{ uri: images[slot.id] }}
                  style={styles.preview}
                />

              ) : (

                <View style={styles.placeholder}>
                  <Ionicons
                    name="camera-outline"
                    size={30}
                    color={COLORS.primary}
                  />
                  <Text style={styles.placeholderText}>
                    Add Photo
                  </Text>
                </View>

              )}

              <Text style={styles.imageLabel}>
                {slot.label}
              </Text>

            </TouchableOpacity>

          ))}

          <TouchableOpacity
            style={styles.addCard}
            onPress={() => pickImage('defects')}
          >

            <Ionicons
              name="add-circle-outline"
              size={36}
              color={COLORS.primary}
            />

            <Text style={styles.imageLabel}>
              Add Defect Photos
            </Text>

            <Text style={styles.helper}>
              Optional
            </Text>

          </TouchableOpacity>

        </View>

        {images.defects.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.defectPreview}
          />
        ))}

        <View style={styles.checklist}>

          <Text style={styles.checklistTitle}>
            Capture Checklist
          </Text>

          <Text style={styles.helper}>
            ☀ Even lighting
          </Text>

          <Text style={styles.helper}>
            ◻ Flat garment positioning
          </Text>

          <Text style={styles.helper}>
            ✓ Legible brand labels
          </Text>

        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={startAnalysis}
        >

          <Ionicons name="sparkles" size={20} color="#FFFFFF" />

          <Text style={styles.buttonText}>
            Garment Analysis
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => Alert.alert('Draft', 'Draft saving will be connected later.')}
        >

          <Text style={styles.secondaryText}>
            Save as Inspection Draft
          </Text>

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

  stepCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surfaceMedium,
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
  },

  stepActive: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },

  stepInactive: {
    color: COLORS.muted,
    fontSize: 12,
  },

  progressCard: {
    padding: 15,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 20,
  },

  progressTitle: {
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },

  progressBackground: {
    height: 8,
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 10,
  },

  progressFill: {
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  helper: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },

  imageCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 12,
  },

  preview: {
    width: '100%',
    height: 175,
    borderRadius: 8,
  },

  placeholder: {
    height: 175,
    backgroundColor: COLORS.surfaceLow,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  placeholderText: {
    marginTop: 8,
    color: COLORS.primary,
    fontWeight: '600',
  },

  imageLabel: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },

  addCard: {
    width: '48%',
    height: 175,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.outline,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLow,
  },

  defectPreview: {
    width: 100,
    height: 100,
    marginTop: 12,
    borderRadius: 10,
  },

  checklist: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },

  checklistTitle: {
    fontWeight: '700',
    marginBottom: 8,
    color: COLORS.text,
  },

  primaryButton: {
    backgroundColor: COLORS.primaryContainer,
    padding: 16,
    borderRadius: 30,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  secondaryButton: {
    padding: 15,
    alignItems: 'center',
  },

  secondaryText: {
    color: COLORS.secondaryText,
    fontWeight: '600',
  },

});