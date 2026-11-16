import conexao from "../../connection.js";

/**
 * Busca as equipes vindas do SQL
 */
export async function gerarChaveMataMata(idComp) {
  try {
    // 1. Busca as equipes inscritas e ativas já embaralhadas pelo próprio MySQL (ORDER BY RAND())
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

    // 2. Agrupa as equipes em competições de 2x2 
    const confrontos = [];

    for (let i = 0; i < equipesSorteadas.length; i += 2) {
      const mandante = equipesSorteadas[i];
      const visitante = equipesSorteadas[i + 1];

      confrontos.push({
        jogo: (i / 2) + 1,
        idComp: Number(idComp),
        
        // Mandante
        idInscricaoMandante: mandante.idInscricao,
        nomeMandante: mandante.nomeEquipe,
        placarMandante: 0,

        // Visitante
        idInscricaoVisitante: visitante ? visitante.idInscricao : null,
        nomeVisitante: visitante ? visitante.nomeEquipe : "BYE (Avança direto)",
        placarVisitante: 0,

        statusPartida: visitante ? "Agendado" : "W.O."
      });
    }

    return confrontos;

  } catch (erro) {
    console.error("Erro ao gerar chave do mata-mata:", erro.message);
    throw erro;
  }
}




/**
 * Ordena as equipes por pontuação (maior para menor)
 */
export function renderizarRanking(equipes) {
    // 1. Ordena o array por pontos em ordem decrescente
    const rankingOrdenado = [...equipes].sort((a, b) => b.pontos - a.pontos);
  
    // 2. Define as classes do pódio (1º Ouro, 2º Prata, 3º Bronze)
    const classesPodio = {
      0: "podio-primeiro", // 1º Lugar
      1: "podio-segundo",  // 2º Lugar
      2: "podio-terceiro"  // 3º Lugar
    };
  
    const containerPodio = document.getElementById("container-podio");
    containerPodio.innerHTML = "";
  
    // Ordem visual do pódio na sua tela: 2º na esquerda, 1º no meio, 3º na direita
    const ordemVisualPodio = [1, 0, 2];
  
    ordemVisualPodio.forEach((indexRanking) => {
      const time = rankingOrdenado[indexRanking];
      if (!time) return; 
  
      const posicao = indexRanking + 1;
      const classePodio = classesPodio[indexRanking];
  
      const blocoPodio = document.createElement("div");
      blocoPodio.className = `bloco-podio ${classePodio}`;
  
      blocoPodio.innerHTML = `
        <span class="nome-equipe-podio" style="cursor: pointer;">${time.nomeEquipe}</span>
        <div class="degrau-podio">${posicao}</div>
      `;
  
      // Redireciona para o profile do time ao clicar no nome
      const spanNome = blocoPodio.querySelector(".nome-equipe-podio");
      spanNome.addEventListener("click", () => {
        window.location.href = `/equipes/perfil.html?id=${time.idEquipe}`;
      });
  
      containerPodio.appendChild(blocoPodio);
    });

    const tbodyRanking = document.getElementById("tbody-ranking");
    tbodyRanking.innerHTML = "";
  
    rankingOrdenado.forEach((time, index) => {
      const posicao = index + 1;
      const classeDestaque = classesPodio[index] || "ranking-comum";
  
      const tr = document.createElement("tr");
      tr.className = `linha-ranking ${classeDestaque}`;
  
      tr.innerHTML = `
        <td>${posicao}</td>
        <td class="celula-nome-time" style="cursor: pointer;">${time.nomeEquipe}</td>
        <td>${time.pontos}</td>
      `;
  
      // Redireciona para o profile do time ao clicar no nome na tabela
      const tdNome = tr.querySelector(".celula-nome-time");
      tdNome.addEventListener("click", () => {
        window.location.href = `/equipes/perfil.html?id=${time.idEquipe}`;
      });
  
      tbodyRanking.appendChild(tr);
    });
  }
  