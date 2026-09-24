import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLastRead } from "../services/readingStorage";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { lastRead, reload } = useLastRead();

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0B0F19" : "#F9FAFB",
      justifyContent: "space-between",
    },
    header: {
      alignItems: "center",
      marginTop: 24,
      paddingHorizontal: 24,
    },
    tag: {
      backgroundColor: isDark
        ? "rgba(212, 175, 55, 0.15)"
        : "rgba(212, 175, 55, 0.1)",
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(212, 175, 55, 0.3)"
        : "rgba(212, 175, 55, 0.2)",
      marginBottom: 12,
    },
    tagText: {
      color: "#D4AF37",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },
    titlePt: {
      fontSize: 32,
      fontWeight: "bold",
      color: isDark ? "#F3F4F6" : "#111827",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    titleEn: {
      fontSize: 22,
      fontStyle: "italic",
      fontWeight: "300",
      color: isDark ? "#9CA3AF" : "#4B5563",
      textAlign: "center",
      marginTop: 4,
    },
    centerArea: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 28,
    },
    iconContainer: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: isDark ? "rgba(30, 41, 59, 0.7)" : "#FFFFFF",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#D4AF37",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: 12,
      elevation: 6,
      marginBottom: 24,
      borderWidth: 1.5,
      borderColor: "rgba(212, 175, 55, 0.4)",
    },
    quoteContainer: {
      backgroundColor: isDark
        ? "rgba(17, 24, 39, 0.6)"
        : "rgba(243, 244, 246, 0.8)",
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
      width: "100%",
    },
    quoteTextPt: {
      fontSize: 14.5,
      color: isDark ? "#E5E7EB" : "#374151",
      textAlign: "center",
      lineHeight: 22,
      fontWeight: "400",
    },
    quoteTextEn: {
      fontSize: 13,
      color: isDark ? "#9CA3AF" : "#6B7280",
      textAlign: "center",
      lineHeight: 19,
      fontStyle: "italic",
      marginTop: 6,
    },
    quoteRef: {
      fontSize: 11.5,
      color: "#D4AF37",
      textAlign: "center",
      marginTop: 10,
      fontWeight: "600",
      letterSpacing: 1,
    },
    footer: {
      paddingHorizontal: 24,
      marginBottom: 24,
      alignItems: "center",
      gap: 12,
    },
    continueCard: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      backgroundColor: isDark
        ? "rgba(212, 175, 55, 0.12)"
        : "rgba(212, 175, 55, 0.1)",
      borderWidth: 1,
      borderColor: "rgba(212, 175, 55, 0.35)",
    },
    continueTextTitle: {
      fontSize: 11,
      fontWeight: "700",
      color: "#D4AF37",
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    continueTextDesc: {
      fontSize: 15,
      fontWeight: "700",
      color: isDark ? "#F3F4F6" : "#111827",
      marginTop: 2,
    },
    button: {
      backgroundColor: "#D4AF37",
      paddingVertical: 16,
      borderRadius: 14,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#D4AF37",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 4,
    },
    buttonTextPt: {
      color: "#0B0F19",
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    buttonTextEn: {
      color: "#0B0F19",
      fontSize: 12,
      fontWeight: "500",
      opacity: 0.8,
      marginTop: 1,
    },
    infoText: {
      color: isDark ? "#6B7280" : "#9CA3AF",
      fontSize: 12,
      textAlign: "center",
    },
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
          <Ionicons name="book-outline" size={54} color="#D4AF37" />
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
        {lastRead && (
          <Pressable
            style={({ pressed }) => [
              styles.continueCard,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => {
              router.push({
                pathname: `/book/${lastRead.bookId}` as any,
                params: {
                  initialChapter: lastRead.chapter.toString(),
                },
              });
            }}
          >
            <View>
              <Text style={styles.continueTextTitle}>
                Continuar Leitura / Resume
              </Text>
              <Text style={styles.continueTextDesc}>
                {lastRead.bookNamePt} {lastRead.chapter}
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "400",
                    color: isDark ? "#9CA3AF" : "#6B7280",
                  }}
                >
                  {" "}
                  ({lastRead.bookNameEn})
                </Text>
              </Text>
            </View>
            <Ionicons name="arrow-forward-circle" size={28} color="#D4AF37" />
          </Pressable>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.push("/reader")}
        >
          <Text style={styles.buttonTextPt}>
            {lastRead ? "Explorar Livros" : "Começar a Ler"}
          </Text>
          <Text style={styles.buttonTextEn}>
            {lastRead ? "Explore All Books" : "Start Reading"}
          </Text>
        </Pressable>
        <Text style={styles.infoText}>Português (KJA) • English (KJV)</Text>
      </Animated.View>
    </SafeAreaView>
  );
}
