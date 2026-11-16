import conexao from "../../connection.js";

async function deleteEquipe(idEquipe) {
  console.log("DAO de Equipes - delete");

  const id = Number(idEquipe);

  if (!Number.isInteger(id) || id <= 0) {
    throw Object.assign(new Error("O id da equipe é inválido."), { status: 400 });
  }

  const sql = `DELETE FROM tbEquipe WHERE idEquipe = ?;`;

  let result;
  try {
    [result] = await conexao.query(sql, [id]);
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw Object.assign(
        new Error("Não é possível excluir: a equipe está inscrita em competições/partidas. Remova esses vínculos antes."),
        { status: 409 }
      );
    }
    console.error("Erro no DAO ao deletar equipe:", error.message);
    throw error;
  }

  if (result.affectedRows === 0) {
    throw Object.assign(new Error("Equipe não encontrada."), { status: 404 });
  }

  return { idEquipe: id };
}

export { deleteEquipe };