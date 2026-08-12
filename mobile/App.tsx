// ========================================================
// JAINSAATHI EXPO REACT NATIVE MOBILE APPLICATION
// ========================================================

import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'interests' | 'profile'>('home');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#100A18" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>
          Jain<Text style={styles.goldText}>Saathi</Text>
        </Text>
        <Text style={styles.brandTagline}>Find Your Jain Saathi</Text>
      </View>

      {/* Main Screen Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'home' && (
          <View style={styles.card}>
            <Text style={styles.welcomeText}>Namaste, Aarav 👋</Text>
            <Text style={styles.subText}>Your JainSaathi matches are waiting.</Text>

            <View style={styles.banner}>
              <Text style={styles.bannerTitle}>✨ Super Member Active</Text>
              <Text style={styles.bannerSub}>25 Contact Reveals Remaining</Text>
            </View>

            {/* Candidate Card Preview */}
            <View style={styles.candidateCard}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600' }}
                style={styles.candidateImage}
              />
              <View style={styles.candidateOverlay}>
                <Text style={styles.matchBadge}>92% Match</Text>
                <Text style={styles.candidateName}>Ritika Shah</Text>
                <Text style={styles.candidateInfo}>26 Yrs • 5'4" • Mumbai</Text>
                <Text style={styles.jainInfo}>Oswal • Shwetambar</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('home')}>
          <Text style={activeTab === 'home' ? styles.navActive : styles.navInactive}>🏠 Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('matches')}>
          <Text style={activeTab === 'matches' ? styles.navActive : styles.navInactive}>💕 Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('interests')}>
          <Text style={activeTab === 'interests' ? styles.navActive : styles.navInactive}>📩 Interests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('profile')}>
          <Text style={activeTab === 'profile' ? styles.navActive : styles.navInactive}>👤 Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100A18',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(214, 162, 74, 0.3)',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF9F1',
  },
  goldText: {
    color: '#D6A24A',
  },
  brandTagline: {
    fontSize: 10,
    color: '#F3D59B',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF9F1',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6E1231',
  },
  subText: {
    fontSize: 12,
    color: '#756B70',
    marginBottom: 12,
  },
  banner: {
    backgroundColor: '#6E1231',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  bannerTitle: {
    color: '#F3D59B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bannerSub: {
    color: '#FFF9F1',
    fontSize: 11,
  },
  candidateCard: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 320,
    backgroundColor: '#100A18',
    position: 'relative',
  },
  candidateImage: {
    width: '100%',
    height: '100%',
  },
  candidateOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(16, 10, 24, 0.75)',
  },
  matchBadge: {
    backgroundColor: '#9E183A',
    color: '#F3D59B',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  candidateName: {
    color: '#FFF9F1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  candidateInfo: {
    color: '#F3D59B',
    fontSize: 12,
  },
  jainInfo: {
    color: '#D6A24A',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#100A18',
    borderTopWidth: 1,
    borderTopColor: 'rgba(214, 162, 74, 0.3)',
    paddingVertical: 12,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navActive: {
    color: '#D6A24A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  navInactive: {
    color: '#F3D59B',
    opacity: 0.6,
    fontSize: 12,
  },
});
