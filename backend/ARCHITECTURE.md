# Clean Architecture Guide

This project follows **Clean Architecture** principles to maintain a scalable, testable, and maintainable codebase. Clean Architecture enforces separation of concerns by organizing code into distinct layers with clear dependencies.

## Architecture Overview

Clean Architecture is built on the principle that dependencies should flow inward—outer layers depend on inner layers, but inner layers never depend on outer layers. This ensures that the core business logic is independent of frameworks, databases, or UI concerns.

```
┌─────────────────────────────────────────┐
│         External Frameworks             │
│    (Express, Database Drivers, etc)     │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (Database, HTTP, External Services)    │
├─────────────────────────────────────────┤
│        Interfaces Layer                 │
│     (Contracts & Abstractions)          │
├─────────────────────────────────────────┤
│          Core/Business Layer            │
│   (Entities, Use Cases, Business Logic) │
├─────────────────────────────────────────┤
│          Shared Layer                   │
│        (Utilities & Constants)          │
└─────────────────────────────────────────┘
```

## Project Layers

### 1. **Core Layer** (`/core`)

Contains the pure business logic and rules of the application. This layer is framework-agnostic and should never depend on external libraries or infrastructure.

#### Subdirectories:

- **`entities/`** - Represent domain objects with business rules
  - Example: `student.ts`
  - Purpose: Define the structure and business logic of domain models
  - Rules: Should contain only pure logic, no framework dependencies

- **`use-cases/`** - Orchestrate business workflows
  - Example: `register-student.ts`
  - Purpose: Define application use cases that coordinate between entities and repositories
  - Rules: Should be independent of UI, HTTP, or database implementation details

### 2. **Infrastructure Layer** (`/infrastructure`)

Implements the technical details required by the core layer. This is where databases, external APIs, and HTTP handlers are configured.

#### Subdirectories:

- **`database/`** - Database implementations
  - Example: `prisma-student-repository.ts`
  - Purpose: Implement repository interfaces for data persistence
  - Rules: Should only interact with the database ORM/driver

- **`gatewaies/`** - External service integrations
  - Purpose: Integrate with external APIs and services
  - Example: Email services, payment gateways, etc.

- **`http/`** - HTTP controllers and middleware
  - Purpose: Handle incoming HTTP requests and map them to use cases
  - Example: Express route handlers

### 3. **Interfaces Layer** (`/interfaces`)

Defines contracts and abstractions that decouple the core layer from infrastructure.

#### Purpose:

- `IStudentRepository.ts` - Abstract interface for data access
- Create abstractions for any dependency that could have multiple implementations
- Ensures the core layer depends on abstractions, not concrete implementations

#### Key Principle:

> The Dependency Inversion Principle: Depend on abstractions, not concrete implementations.

### 4. **Shared Layer** (`/shared`)

Contains utilities, constants, and helpers used across the application.

#### Contents:

- Error handling utilities
- Logger configurations
- Constants and enums
- Common types and utilities
- Validation functions

## Dependency Flow

Arrows indicate allowed dependencies:

```
http → use-cases
     ↓
infrastructure → interfaces
     ↓
    core ← shared
```

**Key Rules:**

- ✅ Infrastructure can depend on interfaces and core
- ✅ Use cases can depend on entities and interfaces
- ✅ Any layer can use shared
- ❌ Core cannot depend on infrastructure
- ❌ Core cannot depend on frameworks
- ❌ Outer layers cannot depend on inner layers (except through interfaces)

## Example: Adding a New Feature

### Step 1: Define the Entity (`core/entities/`)

```typescript
// core/entities/course.ts
export class Course {
  constructor(
    public id: string,
    public name: string,
    public code: string,
  ) {}
}
```

### Step 2: Create the Repository Interface (`interfaces/`)

```typescript
// interfaces/ICourseRepository.ts
import { Course } from "../core/entities/course";

export interface ICourseRepository {
  create(course: Course): Promise<void>;
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
}
```

### Step 3: Implement the Use Case (`core/use-cases/`)

```typescript
// core/use-cases/register-course.ts
import { Course } from "../entities/course";
import { ICourseRepository } from "../interfaces/ICourseRepository";

export class RegisterCourseUseCase {
  constructor(private courseRepository: ICourseRepository) {}

  async execute(name: string, code: string): Promise<Course> {
    const course = new Course(crypto.randomUUID(), name, code);
    await this.courseRepository.create(course);
    return course;
  }
}
```

### Step 4: Implement the Repository (`infrastructure/database/`)

```typescript
// infrastructure/database/prisma-course-repository.ts
import { ICourseRepository } from "../../interfaces/ICourseRepository";
import { Course } from "../../core/entities/course";
import { prisma } from "./prisma-client";

export class PrismaCourseRepository implements ICourseRepository {
  async create(course: Course): Promise<void> {
    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        code: course.code,
      },
    });
  }

  async findById(id: string): Promise<Course | null> {
    const data = await prisma.course.findUnique({ where: { id } });
    return data ? new Course(data.id, data.name, data.code) : null;
  }

  async findAll(): Promise<Course[]> {
    const data = await prisma.course.findMany();
    return data.map((d) => new Course(d.id, d.name, d.code));
  }
}
```

### Step 5: Create HTTP Controller (`infrastructure/http/`)

```typescript
// infrastructure/http/course-controller.ts
import { Request, Response } from "express";
import { RegisterCourseUseCase } from "../../core/use-cases/register-course";

export class CourseController {
  constructor(private registerCourseUseCase: RegisterCourseUseCase) {}

  async register(req: Request, res: Response) {
    try {
      const { name, code } = req.body;
      const course = await this.registerCourseUseCase.execute(name, code);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

## Best Practices

### 1. **Dependency Injection**

Inject dependencies rather than creating them inside functions:

```typescript
// ✅ Good
class UseCase {
  constructor(private repository: IRepository) {}
}

// ❌ Bad
class UseCase {
  private repository = new ConcreteRepository();
}
```

### 2. **Use Interfaces for External Dependencies**

Always depend on abstractions:

```typescript
// ✅ Good
constructor(private repository: IRepository) {}

// ❌ Bad
constructor(private repository: PrismaRepository) {}
```

### 3. **Keep Entities Pure**

Business logic should be in entities, not scattered across use cases:

```typescript
// ✅ Good
class Student {
  isEligibleForScholarship(): boolean {
    return this.gpa >= 3.5;
  }
}

// ❌ Bad
useCase.execute() {
  if (student.gpa >= 3.5) { ... }
}
```

### 4. **Organize by Feature or Domain**

As the project grows, consider organizing by feature:

```
core/
  student/
    entities/
    use-cases/
  course/
    entities/
    use-cases/
```

### 5. **Error Handling**

Define custom errors in the core layer and handle them in infrastructure:

```typescript
// core/errors/StudentNotFoundError.ts
export class StudentNotFoundError extends Error {
  constructor() {
    super("Student not found");
  }
}
```

## Testing Benefits

Clean Architecture makes testing much easier:

- **Unit Test Use Cases**: Mock repositories and test business logic
- **Unit Test Entities**: Test pure business rules without external dependencies
- **Integration Test Repositories**: Test database operations independently

```typescript
// Example: Unit test for use case
describe("RegisterStudentUseCase", () => {
  it("should create a new student", async () => {
    const mockRepository = mock<IStudentRepository>();
    const useCase = new RegisterStudentUseCase(mockRepository);

    const result = await useCase.execute("John", "john@example.com");

    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.name).toBe("John");
  });
});
```

## References

- [Uncle Bob's Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Architecture in TypeScript](https://github.com/mattia-battista/clean-architecture-with-typescript)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
