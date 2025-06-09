const connectDB = require('../config/database');
const { ObjectId } = require('mongodb');

exports.criarProduto = async (req, res) => {
  try {
    const {
      caminho,
      titulo,
      numeroSerie,
      descricao,
      registroAnvisa
    } = req.body;

    const caracteristicas = JSON.parse(req.body.caracteristicas || '[]');

    const imagemPrincipal = req.files['imagemPrincipal']?.[0] || null;
    const outrasImagens = req.files['outrasImagens'] || [];
    const video = req.files['video']?.[0] || null;
    const manualPdf = req.files['manualPdf']?.[0] || null;
    const especificacoesPdf = req.files['especificacoesPdf']?.[0] || null;

    // Exemplo de salvamento no MongoDB
    const produto = {
      caminho,
      titulo,
      numeroSerie,
      descricao,
      registroAnvisa,
      caracteristicas,
      imagemPrincipal: imagemPrincipal?.buffer, // ou salve como caminho
      outrasImagens: outrasImagens.map(img => img.buffer),
      video: video?.buffer,
      pdfs: {
        manual: manualPdf?.buffer,
        especificacoes: especificacoesPdf?.buffer
      }
    };

    // Salvar no banco (supondo que tenha um model)
    // await db.collection('produtos').insertOne(produto);

    res.status(201).json({ message: 'Produto salvo com sucesso!' });
  } catch (err) {
    console.error('[Produto] Erro ao salvar o produto:', err);
    res.status(500).send('Erro ao salvar o produto.');
  }
};



exports.listarProdutos = async (req, res) => {
  try {
    const db = await connectDB();

    // Pega page e limit da query string com valores padrão
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    // Calcula quantos documentos pular
    const skip = (page - 1) * limit;

    const produtos = await db.collection('produtos')
    .find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();


    // Conta total para frontend opcionalmente saber quantas páginas tem
    const total = await db.collection('produtos').countDocuments();

    res.json({
      produtos,
      paginaAtual: page,
      totalPaginas: Math.ceil(total / limit),
      totalItens: total,
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ message: 'Erro ao buscar produtos', error });
  }
};

exports.buscarProdutoPorId = async (req, res) => {
  try {
    const produtoId = req.params.id;
    console.log('ID recebido:', produtoId);

    if (!ObjectId.isValid(produtoId)) {
      console.log('ID inválido');
      return res.status(400).json({ message: 'ID inválido' });
    }

    const db = await connectDB();
    const produto = await db.collection('produtos').findOne({ _id: new ObjectId(produtoId) });

    if (!produto) {
      console.log('Produto não encontrado no banco');
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    console.log('Produto encontrado:', produto);
    res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar produto por ID', error });
  }
};




exports.atualizarProduto = async (req, res) => {
  try {
    const db = await connectDB();
    const produtoId = req.params.id;

    const resultado = await db.collection('produtos').updateOne(
      { _id: new ObjectId(produtoId) },
      { $set: req.body }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ message: 'Erro ao atualizar produto', error });
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    const db = await connectDB();
    const produtoId = req.params.id;

    const resultado = await db.collection('produtos').deleteOne({ _id: new ObjectId(produtoId) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({ message: 'Erro ao deletar produto', error });
  }
};
