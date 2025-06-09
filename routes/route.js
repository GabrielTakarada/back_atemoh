const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/controller');
const uploadVideo = require('../middleware/uploadVideo');
const uploadPdf = require('../middleware/uploadPdf');

// CRUD
router.post('/produtos', produtoController.criarProduto);
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:id', produtoController.buscarProdutoPorId);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.deletarProduto);

// Upload de vídeos (até 3)
router.post('/produtos/upload-videos', uploadVideo.array('videos', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Nenhum vídeo enviado.' });
  }

  const caminhos = req.files.map(file => `/uploads/videos/${file.filename}`);
  res.status(200).json({ caminhosVideos: caminhos });
});

// Upload de PDF do manual
router.post('/produtos/upload-pdf-manual', uploadPdf.single('manual'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  const caminhoManual = `/uploads/pdfs/${req.file.filename}`;
  res.status(200).json({ manualPdf: caminhoManual });
});

// Upload de PDF das especificações
router.post('/produtos/upload-pdf-especificacoes', uploadPdf.single('especificacoes'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  }

  const caminhoEspecificacoes = `/uploads/pdfs/${req.file.filename}`;
  res.status(200).json({ especificacoesPdf: caminhoEspecificacoes });
});

module.exports = router;
