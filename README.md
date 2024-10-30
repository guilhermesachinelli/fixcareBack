# <div align="center">Historico de Manutenção SENAI 564 (Fixcare)</div>


## 💻 Seja muito bem-vindo!
#### Esta documentação fornecerá informações abrangentes sobre como usar o nosso software e apresentará o nosso projeto em detalhes.

### O que é?

Esse software de código aberto  utiliza  uma API criada pelos alunos para documentar as manutenções nos equipamentos utilizados pelas turmas que utilizam  a oficina de mecânica do SENAI 564 Valinhos.

### Começando.
Para começar a utilizar esse software e entender melhor o projeto, siga os passos abaixo:

1. Em seu projeto, utilize o comando "npm i" no terminal para fazer a instalação de todas as bibliotecas utilizadas no projeto.
2. Em seguida, utilize o comando "npm run dev" no terminal para poder abri-lo em seu navegador.
3. Para que esse software funcione, entre no link a baixo e clone o repositorio do Front.

   [![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/guilhermesachinelli/fixcare-frontend-web)

## Esquema de classes:
Tabela machine:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| categoria            | string   | Categoria da maquina                                |
| marca          | string   | Define a marca da maquina                             |
| modelo          | string   | Define o modelo da maquina                           |
| numero_de_patrimonio         | string   | Número de patrimonio da maquina (UNICO) 
| numero_de_serie         | string   | Número de serie da maquina  (UNICO)
| numero_do_torno        | number   | Número do torno (UNICO)
| data_de_aquisicao         | date   | Data de aquisição da maquina

Tabela adm:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| email             | string   | Define um email para o Administrador (UNICO)                                |
| senha          | string   | Define a senha do Administrados                            |


Tabela aluno:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| email             | string   | Define um email para o Aluno (UNICO)                                |
| senha          | string   | Define a senha do Aluno                            |

Tabela funcionario:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| email             | string   | Define um email para o Funcionario (UNICO)                                |
| senha          | string   | Define a senha do Funcionario                            |

Tabela requestmaintenance:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| numero_de_patrimonioID            | string   | Define o número de patrimonido pegando o número da maquina                                |
| nome          | string   | Nome da pessoa que fez o requerimento de manutenção                             |
| causa_do_problema         | string   | Causa do problema que esta na maquina  
| descricao         | string   | Descrição do problema  
| data_de_solicitacao        | date   | Data que foi feita a requisição
| status         | boolean   | Status que define se a requição ainda esta de pé ou não

Tabela maintenance:
| ATRIBUTO      | TIPO     | DESCRIÇÃO                                |
|---------------|----------|------------------------------------------|
| numero_de_patrimonioID            | string   | Define o número de patrimonido pegando o número da maquina                                |
| nome_do_responsavel          | string   | Nome do responsavel que fez a manutenção                             |
| tipo_de_manutencao          | string   | Define o tipo da manutenção feita                           |
| descricao         | string   | Descrição da manutenção 
| data_da_manutenção        | date   | Data que foi feita a manutenção
| status         | boolean   | Status que define se a manutenção ja foi feita ou não

## Boas práticas em nosso código:

Clean code: Estruturação de pastas organizada, dentação de código, versionamento de branchs.

Componentização: Utilizada nos elementos: Cards, Footer, Header, Navegação por imagem, PopUp.


# Equipe

Somos um grupo de estudantes que estão no quarto semestre do curso técnico de desenvolvimento de sistemas no SENAI de Valinhos, e gostaríamos de compartilhar o nosso TCC que criamos com base no que aprendemos até agora. Nosso objetivo com esta documentação é mostrar como aplicamos as habilidades que adquirimos no SENAI para solucionar problemas e criar, além de solucionarmos um problema recorrente no SENAI, a falta de documentação das manutenções e lubrificações dos equipamentos na área da oficina de mecânica. Atualmente, o projeto é focado no equipamento torno.


### Entre em contato conosco pelo GitHub!

#### - Richard Macedo
[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/richardmsiqueira)
                                                    
#### - Luana Fassini
[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/LuFassini)                         

#### - Guilherme Lima
[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/GuiHJLima)


#### - Guilherme Sachinelli
[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/guilhermesachinelli)

#### - Isabelle Barquilia
[![Github Badge](https://img.shields.io/badge/-Github-000?style=flat-square&logo=Github&logoColor=white&link=LINK_GIT)](https://github.com/IsaBarquilia)


## Feedback

Se você tiver algum feedback, por favor nos deixe saber por meio destes email's:
1. guilhermelima@aluno.senai.br,
2. guilherme.sachinelli@aluno.senai.br,
3. richard.siqueira@aluno.senai.br,
4. luana-fassini@aluno.senai.br,
5. isabelle-moraes@aluno.senai.br.
