const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configura o destino dinamicamente conforme o campo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/outros';

    if (file.fieldname === 'imagemPrincipal' || file.fieldname === 'outrasImagens') {
      folder = 'uploads/imagens';
    } else if (file.fieldname === 'video') {
      folder = 'uploads/videos';
    } else if (file.fieldname === 'manualPdf' || file.fieldname === 'especificacoesPdf') {
      folder = 'uploads/pdfs';
    }

    // Garante que a pasta existe
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, nome);
  }
});

const upload = multer({ storage });

const uploadMiddleware = upload.fields([
  { name: 'imagemPrincipal', maxCount: 1 },
  { name: 'outrasImagens', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'manualPdf', maxCount: 1 },
  { name: 'especificacoesPdf', maxCount: 1 },
]);

module.exports = uploadMiddleware;
