import React, { useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Header from '../components/Header';

import SectionHeader from '../components/SectionHeader';

import GarmentImage from '../components/GarmentImage';

import { COLORS } from '../constants/colors';

import { garmentData } from '../constants/mockDataTemp';

export default function ListingScreen() {

  const [title, setTitle] = useState(garmentData.name);

  const [description, setDescription] = useState(
    garmentData.description
  );

  const [price, setPrice] = useState(
    garmentData.estimatedPrice !== null
      ? String(garmentData.estimatedPrice)
      : ''
  );

  const [platform, setPlatform] = useState('ReWear');

  const [tags, setTags] = useState(garmentData.tags);

  const [tagInput, setTagInput] = useState('');

  const platforms = [
    'ReWear',
    'Depop',
    'Grailed',
    'eBay',
    'Poshmark',
  ];

  const addTag = () => {

    const cleanTag = tagInput.trim();

    if (!cleanTag) return;

    setTags(prev => [
      ...prev,
      cleanTag.startsWith('#') ? cleanTag : `#${cleanTag}`,
    ]);

    setTagInput('');

  };

  const removeTag = (tag) => {
    setTags(prev => prev.filter(item => item !== tag));
  };

  const publishListing = () => {

    if (!title.trim() || !price.trim()) {

      Alert.alert(
        'Incomplete Listing',
        'Enter a listing title and price first.'
      );

      return;
    }

    Alert.alert(
      'Ready for Integration',
      'Publishing will be connected to the backend later.'
    );

  };

  return (
    <View style={styles.container}>

      <Header />

      <ScrollView contentContainerStyle={styles.content}>

        <SectionHeader
          title="AI Listing"
          subtitle="Create and customize your resale listing."
        />

        <View style={styles.card}>

          <Text style={styles.label}>
            SYNC CHANNELS
          </Text>

          <View style={styles.platforms}>

            {platforms.map(item => (

              <TouchableOpacity
                key={item}
                style={[
                  styles.platform,
                  platform === item && styles.activePlatform,
                ]}
                onPress={() => setPlatform(item)}
              >

                <Text
                  style={[
                    styles.platformText,
                    platform === item && styles.activePlatformText,
                  ]}
                >
                  {item}
                </Text>

              </TouchableOpacity>

            ))}

          </View>

        </View>

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
              Listing Price
            </Text>

            <TextInput
              style={styles.priceInput}
              placeholder="Enter price"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />

          </View>

        </View>

        <View style={styles.card}>

          <SectionHeader title="Item Name / Title" />

          <TextInput
            style={styles.input}
            placeholder="Enter listing title"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.muted}>
            {title.length} characters
          </Text>

        </View>

        <View style={styles.card}>

          <SectionHeader title="AI-Generated Description" />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="AI-generated description will appear here."
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TouchableOpacity
            onPress={() => Alert.alert(
              'AI Generation',
              'Description generation will be connected to FastAPI.'
            )}
          >

            <Text style={styles.actionText}>
              ✨ Generate Description
            </Text>

          </TouchableOpacity>

        </View>

        <View style={styles.card}>

          <SectionHeader title="Garment Attributes & Specifications" />

          {[
            ['Brand', garmentData.brand],
            ['Garment Type', garmentData.type],
            ['Era', garmentData.era],
            ['Color', garmentData.color],
            ['Material', garmentData.material],
            ['Size', garmentData.size],
          ].map(([label, value]) => (

            <View key={label} style={styles.attribute}>

              <Text style={styles.attributeLabel}>
                {label}
              </Text>

              <Text style={styles.attributeValue}>
                {value || 'Not available'}
              </Text>

            </View>

          ))}

        </View>

        <View style={styles.card}>

          <SectionHeader title="Suggested Algorithmic Tags" />

          <View style={styles.tags}>

            {tags.map(tag => (

              <TouchableOpacity
                key={tag}
                style={styles.tag}
                onPress={() => removeTag(tag)}
              >

                <Text style={styles.tagText}>
                  {tag} ×
                </Text>

              </TouchableOpacity>

            ))}

          </View>

          <View style={styles.addTagRow}>

            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter new tag"
              value={tagInput}
              onChangeText={setTagInput}
            />

            <TouchableOpacity
              style={styles.addTagButton}
              onPress={addTag}
            >

              <Ionicons name="add" size={22} color="#FFFFFF" />

            </TouchableOpacity>

          </View>

        </View>

        <TouchableOpacity
          style={styles.publishButton}
          onPress={publishListing}
        >

          <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />

          <Text style={styles.publishText}>
            Publish Listing
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
    paddingBottom: 30,
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  label: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '700',
    marginBottom: 12,
  },

  platforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  platform: {
    backgroundColor: COLORS.surfaceLow,
    padding: 10,
    borderRadius: 20,
  },

  activePlatform: {
    backgroundColor: COLORS.text,
  },

  platformText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },

  activePlatformText: {
    color: '#FFFFFF',
  },

  garmentCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 15,
  },

  garmentImage: {
    width: 85,
    height: 100,
  },

  garmentName: {
    fontWeight: '700',
    color: COLORS.text,
  },

  muted: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },

  priceInput: {
    backgroundColor: COLORS.surfaceLow,
    padding: 9,
    borderRadius: 8,
    marginTop: 7,
    width: 120,
  },

  input: {
    backgroundColor: COLORS.surfaceLow,
    padding: 12,
    borderRadius: 9,
    color: COLORS.text,
    fontSize: 14,
  },

  textArea: {
    height: 160,
    textAlignVertical: 'top',
  },

  actionText: {
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 12,
  },

  attribute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceLow,
  },

  attributeLabel: {
    color: COLORS.muted,
    fontSize: 13,
  },

  attributeValue: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 13,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  tag: {
    backgroundColor: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  addTagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
  },

  addTagButton: {
    width: 45,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  publishButton: {
    backgroundColor: COLORS.primaryContainer,
    padding: 16,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  publishText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

});