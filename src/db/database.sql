-- Criação do banco de dados fixcareback
CREATE DATABASE fixcareback;

-- Conecta ao banco de dados fixcareback
\c fixcareback;

-- Criação da tabela de usuários
CREATE TABLE machine (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    numero_de_patrimonio VARCHAR(255) NOT NULL,
    numero_de_serie VARCHAR(255) NOT NULL UNIQUE,
    data_de_aquisicao DATE NOT NULL,
    recomendacao_de_manutencao VARCHAR(255) NOT NULL,
    oleo_lubrificante VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL
);

CREATE TABLE adm (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE requestmaintenance (
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    data_de_solicitacao DATE NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (numero_de_serieID) REFERENCES machine(numero_de_serie)
);
CREATE TABLE maintenance (
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    nome_do_responsavel VARCHAR(255) NOT NULL,
    nif_do_responsavel VARCHAR(255) NOT NULL,
    causa_do_problema VARCHAR(255) NOT NULL,
    descricao VARCHAR(900) NOT NULL,
    orçamento VARCHAR(255),
    data_de_manutencao DATE NOT NULL,
    status BOOLEAN NOT NULL,
    FOREIGN KEY (numero_de_serieID) REFERENCES machine(numero_de_serie)
);
CREATE TABLE lubrication (
    id SERIAL PRIMARY KEY,
    numero_de_serieID INTEGER NOT NULL,
    nome_do_responsavel VARCHAR(255) NOT NULL,

    
);
CREATE TABLE imagens (

)