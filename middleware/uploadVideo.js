// middleware/uploadVideo.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const pasta = 'uploads/videos';

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
  limits: { fileSize: 50 * 1024 * 1024 }, // até 50MB por vídeo
  fileFilter: (req, file, cb) => {
    const tiposAceitos = /mp4|avi|mov|wmv|mkv/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (tiposAceitos.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado.'));
    }
  }
});

module.exports = upload;
