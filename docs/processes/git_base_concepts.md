## 🌳 1. Branch (Ramo)
Imagine que o código do seu projeto é o tronco de uma árvore. Uma **Branch** é um galho que você puxa para trabalhar em algo novo sem afetar o tronco principal.
* **No seu projeto:** Você terá a `main` (o tronco estável), a `test` e a `develop`. Quando um dev for criar uma funcionalidade, ele cria uma branch `feature/nome`.
* **Por que usar?** Se o dev cometer um erro catastrófico, o "tronco" (o que está rodando para o cliente) continua intacto.

## 💾 2. Commit (Registro)
O **Commit** é como um "Save Point" em um videogame. Ele salva o estado atual dos seus arquivos com uma mensagem descrevendo o que foi feito.
* **No seu projeto:** Usaremos o **Conventional Commits**. Em vez de salvar como "ajustes", salvamos como `feat: adiciona campo de busca`.
* **Dica:** Commits devem ser pequenos e frequentes. É melhor ter 10 commits pequenos do que um gigante que altera 50 arquivos de uma vez.

## 🚀 3. Push & Pull (Enviar e Puxar)
O Git funciona no seu computador (local) e no GitHub (nuvem).
* **Push:** Você envia suas alterações locais para o servidor do GitHub.
* **Pull:** Você traz as alterações que seus colegas enviaram para o seu computador. É essencial dar `pull` sempre antes de começar o dia para não trabalhar em código desatualizado.

## 📥 4. Pull Request ou PR (Solicitação de Envio)
Este é o momento mais importante da colaboração. Quando você termina sua tarefa na sua branch, você abre um **Pull Request**.
* **O que é:** É um pedido formal dizendo: *"Pessoal, terminei a funcionalidade X na minha branch, posso juntar isso com a branch `develop`?"*.
* **No seu projeto:** É aqui que o **Template de PR** que criamos entra em ação. O dev explica o que fez e anexa provas (prints).

## 👀 5. Code Review (Revisão de Código)
Antes do PR ser aceito, outros membros da equipe (ou a IA que discutimos) olham o código.
* **O que fazer:** Verificar se há erros, se o padrão de nomes está correto e se o código é fácil de entender.
* **Cultura:** A revisão não é um ataque ao desenvolvedor, mas uma camada de segurança para o projeto.

## 🔀 6. Merge (Mesclar)
O **Merge** é o ato de unir duas branches. Quando um PR é aprovado, você faz o "Merge" da branch da feature para a `develop`.
* **Conflitos:** Às vezes, duas pessoas mexem na mesma linha do mesmo arquivo. O Git avisará que houve um "Conflito", e vocês precisarão decidir qual versão fica.

---

### 💡 Resumo do Fluxo que sua equipe fará:

1.  **Pull:** Puxa as novidades da `develop`.
2.  **Branch:** Cria um galho novo para a tarefa.
3.  **Commit:** Salva o progresso com mensagens claras.
4.  **Push:** Envia para o GitHub.
5.  **Pull Request:** Pede para entrar na `develop`.
6.  **Review:** Alguém olha e aprova.
7.  **Merge:** O código novo vira parte do projeto oficial.

---
Entendido! Para uma equipe iniciante, o Git pode parecer um "bicho de sete cabeças", mas a melhor forma de entender é pensar nele como uma **Máquina do Tempo** e um **Espaço de Trabalho Colaborativo**.

Aqui estão os conceitos fundamentais, explicados de forma simples e conectada à estratégia que montamos para o seu projeto:

---

## 🌳 1. Branch (Ramo)
Imagine que o código do seu projeto é o tronco de uma árvore. Uma **Branch** é um galho que você puxa para trabalhar em algo novo sem afetar o tronco principal.
* **No seu projeto:** Você terá a `main` (o tronco estável), a `test` e a `develop`. Quando um dev for criar uma funcionalidade, ele cria uma branch `feature/nome`.
* **Por que usar?** Se o dev cometer um erro catastrófico, o "tronco" (o que está rodando para o cliente) continua intacto.

## 💾 2. Commit (Registro)
O **Commit** é como um "Save Point" em um videogame. Ele salva o estado atual dos seus arquivos com uma mensagem descrevendo o que foi feito.
* **No seu projeto:** Usaremos o **Conventional Commits**. Em vez de salvar como "ajustes", salvamos como `feat: adiciona campo de busca`.
* **Dica:** Commits devem ser pequenos e frequentes. É melhor ter 10 commits pequenos do que um gigante que altera 50 arquivos de uma vez.

## 🚀 3. Push & Pull (Enviar e Puxar)
O Git funciona no seu computador (local) e no GitHub (nuvem).
* **Push:** Você envia suas alterações locais para o servidor do GitHub.
* **Pull:** Você traz as alterações que seus colegas enviaram para o seu computador. É essencial dar `pull` sempre antes de começar o dia para não trabalhar em código desatualizado.

## 📥 4. Pull Request ou PR (Solicitação de Envio)
Este é o momento mais importante da colaboração. Quando você termina sua tarefa na sua branch, você abre um **Pull Request**.
* **O que é:** É um pedido formal dizendo: *"Pessoal, terminei a funcionalidade X na minha branch, posso juntar isso com a branch `develop`?"*.
* **No seu projeto:** É aqui que o **Template de PR** que criamos entra em ação. O dev explica o que fez e anexa provas (prints).

## 👀 5. Code Review (Revisão de Código)
Antes do PR ser aceito, outros membros da equipe (ou a IA que discutimos) olham o código.
* **O que fazer:** Verificar se há erros, se o padrão de nomes está correto e se o código é fácil de entender.
* **Cultura:** A revisão não é um ataque ao desenvolvedor, mas uma camada de segurança para o projeto.

## 🔀 6. Merge (Mesclar)
O **Merge** é o ato de unir duas branches. Quando um PR é aprovado, você faz o "Merge" da branch da feature para a `develop`.
* **Conflitos:** Às vezes, duas pessoas mexem na mesma linha do mesmo arquivo. O Git avisará que houve um "Conflito", e vocês precisarão decidir qual versão fica.

---

### 💡 Resumo do Fluxo que sua equipe fará:

1.  **Pull:** Puxa as novidades da `develop`.
2.  **Branch:** Cria um galho novo para a tarefa.
3.  **Commit:** Salva o progresso com mensagens claras.
4.  **Push:** Envia para o GitHub.
5.  **Pull Request:** Pede para entrar na `develop`.
6.  **Review:** Alguém olha e aprova.
7.  **Merge:** O código novo vira parte do projeto oficial.

---