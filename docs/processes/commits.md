## 💬 Padronização de Commits (Conventional Commits)

Adotamos mensagens semânticas para facilitar a leitura do histórico e automação de *changelogs*.

### Formato:
`tipo(escopo): descrição curta em letras minúsculas`

### Principais Tipos:
* **`feat`**: Nova funcionalidade.
* **`fix`**: Correção de bug.
* **`docs`**: Alterações em documentação.
* **`style`**: Formatação, pontos e vírgulas, etc. (não altera lógica).
* **`refactor`**: Refatoração que não altera comportamento.
* **`chore`**: Atualização de dependências ou ferramentas de build.

**Exemplo:** `feat(ui): adiciona botão de logout no header`

---

## 🚀 Ciclo de Vida de uma Alteração

1.  **Criação:** `git checkout develop` -> `git pull` -> `git checkout -b feature/nome-da-task`
2.  **Desenvolvimento:** Realize commits frequentes seguindo o padrão.
3.  **Sincronização:** Antes de finalizar, dê um rebase ou merge da `develop` na sua feature para resolver conflitos localmente.
4.  **Pull Request (PR):** Abra um PR da sua branch para a `develop`.
5.  **Revisão:** O código deve ser revisado e aprovado.
6.  **Promoção:**
    * `develop` ➡️ `test` (Testes e Homologação).
    * `test` ➡️ `production` (Lançamento Oficial).
