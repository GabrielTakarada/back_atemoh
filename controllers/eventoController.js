const connectDB = require('../config/database');
const { ObjectId } = require('mongodb');

// Criar um evento
exports.criarEvento = async (req, res) => {
  try {
    const db = await connectDB();
    const novoEvento = req.body;

    const resultado = await db.collection('eventos').insertOne(novoEvento);
    res.status(201).json({ message: 'Evento criado com sucesso', id: resultado.insertedId });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ message: 'Erro ao criar evento', error });
  }
};

// Listar todos os eventos
exports.listarEventos = async (req, res) => {
  try {
    const db = await connectDB();
    const eventos = await db.collection('eventos').find().toArray();
    res.json(eventos);
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    res.status(500).json({ message: 'Erro ao listar eventos', error });
  }
};

// Buscar um evento por ID
exports.buscarEventoPorId = async (req, res) => {
  try {
    const db = await connectDB();
    const eventoId = req.params.id;
    const evento = await db.collection('eventos').findOne({ _id: new ObjectId(eventoId) });

    if (!evento) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ message: 'Erro ao buscar evento', error });
  }
};

// Atualizar evento
exports.atualizarEvento = async (req, res) => {
  try {
    const db = await connectDB();
    const eventoId = req.params.id;

    const resultado = await db.collection('eventos').updateOne(
      { _id: new ObjectId(eventoId) },
      { $set: req.body }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ message: 'Erro ao atualizar evento', error });
  }
};

// Deletar evento
exports.deletarEvento = async (req, res) => {
  try {
    const db = await connectDB();
    const eventoId = req.params.id;

    const resultado = await db.collection('eventos').deleteOne({ _id: new ObjectId(eventoId) });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento removido com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    res.status(500).json({ message: 'Erro ao deletar evento', error });
  }
};
