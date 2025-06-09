const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { connectDB } = require('./config/database'); // note que aqui deve ser desestruturado, pois exportamos objeto
const produtoRoutes = require('./routes/route');
const eventosRoutes = require('./routes/events');

const app = express();

// ✅ Garante que as pastas de upload existem
const pastas = ['uploads/imagens', 'uploads/videos', 'uploads/pdfs', 'uploads/outros'];
pastas.forEach(pasta => {
  const fullPath = path.join(__dirname, pasta);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Criada pasta: ${fullPath}`);
  }
});

// Função para configurar middlewares e rotas
function configurarApp() {
  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));
  app.use('/uploads', express.static('uploads'));

  app.use('/api', produtoRoutes);
  app.use('/api', eventosRoutes);

  app.get('/', (req, res) => {
    res.send('API funcionando corretamente!');
  });
}

// Conectar ao banco e iniciar servidor
connectDB()
  .then(() => {
    configurarApp();

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco e iniciar servidor:', err);
    process.exit(1);
  });
