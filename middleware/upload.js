const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurações do storage (igual ao que você tem)
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

module.exports = upload;  // exporta o objeto multer
