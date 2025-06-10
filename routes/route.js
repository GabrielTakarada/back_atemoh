const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/controller');
const upload = require('../middleware/upload'); // objeto multer com storage configurado

// Upload múltiplos vídeos (até 3)
router.post('/produtos/upload-videos', upload.array('video', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Nenhum vídeo enviado.' });
  }
  const caminhos = req.files.map(file => `/uploads/videos/${file.filename}`);
  res.status(200).json({ caminhosVideos: caminhos });
});

// Upload de vários campos ao mesmo tempo (imagens, vídeos, PDFs)
const uploadCampos = upload.fields([
  { name: 'imagemPrincipal', maxCount: 1 },
  { name: 'outrasImagens', maxCount: 10 },
  { name: 'video', maxCount: 3 },
  { name: 'manualPdf', maxCount: 1 },
  { name: 'especificacoesPdf', maxCount: 1 },
]);

// Endpoint para criar produto com upload dos arquivos
router.post('/produtos', uploadCampos, produtoController.criarProduto);

// Outras rotas CRUD
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:id', produtoController.buscarProdutoPorId);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.deletarProduto);

module.exports = router;
