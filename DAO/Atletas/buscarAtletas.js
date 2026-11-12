import conexao from "../../connection.js";

async function buscarAtletas() {
  console.log("DAO de Atletas");

  const sql = `SELECT * FROM Atleta;`;

  try {
    const [rows] = await conexao.query(sql);
    return rows;
  } catch (error) {
    console.error("Erro no DAO ao buscar todos os atletas:", error.message);
    throw error;
  }
}


export { buscarAtletas };