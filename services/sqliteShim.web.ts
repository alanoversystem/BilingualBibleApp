// Generated static book index for Web & GitHub Pages
const books: Record<number, any> = {
  1: require('../assets/webData/book_1.json'),
  2: require('../assets/webData/book_2.json'),
  3: require('../assets/webData/book_3.json'),
  4: require('../assets/webData/book_4.json'),
  5: require('../assets/webData/book_5.json'),
  6: require('../assets/webData/book_6.json'),
  7: require('../assets/webData/book_7.json'),
  8: require('../assets/webData/book_8.json'),
  9: require('../assets/webData/book_9.json'),
  10: require('../assets/webData/book_10.json'),
  11: require('../assets/webData/book_11.json'),
  12: require('../assets/webData/book_12.json'),
  13: require('../assets/webData/book_13.json'),
  14: require('../assets/webData/book_14.json'),
  15: require('../assets/webData/book_15.json'),
  16: require('../assets/webData/book_16.json'),
  17: require('../assets/webData/book_17.json'),
  18: require('../assets/webData/book_18.json'),
  19: require('../assets/webData/book_19.json'),
  20: require('../assets/webData/book_20.json'),
  21: require('../assets/webData/book_21.json'),
  22: require('../assets/webData/book_22.json'),
  23: require('../assets/webData/book_23.json'),
  24: require('../assets/webData/book_24.json'),
  25: require('../assets/webData/book_25.json'),
  26: require('../assets/webData/book_26.json'),
  27: require('../assets/webData/book_27.json'),
  28: require('../assets/webData/book_28.json'),
  29: require('../assets/webData/book_29.json'),
  30: require('../assets/webData/book_30.json'),
  31: require('../assets/webData/book_31.json'),
  32: require('../assets/webData/book_32.json'),
  33: require('../assets/webData/book_33.json'),
  34: require('../assets/webData/book_34.json'),
  35: require('../assets/webData/book_35.json'),
  36: require('../assets/webData/book_36.json'),
  37: require('../assets/webData/book_37.json'),
  38: require('../assets/webData/book_38.json'),
  39: require('../assets/webData/book_39.json'),
  40: require('../assets/webData/book_40.json'),
  41: require('../assets/webData/book_41.json'),
  42: require('../assets/webData/book_42.json'),
  43: require('../assets/webData/book_43.json'),
  44: require('../assets/webData/book_44.json'),
  45: require('../assets/webData/book_45.json'),
  46: require('../assets/webData/book_46.json'),
  47: require('../assets/webData/book_47.json'),
  48: require('../assets/webData/book_48.json'),
  49: require('../assets/webData/book_49.json'),
  50: require('../assets/webData/book_50.json'),
  51: require('../assets/webData/book_51.json'),
  52: require('../assets/webData/book_52.json'),
  53: require('../assets/webData/book_53.json'),
  54: require('../assets/webData/book_54.json'),
  55: require('../assets/webData/book_55.json'),
  56: require('../assets/webData/book_56.json'),
  57: require('../assets/webData/book_57.json'),
  58: require('../assets/webData/book_58.json'),
  59: require('../assets/webData/book_59.json'),
  60: require('../assets/webData/book_60.json'),
  61: require('../assets/webData/book_61.json'),
  62: require('../assets/webData/book_62.json'),
  63: require('../assets/webData/book_63.json'),
  64: require('../assets/webData/book_64.json'),
  65: require('../assets/webData/book_65.json'),
  66: require('../assets/webData/book_66.json'),
};

const allBooksList = require("../assets/webData/books.json");

export const webDb = {
  getAllAsync: async (query: string, params: any[] = []) => {
    const q = query.trim().toUpperCase();
    if (q.includes("FROM LIVROS")) {
      return allBooksList.map((b: any) => ({
        id: b.id,
        ID: b.id,
        nome_pt: b.nome_pt,
        NOME_PT: b.nome_pt,
        nome_en: b.nome_en,
        NOME_EN: b.nome_en,
        sigla: b.sigla,
        SIGLA: b.sigla,
      }));
    }
    if (q.includes("DISTINCT CAPITULO")) {
      const bookId = Number(params[0]);
      const book = books[bookId];
      if (!book || !book.chapters) return [];
      return book.chapters.map((c: any) => ({ CAPITULO: c.capitulo }));
    }
    if (q.includes("FROM VERSICULOS")) {
      const bookId = Number(params[0]);
      const cap = Number(params[1]);
      const book = books[bookId];
      if (!book || !book.chapters) return [];
      const chapter = book.chapters.find((c: any) => c.capitulo === cap);
      return chapter ? chapter.verses : [];
    }
    return [];
  },
  getFirstAsync: async (query: string, params: any[] = []) => {
    const q = query.trim().toUpperCase();
    if (q.includes("FROM LIVROS")) {
      const bookId = Number(params[0]);
      const book = books[bookId];
      if (!book) return null;
      return {
        id: book.id,
        ID: book.id,
        nome_pt: book.nome_pt,
        NOME_PT: book.nome_pt,
        nome_en: book.nome_en,
        NOME_EN: book.nome_en,
        sigla: book.sigla,
        SIGLA: book.sigla,
      };
    }
    return null;
  },
};

export function useSQLiteContext() {
  return webDb;
}

export function SQLiteProvider({ children }: { children: React.ReactNode }) {
  return children;
}
