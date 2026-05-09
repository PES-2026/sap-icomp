# IComp Care - Backend

Backend do sistema IComp Care, desenvolvido com **Node.js**, **Express**, **TypeScript** e **Prisma**. O projeto segue os princípios da **Clean Architecture** para garantir escalabilidade, testabilidade e manutenibilidade.

## 🚀 Tecnologias

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework Web:** Express
- **ORM:** Prisma (PostgreSQL)
- **Linter/Formatter:** ESLint & Prettier
- **Testes:** Jest

## 🏛️ Arquitetura e Estrutura de Pastas

O projeto utiliza **Clean Architecture**, dividindo responsabilidades em camadas para garantir que a lógica de negócio seja independente de detalhes técnicos (como banco de dados ou frameworks).

### 📁 Estrutura de Pastas

```text
src/
├── domain/                # Camada central (Core)
│   ├── entities/          # Modelos de negócio (ex: student.ts)
│   ├── valueObjects/      # Atributos com regras de validação (ex: email.ts)
│   ├── repositories/      # Interfaces (Contratos) para persistência
│   └── shared/            # Tipos e utilitários globais do domínio
├── application/           # Camada de orquestração
│   ├── useCases/          # Implementação das regras de aplicação
│   └── dtos/              # Objetos para transporte de dados (entrada/saída)
├── infrastructure/        # Detalhes técnicos e externos
│   └── database/          # Configuração Prisma e Repositórios Concretos
└── presentation/          # Interface com o mundo externo
    ├── controllers/       # Lógica de controle de rotas
    ├── routes/            # Definição de endpoints Express
    └── server.ts          # Ponto de entrada (Composition Root)
```

### 🧱 Camadas em Detalhes

1.  **Domain:** Contém a verdade absoluta do sistema. Nenhuma alteração em bibliotecas externas deve afetar esta camada.
2.  **Application:** Onde o fluxo de dados acontece. Ela recebe um DTO, chama o Domínio para processar e retorna uma resposta. Proibido acessar o banco de dados diretamente aqui.
3.  **Infrastructure:** Onde o Prisma vive. Se decidirmos trocar o PostgreSQL pelo MongoDB, apenas esta camada sofrerá alterações.
4.  **Presentation:** Onde o Express é configurado. É a camada responsável por entender o HTTP e delegar o trabalho para os Casos de Uso.

### Regra de Dependência
As dependências fluem apenas de fora para dentro. O Domínio nunca conhece a Aplicação, que nunca conhece a Infraestrutura. Isso é garantido por regras rigorosas de lint (`no-restricted-imports`).

## 🛠️ Configuração do Projeto

### Pré-requisitos
- **Node.js:** v20 ou superior.
- **Docker & Docker Compose:** Necessário para rodar o banco de dados PostgreSQL e outros serviços via infraestrutura containerizada.
- **Make (opcional):** Utilizado para simplificar comandos de orquestração.

### Configuração de Ambiente
1. Clone o repositório.
2. Crie o arquivo `.env` na raiz do diretório `backend` (e opcionalmente na raiz do projeto) baseando-se no `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Ajuste as variáveis de conexão se necessário:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/icompcare?schema=public"
   ```

### Setup Local (via Docker)
Recomendamos utilizar o Docker para subir a infraestrutura de banco de dados. Na raiz do projeto geral, você pode usar o `Makefile`:

1.  **Subir o ambiente de desenvolvimento:**
    ```bash
    make compose ENVIRONMENT=develop
    ```
2.  **Preparar o banco de dados (dentro da pasta /backend):**
    ```bash
    npm install
    npx prisma migrate dev
    npm run prisma:seed
    ```

### Execução Sem Docker (Manual)
Se preferir rodar o banco de dados manualmente em sua máquina:
1. Certifique-se de que o PostgreSQL está rodando.
2. Instale as dependências: `npm install`.
3. Rode as migrações: `npx prisma migrate dev`.
4. Inicie o servidor: `npm run dev`.

## 📜 Comandos Úteis

### Desenvolvimento
- `npm run dev`: Inicia o servidor em modo de desenvolvimento com hot-reload (`tsx`).
- `npm run build`: Compila o projeto de TypeScript para JavaScript na pasta `dist/`.
- `npm run start`: Inicia o servidor compilado (produção).

### Qualidade de Código (Linting)
- `npm run lint`: Verifica erros de linting, padrões de nomenclatura (`camelCase`) e regras arquiteturais.
- `npm run lint -- --fix`: Corrige automaticamente a maioria dos problemas de formatação e ordem de imports.

### Banco de Dados (Prisma)
- `npx prisma migrate dev`: Cria e aplica migrações de desenvolvimento.
- `npx prisma studio`: Abre a interface visual para explorar o banco de dados.
- `npm run prisma:seed`: Executa o script de sementes para popular o banco.
- `npm run db:deploy`: Aplica migrações pendentes e gera o cliente Prisma.

### Testes
- `npm run test`: Executa a suíte de testes com Jest.

## 📏 Padrões de Código

- **Nomenclatura:** Todos os arquivos e pastas utilizam `camelCase`.
- **Aliases de Importação:** Configuramos aliases para simplificar imports e evitar caminhos relativos profundos:
  - `@application/*`
  - `@domain/*`
  - `@infrastructure/*`
  - `@presentation/*`
  - `@prisma/*`
- **Blindagem Arquitetural:** O ESLint está configurado para falhar se houver importações proibidas entre camadas (ex: Domínio tentando importar da Infraestrutura).

## 📄 Licença
Este projeto está sob a licença ISC.
