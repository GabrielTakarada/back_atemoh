const connectDB = require('../config/database');
const { ObjectId } = require('mongodb');

exports.criarProduto = async (req, res) => {
  try {
    const db = await connectDB();
    const resultado = await db.collection('produtos').insertOne(req.body);
    res.status(201).json({ _id: resultado.insertedId, ...req.body });
  } catch (error) {
    console.error('Erro ao salvar o produto:', error);
    res.status(500).json({ message: 'Erro ao salvar o produto', error });
  }
};

exports.listarProdutos = async (req, res) => {
  try {
    const db = await connectDB();
    const produtos = await db.collection('produtos').find().toArray();
    res.json(produtos);
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
