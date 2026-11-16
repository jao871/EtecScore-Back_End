import conexao from "../../connection.js";

async function createAtletas({ nomeAtleta, dataNascimento, numeroMatricula } = {}) {
  console.log("DAO de Atletas - create");

  const nome = String(nomeAtleta ?? "").trim();
  const matricula = String(numeroMatricula ?? "").trim();
  const nascimento = dataNascimento ? String(dataNascimento).trim() : null;

  if (!nome) {
    throw Object.assign(new Error("O nome do atleta é obrigatório."), { status: 400 });
  }
  if (nome.length > 100) {
    throw Object.assign(new Error("O nome do atleta deve ter no máximo 100 caracteres."), { status: 400 });
  }
  if (!matricula) {
    throw Object.assign(new Error("O número de matrícula é obrigatório."), { status: 400 });
  }
  if (matricula.length > 30) {
    throw Object.assign(new Error("O número de matrícula deve ter no máximo 30 caracteres."), { status: 400 });
  }
  // Data opcional, no formato YYYY-MM-DD (o round-trip rejeita datas como 2008-02-31)
  if (nascimento) {
    const data = new Date(nascimento);
    if (isNaN(data) || data.toISOString().slice(0, 10) !== nascimento) {
      throw Object.assign(new Error("A data de nascimento deve ser válida, no formato AAAA-MM-DD."), { status: 400 });
    }
  }

  const sql = `INSERT INTO tbAtleta (nomeAtleta, dataNascimento, numeroMatricula) VALUES (?, ?, ?);`;

  try {
    const [result] = await conexao.query(sql, [nome, nascimento, matricula]);

    return {
      idAtleta: result.insertId,
      nomeAtleta: nome,
      dataNascimento: nascimento,
      numeroMatricula: matricula,
    };
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw Object.assign(new Error("Já existe um atleta cadastrado com essa matrícula."), { status: 409 });
    }
    console.error("Erro no DAO ao criar atleta:", error.message);
    throw error;
  }
}

export { createAtletas };