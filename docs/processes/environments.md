# 🌐 Guia Rápido de Ambientes

Definição dos três níveis de infraestrutura e seus propósitos no ciclo de vida do software.

### 🛠️ 1. Ambiente de Desenvolvimento (Branch `develop`)
* **Público:** Desenvolvedores.
* **Propósito:** Integração contínua de novas funcionalidades.
* **Regra:** É um ambiente volátil onde o código é testado tecnicamente pela primeira vez após o merge das *features*.

### 🧪 2. Ambiente de Teste (Branch `test`)
* **Público:** QA (Analistas de Teste), PO (Product Owner) e Cliente.
* **Propósito:** Homologação e validação de negócio.
* **Regra:** Deve ser um espelho fiel da produção. Nenhuma funcionalidade é promovida para a `main` sem o "OK" neste ambiente.

### 🚀 3. Ambiente Main (Branch `main`)
* **Público:** Usuário final (Produção).
* **Propósito:** Entrega de valor e estabilidade total.
* **Regra:** Alterações aqui são críticas. Cada atualização gera uma nova **Tag** de versão (ex: `v1.0.0`) e deve permitir rollback rápido em caso de falha.

---

### 📊 Comparativo Direto

| Ambiente | Branch | Foco | Frequência de Deploy |
| :--- | :--- | :--- | :--- |
| **Dev** | `develop` | Integração Técnica | Várias vezes ao dia |
| **Teste** | `test` | Validação de Usuário | Por ciclo de entrega (Sprint) |
| **Main** | `main` | Estabilidade Crítica | Por versão estável (Release) |

---