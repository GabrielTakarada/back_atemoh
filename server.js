const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const produtoRoutes = require('./routes/route');
const eventosRoutes = require('./routes/events');


const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/uploads', express.static('uploads'));



app.use('/api', produtoRoutes);
app.use('/api', eventosRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando corretamente!');
});


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
