# **SAP IComp**

Sistema de Apoio Acadêmico SAP IComp: Uma Abordagem Segura e Integrada para Gestão de Atendimentos no ICOMP/UFAM

# Padrão de Nomenclatura de Arquivos e Pastas

Esta seção define um padrão simples de nomenclatura para manter o projeto organizado, legível e consistente.

---

## Pastas
- Utilizar: **kebab-case**
- Letras minúsculas e separadas por hífen (`-`)

### Exemplos:
- `user-profile`
- `auth-pages`
- `game-session`

---

## Componentes (React)
- Utilizar: **PascalCase**
- Cada palavra começa com letra maiúscula

### Exemplos:
- `UserCard.tsx`
- `LoginForm.tsx`
- `SidebarMenu.tsx`

---

## Arquivos comuns (utils, hooks, services)
- Utilizar: **camelCase**
- Primeira palavra minúscula, demais com inicial maiúscula

### Exemplos:
- `useAuth.ts`
- `apiClient.ts`
- `formatDate.ts`

---

## Boas práticas
- Manter **consistência** em todo o projeto
- Evitar misturar padrões para o mesmo tipo de arquivo
- Usar nomes claros e descritivos
- Evitar abreviações desnecessárias

---

## Evitar
- `snake_case` em front-end (não é padrão comum no ecossistema JS)
- Misturar múltiplos padrões sem necessidade

---

## Resumo

| Tipo       | Convenção   |
|------------|------------|
| Pastas     | kebab-case |
| Componentes| PascalCase |
| Arquivos   | camelCase  |

---