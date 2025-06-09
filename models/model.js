const mongoose = require('mongoose');

const CaracteristicaSchema = new mongoose.Schema({
  subtitulo: String,
  descricoes: [String]
});

const ProdutoSchema = new mongoose.Schema({
  id: String,
  caminho: { type: String, required: true },
  caminhosVideos: [String], // array de vídeos
  manualPdf: String,         // caminho do PDF do manual
  especificacoesPdf: String, // caminho do PDF de especificações
  titulo: { type: String, required: true },
  imagens: [String], // base64
  numeroSerie: { type: String, required: true },
  descricao: { type: String, required: true },
  registroAnvisa: String,
  caracteristicas: [CaracteristicaSchema]
});

module.exports = mongoose.model('Produto', ProdutoSchema);
