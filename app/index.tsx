import React from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Cores inspiradas no tema premium bíblico (azul escuro profundo e dourado/bronze)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0B0F19' : '#F9FAFB',
      justifyContent: 'space-between',
    },
    header: {
      alignItems: 'center',
      marginTop: 40,
      paddingHorizontal: 24,
    },
    tag: {
      backgroundColor: isDark ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.1)',
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.2)',
      marginBottom: 16,
    },
    tagText: {
      color: '#D4AF37', // Dourado
      fontSize: 12,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    titlePt: {
      fontSize: 32,
      fontWeight: 'bold',
      color: isDark ? '#F3F4F6' : '#111827',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    titleEn: {
      fontSize: 24,
      fontStyle: 'italic',
      fontWeight: '300',
      color: isDark ? '#9CA3AF' : '#4B5563',
      textAlign: 'center',
      marginTop: 4,
    },
    centerArea: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    iconContainer: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.7)' : '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 16,
      elevation: 8,
      marginBottom: 40,
      borderWidth: 1.5,
      borderColor: 'rgba(212, 175, 55, 0.4)',
    },
    quoteContainer: {
      backgroundColor: isDark ? 'rgba(17, 24, 39, 0.6)' : 'rgba(243, 244, 246, 0.8)',
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      width: '100%',
    },
    quoteTextPt: {
      fontSize: 15,
      color: isDark ? '#E5E7EB' : '#374151',
      textAlign: 'center',
      lineHeight: 22,
      fontWeight: '400',
    },
    quoteTextEn: {
      fontSize: 13.5,
      color: isDark ? '#9CA3AF' : '#6B7280',
      textAlign: 'center',
      lineHeight: 20,
      fontStyle: 'italic',
      marginTop: 8,
    },
    quoteRef: {
      fontSize: 12,
      color: '#D4AF37',
      textAlign: 'center',
      marginTop: 12,
      fontWeight: '600',
      letterSpacing: 1,
    },
    footer: {
      paddingHorizontal: 24,
      marginBottom: 30,
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#D4AF37',
      paddingVertical: 18,
      borderRadius: 14,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 5,
    },
    buttonTextPt: {
      color: '#0B0F19',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    buttonTextEn: {
      color: '#0B0F19',
      fontSize: 13,
      fontWeight: '500',
      opacity: 0.8,
      marginTop: 2,
    },
    infoText: {
      color: isDark ? '#6B7280' : '#9CA3AF',
      fontSize: 12,
      marginTop: 16,
      textAlign: 'center',
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Area */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(100)} 
        style={styles.header}
      >
        <View style={styles.tag}>
          <Text style={styles.tagText}>Bilingual Edition</Text>
        </View>
        <Text style={styles.titlePt}>Bíblia Sagrada</Text>
        <Text style={styles.titleEn}>Holy Bible</Text>
      </Animated.View>

      {/* Middle Interactive/Visual Area */}
      <View style={styles.centerArea}>
        <Animated.View 
          entering={FadeInUp.duration(1000).delay(200)}
          style={styles.iconContainer}
        >
          <Ionicons name="book-outline" size={64} color="#D4AF37" />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.duration(900).delay(400)}
          style={styles.quoteContainer}
        >
          <Text style={styles.quoteTextPt}>
            "Lâmpada para os meus pés é tua palavra e luz, para o meu caminho."
          </Text>
          <Text style={styles.quoteTextEn}>
            "Your word is a lamp for my feet, a light on my path."
          </Text>
          <Text style={styles.quoteRef}>SALMOS / PSALM 119:105</Text>
        </Animated.View>
      </View>

      {/* Bottom Button Area */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(600)}
        style={styles.footer}
      >
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }
          ]}
          onPress={() => router.push('/reader')}
        >
          <Text style={styles.buttonTextPt}>Começar a Ler</Text>
          <Text style={styles.buttonTextEn}>Start Reading</Text>
        </Pressable>
        <Text style={styles.infoText}>Português (KJA) • English (KJV)</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
