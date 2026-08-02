// metro.config.js
// 🧑‍🏫 Este arquivo configura o "empacotador" do Expo (Metro Bundler).
// O Metro é responsável por juntar todos os arquivos .tsx/.ts em um único
// bundle que o celular consegue executar.

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Adiciona a extensão .db para que o Expo empacote o banco de dados
config.resolver.assetExts.push("db");

module.exports = config;
