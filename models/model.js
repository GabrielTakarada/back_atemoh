// models/Produto.js
const mongoose = require('mongoose');

const CaracteristicaSchema = new mongoose.Schema({
  subtitulo: String,
  descricoes: [String]
});

const ProdutoSchema = new mongoose.Schema({
  id: String,
  caminho: { type: String, required: true },
  titulo: { type: String, required: true },
  imagens: [String], // base64
  numeroSerie: { type: String, required: true },
  descricao: { type: String, required: true },
  registroAnvisa: String,
  caracteristicas: [CaracteristicaSchema]
});

module.exports = mongoose.model('Produto', ProdutoSchema);
