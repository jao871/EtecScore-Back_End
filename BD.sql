CREATE DATABASE db_etecscore 

USE db_etecscore

CREATE TABLE tbUsuario ( idUsuario INT PRIMARY KEY AUTO_INCREMENT, nomeUsuario VARCHAR(100) NOT NULL, emailUsuario VARCHAR (150) NOT NULL, senhaHash VARCHAR(255) NOT NULL, perfilAcesso VARCHAR(50) );

CREATE TABLE tbModalidade ( idModalidade INT PRIMARY KEY AUTO_INCREMENT, nomeModalidade VARCHAR(100) NOT NULL, descricao VARCHAR(200) );

CREATE TABLE tbCompeticao ( idComp INT PRIMARY KEY AUTO_INCREMENT, nomeComp VARCHAR(100) NOT NULL, statusModalidade VARCHAR(30), CONSTRAINT fk_id_modalidade FOREIGN KEY (id_modalidade) REFERENCES tbModalidade(idModalidade) );

CREATE TABLE tbEquipe ( idEquipe INT PRIMARY KEY AUTO_INCREMENT, nomeEquipe VARCHAR(100) NOT NULL, identificacao VARCHAR(100) );

CREATE TABLE tbInscricaoEquipe ( idInscricao INT PRIMARY KEY AUTO_INCREMENT, idComp INT NOT NULL, idEquipe INT NOT NULL, statusInscricao VARCHAR(30) NOT NULL, CONSTRAINT fk_inscricao_comp FOREIGN KEY (idComp) REFERENCES tbCompeticao(idComp), CONSTRAINT fk_inscricao_equipe FOREIGN KEY (idEquipe) REFERENCES tbEquipe(idEquipe) );

CREATE TABLE tbAtleta ( idAtleta INT PRIMARY KEY AUTO_INCREMENT, nomeAtleta VARCHAR(100) NOT NULL, dataNascimento DATE, numeroMatricula VARCHAR(30) NOT NULL UNIQUE );

CREATE TABLE tbInscricaoAtleta ( idInscricaoAtleta INT PRIMARY KEY AUTO_INCREMENT, idInscricao INT NOT NULL, idAtleta INT NOT NULL, numeroCamisa INT, CONSTRAINT fk_inscricao_atleta_equipe FOREIGN KEY (idInscricao) REFERENCES tbInscricaoEquipe(idInscricao), CONSTRAINT fk_inscricao_atleta FOREIGN KEY (idAtleta) REFERENCES tbAtleta(idAtleta) );

CREATE TABLE tbPartida ( idPartida INT PRIMARY KEY AUTO_INCREMENT, idComp INT NOT NULL, idInscricaoMandante INT NOT NULL, idInscricaoVisitante INT NOT NULL, dataHora DATETIME NOT NULL, statusPartida VARCHAR(30) NOT NULL, placarMandante INT DEFAULT 0, placarVisitante INT DEFAULT 0, CONSTRAINT fk_partida_comp FOREIGN KEY (idComp) REFERENCES tbCompeticao(idComp), CONSTRAINT fk_partida_mandante FOREIGN KEY (idInscricaoMandante) REFERENCES tbInscricaoEquipe(idInscricao), CONSTRAINT fk_partida_visitante FOREIGN KEY (idInscricaoVisitante) REFERENCES tbInscricaoEquipe(idInscricao) );

CREATE TABLE tbEventoPartida ( idEvento INT PRIMARY KEY AUTO_INCREMENT, idPartida INT NOT NULL, idInscricao INT NOT NULL, idInscricaoAtleta INT, tipoEvento VARCHAR(50) NOT NULL, minuto INT, descricao VARCHAR(255), CONSTRAINT fk_evento_partida FOREIGN KEY (idPartida) REFERENCES tbPartida(idPartida), CONSTRAINT fk_evento_equipe FOREIGN KEY (idInscricao) REFERENCES tbInscricaoEquipe(idInscricao), CONSTRAINT fk_evento_atleta FOREIGN KEY (idInscricaoAtleta) REFERENCES tbInscricaoAtleta(idInscricaoAtleta) );

