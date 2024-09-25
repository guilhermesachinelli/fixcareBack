-- Criação do banco de dados fixcareback
CREATE DATABASE fixcareback;

-- Conecta ao banco de dados fixcareback
\c fixcareback;

-- Criação da tabela de máquinas
CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    numero_de_patrimonio VARCHAR(255) NOT NULL UNIQUE,
    numero_de_serie VARCHAR(255) NOT NULL UNIQUE,
    numero_do_torno INTEGER NOT NULL UNIQUE,
    data_de_aquisicao DATE NOT NULL,
    data_da_ultima_troca_de_oleo DATE NOT NULL 
);
-- Criação da tabela de administradores
CREATE TABLE adm (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
-- Criação da tabela de requisição de manutenção
CREATE TABLE requestmaintenance (
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    causa_do_problema VARCHAR(255) NOT NULL,
    descricao VARCHAR(255),
    data_de_solicitacao DATE NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (numero_de_serieID) REFERENCES machine(numero_de_serie)
);
-- Criação da tabela de manutenção
CREATE TABLE maintenance (
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    nome_do_responsavel VARCHAR(255) NOT NULL,
    tipo_de_manutencao VARCHAR(100) NOT NULL,
    descricao VARCHAR(900) NOT NULL,
    data_de_manutencao DATE NOT NULL,
    status VARCHAR(100) NOT NULL,
    FOREIGN KEY (numero_de_serieID) REFERENCES machine(numero_de_serie)
);
CREATE TABLE lubrificacao(
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    oleo_lubrificante JSONB NOT NULL,
    pontos_de_lubrificacao JSONB NOT NULL,
    frequencia_de_lubrificacao JSONB NOT NULL,
    quantidade_de_oleo JSONB NOT NULL,
    imagem JSONB
    FOREIGN KEY (numero_de_serieID) REFERENCES machine(numero_de_serie)
);