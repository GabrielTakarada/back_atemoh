const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/controller');
const multer = require('multer');

const multer = require('multer');
const path = require('path');

// Armazenamento com diskStorage e separação por tipo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'imagemPrincipal' || file.fieldname === 'outrasImagens') {
      cb(null, 'uploads/imagens');
    } else if (file.fieldname === 'video') {
      cb(null, 'uploads/videos');
    } else if (file.fieldname === 'manualPdf' || file.fieldname === 'especificacoesPdf') {
      cb(null, 'uploads/pdfs');
    } else {
      cb(null, 'uploads/outros');
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

const uploadCampos = upload.fields([
  { name: 'imagemPrincipal', maxCount: 1 },
  { name: 'outrasImagens', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'manualPdf', maxCount: 1 },
  { name: 'especificacoesPdf', maxCount: 1 }
]);


// 📌 Endpoint principal de criação com campos e arquivos
router.post('/produtos', uploadCampos, produtoController.criarProduto);

// Outras rotas
router.get('/produtos', produtoController.listarProdutos);
router.get('/produtos/:id', produtoController.buscarProdutoPorId);
router.put('/produtos/:id', produtoController.atualizarProduto);
router.delete('/produtos/:id', produtoController.deletarProduto);

// Rotas separadas (se quiser manter uploads separados)
router.post('/produtos/upload-videos', require('../middleware/uploadVideo').array('videos', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Nenhum vídeo enviado.' });
  }
  const caminhos = req.files.map(file => `/uploads/videos/${file.filename}`);
  res.status(200).json({ caminhosVideos: caminhos });
});

router.post('/produtos/upload-pdf-manual', require('../middleware/uploadPdf').single('manual'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  res.status(200).json({ manualPdf: `/uploads/pdfs/${req.file.filename}` });
});

router.post('/produtos/upload-pdf-especificacoes', require('../middleware/uploadPdf').single('especificacoes'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
  res.status(200).json({ especificacoesPdf: `/uploads/pdfs/${req.file.filename}` });
});

module.exports = router;
