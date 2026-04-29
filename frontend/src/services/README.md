# Serviços de API

Esta pasta contém os serviços para comunicação com o backend da aplicação SAP ICOMP.

## Estrutura

- `api.ts`: Configuração base do Axios com interceptores.
- `studentService.ts`: Serviços para operações com alunos.
- `courseService.ts`: Serviços para operações com cursos.
- `specialNeedService.ts`: Serviços para operações com necessidades especiais.
- `index.ts`: Exportações centralizadas.

## Rotas Esperadas no Backend

### Alunos (`/students`)

- `GET /students` - Listar todos os alunos
- `GET /students/:id` - Obter aluno por ID
- `POST /students` - Criar novo aluno
- `PUT /students/:id` - Atualizar aluno
- `DELETE /students/:id` - Deletar aluno

## Uso

```typescript
import { studentService } from "@/services";

// Exemplo: Listar alunos
const students = await studentService.getStudents();

// Exemplo: Criar aluno
const student = await studentService.createStudent(formData);
```

## Autenticação

O interceptor no `api.ts` automaticamente adiciona o token de autenticação do localStorage aos headers das requisições.