CREATE TABLE tbEstatisticaEquipePartida ( idEstatistica INT PRIMARY KEY AUTO_INCREMENT, idPartida INT NOT NULL, idInscricao INT NOT NULL, finalizacoes INT, faltas INT, CONSTRAINT fk_estatistica_equipe_partida FOREIGN KEY (idPartida) REFERENCES tbPartida(idPartida), CONSTRAINT fk_estatistica_equipe FOREIGN KEY (idInscricao) REFERENCES tbInscricaoEquipe(idInscricao) );

CREATE TABLE tbEstatisticaAtletaPartida ( idEstatistica INT PRIMARY KEY AUTO_INCREMENT, idPartida INT NOT NULL, idInscricaoAtleta INT NOT NULL, gols INT DEFAULT 0, assistencias INT DEFAULT 0, cartoesAmarelos INT DEFAULT 0, cartoesVermelhos INT DEFAULT 0, CONSTRAINT fk_estatistica_atleta_partida FOREIGN KEY (idPartida) REFERENCES tbPartida(idPartida), CONSTRAINT fk_estatistica_atleta FOREIGN KEY (idInscricaoAtleta) REFERENCES tbInscricaoAtleta(idInscricaoAtleta) );

USE db_etecscore;

-- 1. Modalidades
INSERT INTO tbModalidade (idModalidade, nomeModalidade, descricao) VALUES 
(1, 'Futsal', 'Campeonato interno de futsal da escola');

-- 2. Competições
INSERT INTO tbCompeticao (idComp, nomeComp, statusModalidade, id_modalidade) VALUES 
(1, 'Torneio Interclasse 2026', 'Em Andamento', 1);

-- 3. Equipes
INSERT INTO tbEquipe (idEquipe, nomeEquipe, identificacao) VALUES 
(1, '2º DS Matutino', 'Turma de Desenvolvimento de Sistemas'),
(2, '3º Informática', 'Turma de Informática para Internet'),
(3, '1º Administração', 'Turma de ADM');

-- 4. Inscrição das Equipes na Competição
INSERT INTO tbInscricaoEquipe (idInscricao, idComp, idEquipe, statusInscricao) VALUES 
(1, 1, 1, 'Ativo'),
(2, 1, 2, 'Ativo'),
(3, 1, 3, 'Ativo');

-- 5. Atletas
INSERT INTO tbAtleta (idAtleta, nomeAtleta, dataNascimento, numeroMatricula) VALUES 
(1, 'Roberth Leite', '2008-05-15', 'MAT202601'),
(2, 'Carlos Silva', '2008-08-20', 'MAT202602');

-- 6. Inscrição de Atletas nas Equipes
INSERT INTO tbInscricaoAtleta (idInscricaoAtleta, idInscricao, idAtleta, numeroCamisa) VALUES 
(1, 1, 1, 10), -- Roberth na Equipe 1 (2º DS Matutino)
(2, 2, 2, 9);  -- Carlos na Equipe 2 (3º Informática)

-- 7. Partidas (Para preencher a seção "Jogos")
INSERT INTO tbPartida (idPartida, idComp, idInscricaoMandante, idInscricaoVisitante, dataHora, statusPartida, placarMandante, placarVisitante) VALUES 
(1, 1, 1, 2, '2026-11-10 14:00:00', 'Finalizado', 3, 2),
(2, 1, 1, 3, '2026-11-11 15:00:00', 'Finalizado', 4, 1);

-- 8. Estatísticas de Atletas (Para preencher o "Jogador Destaque")
INSERT INTO tbEstatisticaAtletaPartida (idPartida, idInscricaoAtleta, gols, assistencias, cartoesAmarelos, cartoesVermelhos) VALUES 
(1, 1, 2, 1, 0, 0), -- Roberth fez 2 gols e 1 assistência na partida 1
(2, 1, 1, 2, 1, 0); -- Roberth fez 1 gol e 2 assistências na partida 2