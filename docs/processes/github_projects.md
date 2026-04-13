O **GitHub Projects** é, essencialmente, o "Trello ou Jira nativo" do GitHub. A grande vantagem é que ele vive no mesmo lugar que o seu código, o que permite automações poderosas que ferramentas externas não conseguem fazer com a mesma fluidez.

Aqui está como você pode estruturar o Projects para o seu time e, o mais importante, como conectar o código (commits/PRs) às tarefas.

---

## 🏗️ 1. Estruturando o GitHub Projects

Para um time iniciante, recomendo o modelo de **Kanban (Board)**. Você pode criar colunas que reflitam o fluxo que definimos:

1.  **Backlog:** Ideias e tarefas futuras.
2.  **Todo (A fazer):** Tarefas priorizadas para a semana/sprint.
3.  **In Progress (Em andamento):** O que o dev está codificando agora.
4.  **In Review (Em revisão):** Pull Requests abertos aguardando aprovação.
5.  **Done (Concluído):** Tarefas que chegaram na branch `main`.

---

## 🔗 2. Como linkar Commits e PRs aos Tickets (Issues)

No GitHub, cada tarefa é uma **Issue**. Para que o GitHub entenda que um pedaço de código "resolve" aquela tarefa, existem três formas principais:

### A. Palavras-Chave de Fechamento (A mais importante!)
Se você escrever palavras específicas na descrição do seu **Pull Request** ou na mensagem do **Commit**, o GitHub linka os dois automaticamente e até fecha a tarefa para você quando o merge for feito.

**As palavras mágicas são:** `closes`, `fixes`, `resolves`.

* **Exemplo na descrição do PR:**
    > "Este PR adiciona a validação de e-mail. **Closes #123**" (Onde #123 é o número da Issue).

### B. Link Manual na Interface
Dentro da Issue (no lado direito da tela), existe uma seção chamada **Development**. Você pode clicar ali e selecionar a branch ou o Pull Request que está sendo trabalhado para aquela tarefa. Isso cria uma conexão visual no Project.

### C. Menção no Commit (Rastreabilidade)
Mesmo que você não queira fechar a tarefa ainda, é uma boa prática citar o número da Issue em cada commit:
* `feat(auth): adiciona lógica de login (#123)`
* Isso faz com que o commit apareça na "linha do tempo" da Issue, permitindo que qualquer pessoa veja todo o histórico de código gerado para aquela atividade.

---

## 🤖 3. Automação: O "Movimento Automático" dos Cards

Você não quer que o seu time perca tempo movendo cards manualmente. No GitHub Projects, você pode configurar **Workflows** (Automações):

* **Item added to project:** Move para "Todo".
* **Pull Request opened:** Move o card automaticamente de "In Progress" para "In Review".
* **Pull Request merged:** Move o card automaticamente para "Done".
* **Issue reopened:** Move o card de volta para "In Progress".

---

## 💡 Dica Prática para o Time Iniciante

Instrua seu time a sempre começar pela Issue:
1.  Crie a **Issue** no GitHub (Ex: "Criar tela de Login").
2.  Anote o **número** da Issue (ex: #42).
3.  Ao criar a branch, use o número: `feature/42-tela-login`.
4.  Ao fazer commits, mencione o número: `feat: estrutura inicial #42`.
5.  Ao abrir o PR, escreva: `Closes #42`.

Isso cria um rastro perfeito: do planejamento ao código em produção.
