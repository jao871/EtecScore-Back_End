import conexao from "../../connection.js";

async function deleteAtletas(idAtleta) {
  console.log("DAO de Atletas - delete");

  const id = Number(idAtleta);

  if (!Number.isInteger(id) || id <= 0) {
    throw Object.assign(new Error("O id do atleta é inválido."), { status: 400 });
  }

  const sql = `DELETE FROM tbAtleta WHERE idAtleta = ?;`;

  let result;
  try {
    [result] = await conexao.query(sql, [id]);
  } catch (error) {
    // FK: o atleta já está inscrito em alguma equipe (tbInscricaoAtleta)
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw Object.assign(
        new Error("Não é possível excluir: o atleta está inscrito em equipes/competições. Remova esses vínculos antes."),
        { status: 409 }
      );
    }
    console.error("Erro no DAO ao deletar atleta:", error.message);
    throw error;
  }

  if (result.affectedRows === 0) {
    throw Object.assign(new Error("Atleta não encontrado."), { status: 404 });
  }

  return { idAtleta: id };
}

export { deleteAtletas };