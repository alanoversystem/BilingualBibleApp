import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function BookScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  // Aqui pegamos o ID do livro que veio lá do reader.tsx
  const { id } = useLocalSearchParams();
  const db = useSQLiteContext();
  const [loading, setLoading] = useState(true);
  const [capitulos, setCapitulos] = useState<number[]>([]);
  const [capituloAtual, setCapituloAtual] = useState<number>(1);
  const [versiculos, setVersiculos] = useState<any[]>([]);
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Buscamos todos os capítulos que existem para esse livro
        // O DISTINCT garante que os números não se repitam
        const rawChapters = await db.getAllAsync<{ CAPITULO: number }>(
          "SELECT DISTINCT CAPITULO FROM VERSICULOS WHERE LIVRO_ID = ? ORDER BY CAPITULO ASC",
          [Number(id)],
        );
        const chapterNumbers = rawChapters.map((c) => c.CAPITULO);
        setCapitulos(chapterNumbers);
        // 2. Logo de cara, já buscamos os versículos do capítulo 1 (ou do capítulo atual)
        await loadVerses(capituloAtual);
      } catch (error) {
        console.error("Erro ao buscar dados do livro:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);
  // Função para buscar os versículos quando o usuário trocar de capítulo
  async function loadVerses(cap: number) {
    try {
      const verses = await db.getAllAsync(
        "SELECT * FROM VERSICULOS WHERE LIVRO_ID = ? AND CAPITULO = ? ORDER BY VERSICULO ASC",
        [Number(id), cap],
      );
      setVersiculos(verses);
    } catch (error) {
      console.error("Erro ao buscar versículos:", error);
    }
  }
  // Quando o usuário clicar em outro capítulo, atualizamos a tela
  const handleChapterChange = (cap: number) => {
    setCapituloAtual(cap);
    loadVerses(cap);
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#0B0F19" : "#F9FAFB",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    },
    backButton: {
      padding: 8,
      borderRadius: 10,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.03)",
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#F3F4F6" : "#111827",
    },
    chapterList: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    },
    chapterButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      backgroundColor: isDark
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(0, 0, 0, 0.05)",
    },
    chapterButtonActive: {
      backgroundColor: "#D4AF37",
    },
    chapterText: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    chapterTextActive: {
      color: "#0B0F19",
    },
    verseContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      marginBottom: 8,
    },
    verseNumber: {
      color: "#D4AF37",
      fontWeight: "700",
      fontSize: 14,
      marginBottom: 4,
    },
    textPt: {
      fontSize: 16,
      color: isDark ? "#F3F4F6" : "#111827",
      marginBottom: 6,
      lineHeight: 24,
    },
    textEn: {
      fontSize: 14,
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontStyle: "italic",
      lineHeight: 20,
    },
  });
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: styles.container.backgroundColor,
        }}
      >
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? "#F3F4F6" : "#111827"}
          />
        </Pressable>
        <Text style={styles.title}>Capítulo {capituloAtual}</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* Seletor de Capítulos (Horizontal) */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chapterList}
          data={capitulos}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.chapterButton,
                capituloAtual === item && styles.chapterButtonActive,
              ]}
              onPress={() => handleChapterChange(item)}
            >
              <Text
                style={[
                  styles.chapterText,
                  capituloAtual === item && styles.chapterTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
        />
      </View>
      {/* Lista de Versículos (Vertical) */}
      <FlatList
        data={versiculos}
        keyExtractor={(item) => item.VERSICULO.toString()}
        renderItem={({ item }) => (
          <View style={styles.verseContainer}>
            <Text style={styles.verseNumber}>{item.VERSICULO}</Text>
            <Text style={styles.textPt}>{item.TEXTO_PT}</Text>
            <Text style={styles.textEn}>{item.TEXTO_EN}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
