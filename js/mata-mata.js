import conexao from "../../connection.js";

/**
 * Busca as equipes ativas da competição e monta os confrontos do mata-mata (2x2).
 */
export async function gerarChaveMataMata(idComp) {
  const sql = `
    SELECT 
      ie.idInscricao,
      ie.idComp,
      e.idEquipe,
      e.nomeEquipe,
      e.identificacao
    FROM tbInscricaoEquipe ie
    INNER JOIN tbEquipe e ON ie.idEquipe = e.idEquipe
    WHERE ie.idComp = ? AND ie.statusInscricao = 'Ativo'
    ORDER BY RAND()
  `;

  const [equipesSorteadas] = await conexao.query(sql, [idComp]);
  const confrontos = [];

  for (let i = 0; i < equipesSorteadas.length; i += 2) {
    const mandante = equipesSorteadas[i];
    const visitante = equipesSorteadas[i + 1];

    confrontos.push({
      jogo: i / 2 + 1,
      idComp: Number(idComp),
      idInscricaoMandante: mandante.idInscricao,
      nomeMandante: mandante.nomeEquipe,
      placarMandante: 0,
      idInscricaoVisitante: visitante ? visitante.idInscricao : null,
      nomeVisitante: visitante ? visitante.nomeEquipe : "BYE (Avança direto)",
      placarVisitante: 0,
      statusPartida: visitante ? "Agendado" : "W.O."
    });
  }

  return confrontos;
}

/**
 * Ordena uma lista de equipes por pontuação (maior para menor)
 */
export function ordenarRankingEquipes(equipes) {
  return [...equipes]
    .sort((a, b) => Number(b.pontos ?? 0) - Number(a.pontos ?? 0))
    .map((equipe, index) => ({
      ...equipe,
      posicao: index + 1
    }));
}

