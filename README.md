# Pao FresQUIM - Sistema de Gestao de Padaria

Sistema web para gestao de padaria, com frontend em Next.js e backend em Spring Boot. O projeto permite controlar vendas, produtos, clientes, funcionarios, ponto, cameras simuladas, relatorios e recursos de acessibilidade.

## Funcionalidades

- Dashboard com atalhos para as principais areas do sistema.
- Cadastro, listagem, edicao e remocao de produtos.
- Cadastro, listagem, edicao e remocao de clientes.
- Cadastro e controle de funcionarios.
- Controle de ferias liberado apenas apos um ano da data de admissao.
- Registro de ponto de funcionarios.
- Venda vinculada a funcionario, cliente, itens e forma de pagamento.
- Relatorios de vendas, produtos vendidos e dividas.
- Painel de acessibilidade com zoom de 75% a 200%, alto contraste, modo daltonismo e escala de cinza.
- Help interno com explicacao de uso do sistema e atalhos de teclado.
- Indicador global de carregamento quando a API demora a responder.

## Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Frontend | Next.js 15, React 19, Tailwind CSS 4 |
| Backend | Java 21, Spring Boot 4, Spring Web MVC |
| Persistencia | Spring Data JPA, Hibernate |
| Banco | PostgreSQL / Supabase |
| HTTP client | Axios |
| Container | Docker e Docker Compose |

## Estrutura

```text
project-pao-fresquim/
|-- client/                 # Frontend Next.js
|   |-- public/             # Imagens e arquivos publicos
|   |-- src/app/            # Paginas da aplicacao
|   |-- src/components/     # Componentes reutilizaveis
|   |-- src/services/       # Chamadas da API separadas por dominio
|   |-- Dockerfile
|   `-- package.json
|
|-- server/                 # Backend Spring Boot
|   |-- src/main/java/      # Controllers, services, models e repositories
|   |-- src/main/resources/ # Configuracoes da aplicacao
|   |-- Dockerfile
|   `-- pom.xml
|
|-- docker-compose.yml
|-- pom.xml                 # Agregador Maven do backend
`-- README.md
```

## Requisitos

Para rodar localmente sem Docker:

- Java JDK 21
- Maven 3.9 ou superior
- Node.js 20 ou superior
- npm

Para rodar com Docker:

- Docker Desktop
- Docker Compose

## Variaveis de ambiente

O backend precisa de um arquivo `server/.env`. Esse arquivo nao deve ser enviado para o Git, pois contem credenciais sensiveis.

Crie `server/.env` com:

```env
DB_URL=jdbc:postgresql://HOST:PORTA/postgres?sslmode=require
DB_USERNAME=USUARIO
DB_PASSWORD=SENHA
```

Variaveis opcionais usadas pelo backend:

```env
SERVER_PORT=8080
DDL_AUTO=none
APP_SCHEMA_MIGRATION_ENABLED=false
TRANSACTION_TIMEOUT_SECONDS=20
JPA_QUERY_TIMEOUT_MS=15000
```

Observacao: em ambiente local novo, se o banco ainda nao tiver as tabelas/colunas, pode ser necessario rodar temporariamente com `DDL_AUTO=update`. Depois que o schema estiver criado, volte para `DDL_AUTO=none`.

## Como rodar com Docker

Na raiz do projeto:

```powershell
docker compose up --build
```

Acesse:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8080
```

Para rebuildar apenas o frontend:

```powershell
docker compose up --build client
```

Para rebuildar apenas o backend:

```powershell
docker compose up --build server
```

Para parar os containers:

```powershell
docker compose down
```

## Como rodar localmente no VS Code

### 1. Rodar o backend

Na raiz do projeto:

```powershell
.\mvnw.cmd -pl server spring-boot:run
```

Ou, entrando na pasta do backend:

```powershell
cd server
mvn spring-boot:run
```

O backend sobe em:

```text
http://localhost:8080
```

### 2. Rodar o frontend

Em outro terminal:

```powershell
cd client
npm install
npm run dev
```

O frontend sobe em:

```text
http://localhost:3000
```

Se o PowerShell bloquear o comando `npm`, use:

```powershell
npm.cmd run dev
```

## Comandos uteis

### Frontend

```powershell
cd client
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

### Backend

```powershell
.\mvnw.cmd -pl server clean package
.\mvnw.cmd -pl server spring-boot:run
```

### Docker

```powershell
docker compose ps
docker compose logs server --tail=100
docker compose logs client --tail=100
docker compose down
```

## Atalhos do sistema

| Tecla | Acao |
| --- | --- |
| F1 ou F12 | Abre a ajuda do sistema |
| Esc | Fecha ajuda/painel aberto ou volta para o dashboard |
| F2 | Abre Vendas |
| F3 | Abre Produtos |
| F4 | Abre Clientes |
| F6 | Abre Funcionarios |
| F7 | Abre Relatorios |
| F8 | Abre Registro de Ponto |
| F9 | Abre Cameras |

## Acessibilidade

O sistema possui um botao de acessibilidade no canto superior direito. Por ele e possivel:

- Aumentar ou diminuir o zoom do sistema entre 75% e 200%.
- Ativar alto contraste.
- Ativar paleta para daltonismo.
- Ativar escala de cinza.
- Abrir a ajuda do sistema.

## Endpoints principais

Algumas rotas expostas pelo backend:

```text
GET /produtos
GET /clientes/listar
GET /funcionarios
GET /funcionarios/resumo
GET /vendas
GET /relatorios
```

## Problemas comuns

| Problema | Possivel solucao |
| --- | --- |
| Frontend nao abre em `8080` | Use `http://localhost:3000`. A porta `8080` e apenas da API. |
| Erro `${DB_URL}` no backend | O arquivo `server/.env` nao existe ou nao foi carregado. |
| Porta `8080` ocupada | Pare outro backend/container usando essa porta. |
| Porta `3000` ocupada | Pare outro frontend/container usando essa porta. |
| Imagem nao carrega no Docker | Confira letras maiusculas/minusculas no nome do arquivo em `client/public`. |
| `npm.ps1` bloqueado no PowerShell | Use `npm.cmd` ou ajuste a Execution Policy do Windows. |
| Banco Supabase nao responde | Confira se o projeto Supabase esta ativo e se as credenciais estao corretas. |

## Seguranca

- Nao envie `.env` para o Git.
- Nao coloque API keys, senhas ou URLs privadas diretamente no codigo.
- Use variaveis de ambiente para credenciais.
- Antes de subir para repositorio publico, confira o historico do Git caso algum segredo ja tenha sido commitado.

## Equipe

Projeto academico desenvolvido pela equipe Pao FresQUIM.

