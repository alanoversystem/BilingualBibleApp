import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReaderScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"bilingual" | "pt" | "en">(
    "bilingual",
  );
  const db = useSQLiteContext();

  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await db.getAllAsync("SELECT * FROM LIVROS");
        setBooks(data);
      } catch (error) {
        console.error(
          "Using fallback books list due to connection error",
          error,
        );
      } finally {
        setLoading(false);
      }
    }
    loadBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.nome_pt.toLowerCase().includes(search.toLowerCase()) ||
      book.nome_en.toLowerCase().includes(search.toLowerCase()) ||
      book.sigla.toLowerCase().includes(search.toLowerCase()),
  );

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
    headerTitleContainer: {
      alignItems: "center",
    },
    headerTitlePt: {
      fontSize: 18,
      fontWeight: "700",
      color: isDark ? "#F3F4F6" : "#111827",
    },
    headerTitleEn: {
      fontSize: 12,
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontStyle: "italic",
    },
    placeholderBtn: {
      width: 40,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      margin: 20,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: isDark ? "rgba(17, 24, 39, 0.8)" : "#FFFFFF",
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      height: 48,
      color: isDark ? "#F3F4F6" : "#111827",
      fontSize: 15,
    },
    modeSelector: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginBottom: 15,
      backgroundColor: isDark ? "rgba(17, 24, 39, 0.8)" : "#E5E7EB",
      borderRadius: 10,
      padding: 4,
    },
    modeButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 8,
    },
    modeButtonActive: {
      backgroundColor: "#D4AF37",
    },
    modeButtonText: {
      fontSize: 13,
      fontWeight: "600",
      color: isDark ? "#9CA3AF" : "#4B5563",
    },
    modeButtonTextActive: {
      color: "#0B0F19",
    },
    bookList: {
      paddingHorizontal: 20,
    },
    bookCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 14,
      backgroundColor: isDark ? "rgba(17, 24, 39, 0.5)" : "#FFFFFF",
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
    },
    bookSiglaContainer: {
      width: 44,
      height: 44,
      borderRadius: 10,
      backgroundColor: isDark
        ? "rgba(212, 175, 55, 0.12)"
        : "rgba(212, 175, 55, 0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 16,
      borderWidth: 1,
      borderColor: "rgba(212, 175, 55, 0.2)",
    },
    bookSiglaText: {
      color: "#D4AF37",
      fontWeight: "700",
      fontSize: 15,
    },
    bookNamesContainer: {
      flex: 1,
    },
    bookNamePt: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? "#F3F4F6" : "#111827",
    },
    bookNameEn: {
      fontSize: 13,
      color: isDark ? "#9CA3AF" : "#6B7280",
      fontStyle: "italic",
      marginTop: 2,
    },
    emptyContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyText: {
      color: isDark ? "#6B7280" : "#9CA3AF",
      fontSize: 15,
      marginTop: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={20}
            color={isDark ? "#F3F4F6" : "#111827"}
          />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitlePt}>Bíblia Bilíngue</Text>
          <Text style={styles.headerTitleEn}>Bilingual Bible</Text>
        </View>
        <View style={styles.placeholderBtn} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#D4AF37"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar livro... / Search book..."
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Language View Mode Selector */}
      <View style={styles.modeSelector}>
        <Pressable
          style={[
            styles.modeButton,
            viewMode === "bilingual" && styles.modeButtonActive,
          ]}
          onPress={() => setViewMode("bilingual")}
        >
          <Text
            style={[
              styles.modeButtonText,
              viewMode === "bilingual" && styles.modeButtonTextActive,
            ]}
          >
            Bilíngue / Both
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.modeButton,
            viewMode === "pt" && styles.modeButtonActive,
          ]}
          onPress={() => setViewMode("pt")}
        >
          <Text
            style={[
              styles.modeButtonText,
              viewMode === "pt" && styles.modeButtonTextActive,
            ]}
          >
            Português
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.modeButton,
            viewMode === "en" && styles.modeButtonActive,
          ]}
          onPress={() => setViewMode("en")}
        >
          <Text
            style={[
              styles.modeButtonText,
              viewMode === "en" && styles.modeButtonTextActive,
            ]}
          >
            English
          </Text>
        </Pressable>
      </View>

      {/* Book List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#D4AF37" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.bookList}>
          {filteredBooks.map((book) => (
            <Pressable
              key={book.id}
              style={({ pressed }) => [
                styles.bookCard,
                pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
              ]}
              onPress={() => router.push(`/book/${book.id}`)}
            >
              <View style={styles.bookSiglaContainer}>
                <Text style={styles.bookSiglaText}>{book.sigla}</Text>
              </View>
              <View style={styles.bookNamesContainer}>
                {viewMode !== "en" && (
                  <Text style={styles.bookNamePt}>{book.nome_pt}</Text>
                )}
                {viewMode !== "pt" && (
                  <Text style={styles.bookNameEn}>{book.nome_en}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
            </Pressable>
          ))}

          {filteredBooks.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="sad-outline"
                size={48}
                color={isDark ? "#4B5563" : "#D1D5DB"}
              />
              <Text style={styles.emptyText}>
                Nenhum livro encontrado / No books found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
