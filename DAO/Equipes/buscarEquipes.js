import conexao from "../../connection.js";

async function buscarEquipes() {
  console.log("DAO de Equipes");

  const sql = `SELECT * FROM Equipe;`;

  try {
    const [rows] = await conexao.query(sql);
    return rows;
  } catch (error) {
    console.error("Erro no DAO ao buscar todos os Equipes:", error.message);
    throw error;
  }
}


export { buscarEquipes };