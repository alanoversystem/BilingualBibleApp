import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveLastRead } from "../../services/readingStorage";

export default function BookScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // ID do livro e capítulo inicial opcional vindos via rota
  const { id, initialChapter } = useLocalSearchParams<{
    id: string;
    initialChapter?: string;
  }>();
  const bookIdNumber = Number(id);

  const db = useSQLiteContext();
  const [loading, setLoading] = useState(true);
  const [bookInfo, setBookInfo] = useState<{
    NOME_PT: string;
    NOME_EN: string;
  } | null>(null);
  const [capitulos, setCapitulos] = useState<number[]>([]);
  const [capituloAtual, setCapituloAtual] = useState<number>(
    initialChapter ? Number(initialChapter) : 1
  );
  const [versiculos, setVersiculos] = useState<any[]>([]);

  // Preferências do leitor
  const [fontSize, setFontSize] = useState<number>(16);
  const [themeMode, setThemeMode] = useState<"auto" | "sepia">("auto");
  const [readingMode, setReadingMode] = useState<"both" | "pt" | "en">("both");
  const [showSettings, setShowSettings] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const chapterSelectorRef = useRef<FlatList>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // 1. Busca metadados do livro
        const bookData = await db.getFirstAsync<{
          NOME_PT: string;
          NOME_EN: string;
        }>(
          "SELECT NOME_PT, NOME_EN FROM LIVROS WHERE ID = ?",
          [bookIdNumber]
        );
        setBookInfo(bookData ?? null);

        // 2. Busca lista de capítulos disponíveis
        const rawChapters = await db.getAllAsync<{ CAPITULO: number }>(
          "SELECT DISTINCT CAPITULO FROM VERSICULOS WHERE LIVRO_ID = ? ORDER BY CAPITULO ASC",
          [bookIdNumber]
        );
        const chapterNumbers = rawChapters.map((c) => c.CAPITULO);
        setCapitulos(chapterNumbers);

        // 3. Carrega os versículos do capítulo
        const startChapter = initialChapter ? Number(initialChapter) : 1;
        setCapituloAtual(startChapter);
        await loadVerses(startChapter, bookData?.NOME_PT, bookData?.NOME_EN);
      } catch (error) {
        console.error("Erro ao buscar dados do livro:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  async function loadVerses(
    cap: number,
    namePt?: string,
    nameEn?: string
  ) {
    try {
      const verses = await db.getAllAsync(
        "SELECT * FROM VERSICULOS WHERE LIVRO_ID = ? AND CAPITULO = ? ORDER BY VERSICULO ASC",
        [bookIdNumber, cap]
      );
      setVersiculos(verses);

      // Salva no cache a última posição lida
      const ptName = namePt || bookInfo?.NOME_PT || `Livro ${bookIdNumber}`;
      const enName = nameEn || bookInfo?.NOME_EN || `Book ${bookIdNumber}`;
      saveLastRead({
        bookId: bookIdNumber,
        bookNamePt: ptName,
        bookNameEn: enName,
        chapter: cap,
      });
    } catch (error) {
      console.error("Erro ao buscar versículos:", error);
    }
  }

  const handleChapterChange = (cap: number) => {
    setCapituloAtual(cap);
    loadVerses(cap);
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
  };

  // Navegação de páginas (Estilo Livro)
  const currentIndex = capitulos.indexOf(capituloAtual);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex >= 0 && currentIndex < capitulos.length - 1;

  const goToPrevChapter = () => {
    if (canGoPrev) {
      const prevCap = capitulos[currentIndex - 1];
      handleChapterChange(prevCap);
      chapterSelectorRef.current?.scrollToIndex({
        index: Math.max(0, currentIndex - 1),
        animated: true,
      });
    }
  };

  const goToNextChapter = () => {
    if (canGoNext) {
      const nextCap = capitulos[currentIndex + 1];
      handleChapterChange(nextCap);
      chapterSelectorRef.current?.scrollToIndex({
        index: Math.min(capitulos.length - 1, currentIndex + 1),
        animated: true,
      });
    }
  };

  // Paleta de cores dinâmica (Auto vs Sépia de Livro)
  const isSepia = themeMode === "sepia";
  const bgColor = isSepia ? "#F4ECD8" : isDark ? "#0B0F19" : "#F9FAFB";
  const headerBg = isSepia ? "#EDE3C8" : isDark ? "#0F172A" : "#FFFFFF";
  const textColorPt = isSepia ? "#2B2118" : isDark ? "#F3F4F6" : "#111827";
  const textColorEn = isSepia ? "#655342" : isDark ? "#9CA3AF" : "#6B7280";
  const borderColor = isSepia
    ? "#D8C7A3"
    : isDark
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.06)";

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: bgColor,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderColor: borderColor,
        },
        backButton: {
          padding: 8,
          borderRadius: 10,
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.03)",
        },
        titleContainer: {
          alignItems: "center",
        },
        title: {
          fontSize: 17,
          fontWeight: "700",
          color: textColorPt,
        },
        subTitle: {
          fontSize: 11,
          fontWeight: "600",
          color: "#D4AF37",
          letterSpacing: 0.8,
        },
        headerRightBtn: {
          padding: 8,
          borderRadius: 10,
        },
        chapterList: {
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: headerBg,
          borderBottomWidth: 1,
          borderColor: borderColor,
        },
        chapterButton: {
          width: 44,
          height: 44,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        },
        chapterButtonActive: {
          backgroundColor: "#D4AF37",
        },
        chapterText: {
          fontSize: 15,
          fontWeight: "600",
          color: isDark ? "#9CA3AF" : "#6B7280",
        },
        chapterTextActive: {
          color: "#0B0F19",
          fontWeight: "700",
        },
        verseContainer: {
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: borderColor,
        },
        verseNumber: {
          color: "#D4AF37",
          fontWeight: "800",
          fontSize: 13,
          marginBottom: 4,
        },
        textPt: {
          fontSize: fontSize,
          color: textColorPt,
          marginBottom: 6,
          lineHeight: fontSize * 1.6,
        },
        textEn: {
          fontSize: fontSize * 0.92,
          color: textColorEn,
          fontStyle: "italic",
          lineHeight: fontSize * 1.5,
        },
        footerPagination: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: headerBg,
          borderTopWidth: 1,
          borderColor: borderColor,
        },
        pageBtn: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 10,
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.05)",
        },
        pageBtnDisabled: {
          opacity: 0.3,
        },
        pageBtnText: {
          fontSize: 13,
          fontWeight: "600",
          color: textColorPt,
        },
        pageIndicatorText: {
          fontSize: 13,
          fontWeight: "700",
          color: "#D4AF37",
        },
        modalOverlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        },
        modalSheet: {
          backgroundColor: headerBg,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: "700",
          color: textColorPt,
          marginBottom: 16,
        },
        settingRow: {
          marginBottom: 16,
        },
        settingLabel: {
          fontSize: 13,
          fontWeight: "600",
          color: textColorEn,
          marginBottom: 8,
        },
        optionsRow: {
          flexDirection: "row",
          gap: 10,
        },
        optionPill: {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: borderColor,
        },
        optionPillActive: {
          backgroundColor: "#D4AF37",
          borderColor: "#D4AF37",
        },
        optionPillText: {
          fontSize: 13,
          fontWeight: "600",
          color: textColorPt,
        },
        optionPillTextActive: {
          color: "#0B0F19",
          fontWeight: "700",
        },
      }),
    [bgColor, headerBg, textColorPt, textColorEn, borderColor, fontSize, isDark, isSepia]
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: bgColor,
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
          <Ionicons name="arrow-back" size={20} color={textColorPt} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {bookInfo?.NOME_PT || "Livro"} {capituloAtual}
          </Text>
          <Text style={styles.subTitle}>
            {bookInfo?.NOME_EN?.toUpperCase() || ""} {capituloAtual}
          </Text>
        </View>
        <Pressable
          style={styles.headerRightBtn}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons name="options-outline" size={22} color="#D4AF37" />
        </Pressable>
      </View>

      {/* Seletor de Capítulos (Horizontal) */}
      <View>
        <FlatList
          ref={chapterSelectorRef}
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
        ref={flatListRef}
        data={versiculos}
        keyExtractor={(item) => item.VERSICULO.toString()}
        renderItem={({ item }) => (
          <View style={styles.verseContainer}>
            <Text style={styles.verseNumber}>{item.VERSICULO}</Text>
            {(readingMode === "both" || readingMode === "pt") && (
              <Text style={styles.textPt}>{item.TEXTO_PT}</Text>
            )}
            {(readingMode === "both" || readingMode === "en") && (
              <Text style={styles.textEn}>{item.TEXTO_EN}</Text>
            )}
          </View>
        )}
      />

      {/* Navegação de Páginas (Estilo Livro) */}
      <View style={styles.footerPagination}>
        <Pressable
          style={[styles.pageBtn, !canGoPrev && styles.pageBtnDisabled]}
          disabled={!canGoPrev}
          onPress={goToPrevChapter}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color={textColorPt}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.pageBtnText}>Anterior</Text>
        </Pressable>

        <Text style={styles.pageIndicatorText}>
          Capítulo {capituloAtual} / {capitulos.length}
        </Text>

        <Pressable
          style={[styles.pageBtn, !canGoNext && styles.pageBtnDisabled]}
          disabled={!canGoNext}
          onPress={goToNextChapter}
        >
          <Text style={styles.pageBtnText}>Próximo</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={textColorPt}
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>

      {/* Modal de Preferências de Leitura */}
      <Modal visible={showSettings} transparent animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSettings(false)}
        >
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Preferências de Leitura</Text>

            {/* Tamanho da Fonte */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Tamanho da Fonte</Text>
              <View style={styles.optionsRow}>
                {[14, 16, 18, 20, 22].map((size) => (
                  <Pressable
                    key={size}
                    style={[
                      styles.optionPill,
                      fontSize === size && styles.optionPillActive,
                    ]}
                    onPress={() => setFontSize(size)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        fontSize === size && styles.optionPillTextActive,
                      ]}
                    >
                      {size}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Modo de Leitura */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Visualização de Idiomas</Text>
              <View style={styles.optionsRow}>
                {[
                  { id: "both", label: "Bilíngue" },
                  { id: "pt", label: "Português" },
                  { id: "en", label: "Inglês" },
                ].map((opt) => (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.optionPill,
                      readingMode === opt.id && styles.optionPillActive,
                    ]}
                    onPress={() => setReadingMode(opt.id as any)}
                  >
                    <Text
                      style={[
                        styles.optionPillText,
                        readingMode === opt.id && styles.optionPillTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tema Visual */}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Tema de Conforto Visual</Text>
              <View style={styles.optionsRow}>
                <Pressable
                  style={[
                    styles.optionPill,
                    themeMode === "auto" && styles.optionPillActive,
                  ]}
                  onPress={() => setThemeMode("auto")}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      themeMode === "auto" && styles.optionPillTextActive,
                    ]}
                  >
                    Padrão
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.optionPill,
                    themeMode === "sepia" && styles.optionPillActive,
                  ]}
                  onPress={() => setThemeMode("sepia")}
                >
                  <Text
                    style={[
                      styles.optionPillText,
                      themeMode === "sepia" && styles.optionPillTextActive,
                    ]}
                  >
                    📖 Sépia Livro
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[
                styles.optionPill,
                {
                  backgroundColor: "#D4AF37",
                  borderColor: "#D4AF37",
                  marginTop: 8,
                  alignItems: "center",
                  paddingVertical: 12,
                },
              ]}
              onPress={() => setShowSettings(false)}
            >
              <Text style={{ color: "#0B0F19", fontWeight: "700" }}>Fechar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
