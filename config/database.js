const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://gabrieltakarada:UxLyyY8DOuj10YZM@cluster0.yds9ruq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db = null;

async function connectDB() {
  try {
    if (!db) {
      await client.connect();
      db = client.db("meubanco"); // nome do seu banco
      console.log("🟢 Conectado ao MongoDB com sucesso!");
    }
    return db;
  } catch (err) {
    console.error("🔴 Erro ao conectar ao MongoDB:", err);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error("Banco de dados não conectado ainda");
  }
  return db;
}

module.exports = { connectDB, getDb };



// const uri = "mongodb+srv://gabrieltakarada:UxLyyY8DOuj10YZM@cluster0.yds9ruq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";