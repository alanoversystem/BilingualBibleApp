// metro.config.js
// 🧑‍🏫 Este arquivo configura o "empacotador" do Expo (Metro Bundler).
// O Metro é responsável por juntar todos os arquivos .tsx/.ts em um único
// bundle que o celular consegue executar.
//
// Aqui estamos dizendo ao Metro para IGNORAR a pasta app/data,
// pois ela contém arquivos Node.js (merge.js, .db) que não são
// compatíveis com o ambiente do celular.

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona app/data à lista de pastas que o Metro deve ignorar
config.resolver.blockList = [
  /app[/\\]data[/\\].*/,  // Ignora tudo dentro de app/data/
];

module.exports = config;
