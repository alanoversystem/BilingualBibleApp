import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export type ReadingBookmark = {
  bookId: number;
  bookNamePt: string;
  bookNameEn: string;
  chapter: number;
  timestamp: number;
};

const STORAGE_KEY = "@biblia_bilingue_last_read";

export async function saveLastRead(
  bookmark: Omit<ReadingBookmark, "timestamp">
): Promise<void> {
  try {
    const data: ReadingBookmark = {
      ...bookmark,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar progresso de leitura:", error);
  }
}

export async function getLastRead(): Promise<ReadingBookmark | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return JSON.parse(json) as ReadingBookmark;
  } catch (error) {
    console.error("Erro ao recuperar progresso de leitura:", error);
    return null;
  }
}

export function useLastRead() {
  const [lastRead, setLastReadState] = useState<ReadingBookmark | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const data = await getLastRead();
    setLastReadState(data);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  return { lastRead, loading, reload };
}
