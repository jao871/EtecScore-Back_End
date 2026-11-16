import conexao from "../../connection.js";

async function createEquipe({ nomeEquipe, identificacao } = {}) {
  console.log("DAO de Equipes - create");

  const nome = String(nomeEquipe ?? "").trim();
  const ident = identificacao ? String(identificacao).trim() : null;

  if (!nome) {
    throw Object.assign(new Error("O nome da equipe é obrigatório."), { status: 400 });
  }
  if (nome.length > 100) {
    throw Object.assign(new Error("O nome da equipe deve ter no máximo 100 caracteres."), { status: 400 });
  }
  if (ident && ident.length > 100) {
    throw Object.assign(new Error("A identificação da equipe deve ter no máximo 100 caracteres."), { status: 400 });
  }

  const sql = `INSERT INTO tbEquipe (nomeEquipe, identificacao) VALUES (?, ?);`;

  try {
    const [result] = await conexao.query(sql, [nome, ident]);

    return {
      idEquipe: result.insertId,
      nomeEquipe: nome,
      identificacao: ident,
    };
  } catch (error) {
    console.error("Erro no DAO ao criar equipe:", error.message);
    throw error;
  }
}

export { createEquipe };