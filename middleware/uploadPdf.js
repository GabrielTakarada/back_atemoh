// middlewares/uploadPdf.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pasta = 'uploads/pdfs';

if (!fs.existsSync(pasta)) {
  fs.mkdirSync(pasta, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, pasta);
  },
  filename: function (req, file, cb) {
    const nomeUnico = `${Date.now()}-${file.originalname}`;
    cb(null, nomeUnico);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const tiposAceitos = /pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (tiposAceitos.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos.'));
    }
  }
});

module.exports = upload;
