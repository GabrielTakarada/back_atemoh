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


app.use('/api', produtoRoutes);
app.use('/api', eventosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
