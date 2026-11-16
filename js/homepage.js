/**
    Este arquivo vai ter as functions que buscam os dados que seram exibidos na homepage
 */

import express from "express";
import conexao from "./connection.js";

const router = express.Router();

/**
 Rota: GET /api/home
 Utilidade: Busca as partidas para alimentar os cards principais
 */
router.get("/api/home", async (req, res) => {
    try {
        const sqlJogos = `
            SELECT p.idPartida, m.nomeModalidade, 
                   eqA.nomeEquipe AS equipeA, p.placarMandante AS placarA, 
                   eqV.nomeEquipe AS equipeB, p.placarVisitante AS placarB, 
                   p.statusPartida AS status
            FROM tbPartida p
            JOIN tbCompeticao c ON p.idComp = c.idComp
            JOIN tbModalidade m ON c.id_modalidade = m.idModalidade
            JOIN tbInscricaoEquipe inscA ON p.idInscricaoMandante = inscA.idInscricao
            JOIN tbEquipe eqA ON inscA.idEquipe = eqA.idEquipe
            JOIN tbInscricaoEquipe inscV ON p.idInscricaoVisitante = inscV.idInscricao
            JOIN tbEquipe eqV ON inscV.idEquipe = eqV.idEquipe
            LIMIT 3;
        `;

        // Faz consulta no mysql
        const [jogos] = await conexao.query(sqlJogos);

        return res.status(200).json({
            sucesso: true,
            jogos: jogos
        });

    } catch (error) {
        console.error("Erro ao carregar dados da home:", error);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: "Erro interno no servidor ao buscar jogos." 
        });
    }
});

/**
 Rota: GET /api/pesquisa?q=termo
 Descrição: Barra de pesquisa de busca global (equipes & jogadores) 
 */
router.get("/api/pesquisa", async (req, res) => {
    try {
        const termo = req.query.q; // Lê o que o usuario digitou na barra de pesquisa

        if (!termo) {
            return res.status(400).json({ 
                sucesso: false, 
                mensagem: "Nenhum termo de pesquisa fornecido." 
            });
        }

        const wildcard = `%${termo}%`;

        // Consulta 1: Pesquisar na tabela de Equipes
        const sqlEquipes = `
            SELECT idEquipe AS id, nomeEquipe AS nome, 'equipe' AS tipo 
            FROM tbEquipe 
            WHERE nomeEquipe LIKE ?;
        `;

        // Consulta 2: Pesquisar na tabela de Atletas
        const sqlAtletas = `
            SELECT idAtleta AS id, nomeAtleta AS nome, 'atleta' AS tipo 
            FROM tbAtleta 
            WHERE nomeAtleta LIKE ?;
        `;

        // Executa ambas as buscas na base de dados
        const [equipes] = await conexao.query(sqlEquipes, [wildcard]);
        const [atletas] = await conexao.query(sqlAtletas, [wildcard]);

        // Pesquisa em array de respostas
        const resultados = [...equipes, ...atletas];

        return res.status(200).json({
            sucesso: true,
            resultados: resultados
        });

    } catch (error) {
        console.error("Erro ao realizar pesquisa:", error);
        return res.status(500).json({ 
            sucesso: false, 
            mensagem: "Erro interno no servidor ao processar pesquisa." 
        });
    }
});

export default router;