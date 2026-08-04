const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const ptData = JSON.parse(fs.readFileSync("metaData/pt_KJA.json", "utf8").replace(/^\uFEFF/, ''));
const enData = JSON.parse(fs.readFileSync("metaData/en_KJV.json", "utf8").replace(/^\uFEFF/, ''));

const db = new sqlite3.Database("biblia_bilingue.db");

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS LIVROS (
        ID INTEGER PRIMARY KEY,
        NOME_PT TEXT,
        NOME_EN TEXT,
        SIGLA TEXT
        )`,
  );

  db.run(`
        CREATE TABLE IF NOT EXISTS VERSICULOS(
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        LIVRO_ID INTEGER,
        CAPITULO INTEGER,
        VERSICULO INTEGER,
        TEXTO_PT TEXT,
        TEXTO_EN TEXT,
        FOREIGN KEY(LIVRO_ID) REFERENCES LIVROS(ID)
        )
        `);
  console.log("Tabelas criadas com suscesso, Inserindo dados...");

  const stmtLivro = db.prepare(
    `INSERT INTO livros (id, nome_pt, nome_en, sigla) VALUES (?, ?, ?, ?)`,
  );
  const stmtVersiculo = db.prepare(
    `INSERT INTO versiculos (livro_id, capitulo, versiculo, texto_pt, texto_en) VALUES (?, ?, ?, ?, ?)`,
  );

  for (let i = 0; i < ptData.length; i++) {
    const livroPt = ptData[i];
    const livroEn = enData[i];
    const livroId = i + 1;

    stmtLivro.run(livroId, livroPt.name, livroEn.name, livroPt.abbrev);

    for (let c = 0; c < livroPt.chapters.length; c++) {
      const capPt = livroPt.chapters[c];
      const capEn = livroEn.chapters[c];
      const numCapitulo = c + 1;

      for (let v = 0; v < capPt.length; v++) {
        const numVersiculo = v + 1;
        const textoPt = capPt[v];
        const textoEn = capEn[v] || "";

        stmtVersiculo.run(livroId, numCapitulo, numVersiculo, textoPt, textoEn);
      }
    }
  }
  stmtLivro.finalize();
    stmtVersiculo.finalize();
    console.log("Banco 'biblia_bilingue.db' gerado com sucesso!");
});

db.close();
