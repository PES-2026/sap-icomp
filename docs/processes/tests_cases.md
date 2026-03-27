# 📑 Guia de Testes para o Time (Simplificado)

### 1. O Conceito: "O que eu espero que aconteça?"
Antes de começar a testar, o desenvolvedor ou o QA iniciante deve se fazer uma pergunta: 
> *“Se eu fizer a ação X, o sistema deve reagir com Y?”*

### 2. Os Três Cenários de Ouro
Para cada tarefa, documente pelo menos estes três tipos de teste:
1.  **Sucesso:** Tudo certo (ex: Cadastro com todos os campos preenchidos).
2.  **Erro Esperado:** O sistema avisa o erro (ex: Tentar cadastrar sem e-mail).
3.  **Limite:** O sistema não quebra (ex: Digitar um texto gigante no campo nome).

---

## 🛠️ Template de Casos de Teste (Copie e Use)

Este modelo é direto. Cada linha representa uma verificação.

| ID | Cenário de Teste | Passos (Ação) | Resultado Esperado | Status (✅/❌) |
| :--- | :--- | :--- | :--- | :--- |
| **CT-01** | Login com sucesso | Inserir e-mail/senha válidos e clicar em "Entrar" | Redirecionar para a Home com mensagem de boas-vindas. | |
| **CT-02** | Login com senha errada | Inserir e-mail válido e senha incorreta. Clicar em "Entrar" | Exibir erro: "Usuário ou senha inválidos". | |
| **CT-03** | Campo obrigatório vazio | Deixar campo e-mail vazio e clicar em "Entrar" | Exibir alerta: "O campo e-mail é obrigatório". | |

---

## 🐞 Como Documentar um Bug (Se o teste falhar)

Se você encontrar um erro (❌), não diga apenas "está quebrado". Use este padrão:

1.  **Título:** [FUNCIONALIDADE] Breve descrição do erro.
2.  **Passos para Reproduzir:** 1. Abrir a tela de Login.
    2. Digitar e-mail válido.
    3. Clicar no botão sem digitar a senha.
3.  **Resultado Atual:** O sistema fica carregando infinitamente.
4.  **Resultado Esperado:** O sistema deve exibir um aviso de "Senha obrigatória".
5.  **Evidência:** (Print da tela ou vídeo curto).

---

## ✅ Checklist de "Pode Mandar para a Branch `test`?"

Antes de subir o código, o desenvolvedor deve marcar estes itens:
- [ ] O código funciona na minha máquina?
- [ ] Testei o fluxo principal (Caminho Feliz)?
- [ ] Verifiquei se o layout quebra no celular?
- [ ] Existe algum "console.log" ou comentário desnecessário no código?

---