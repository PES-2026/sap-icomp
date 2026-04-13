# 📑 Documentação de Fluxo de Trabalho e Versionamento

Este documento estabelece as normas para o desenvolvimento colaborativo, garantindo a estabilidade dos ambientes de **Desenvolvimento**, **Staging** e **Produção**.

---

## 🏗 Estratégia de Branches (Git Flow Simplificado)

O projeto utiliza um modelo de ramificação baseado em estados de prontidão do código.

### 1. Branches Permanentes
* **`production`**: Reflete o código em estado "live". Apenas recebe merges da `test`. Cada merge gera uma nova versão (Tag).
* **`test`**: Ambiente de homologação. Onde o QA e o cliente validam as entregas antes do deploy final.
* **`develop`**: Branch de integração. Todo desenvolvimento finalizado converge para cá.

### 2. Branches de Suporte
* **`feature/*`**: Para novas funcionalidades. Criada a partir da `develop`.
* **`hotfix/*`**: Para correções críticas em produção. Criada a partir da `production`.

---

## 🎨 Fluxo Visual (Gitflow Diagram)

Abaixo, a representação de como o código viaja entre as branches:

```mermaid
%% Exemplo de visualização do fluxo
gitGraph
    commit id: "v1.0.0" tag: "v1.0.0"
    branch develop
    checkout develop
    commit id: "init develop"
    
    branch feature/login
    checkout feature/login
    commit id: "feat: add form"
    commit id: "feat: auth logic"
    
    checkout develop
    merge feature/login id: "Merge feature"
    
    checkout main
    branch test
    checkout test
    merge develop id: "Prepare Release 1.1.0"
    
    checkout main
    merge test id: "v1.1.0" tag: "v1.1.0"
    
    checkout main
    branch hotfix/bug-prod
    checkout hotfix/bug-prod
    commit id: "fix: critical login bug"
    checkout main
    merge hotfix/bug-prod id: "v1.1.1" tag: "v1.1.1"
    checkout develop
    merge hotfix/bug-prod id: "sync hotfix"
```

> **Nota:** No diagrama acima, `main` representa a sua branch de `production`.

---