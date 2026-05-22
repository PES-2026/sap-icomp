import { User } from "@/features/login/types/login";
import { http, HttpResponse } from "msw";

const mockUsers: Record<string, User> = {
  "professor@escola.com": {
    id: "1",
    name: "João Silva",
    email: "professor@escola.com",
    phoneNumber: "92999999999",
    registrationNumber: "REG001",
    status: "Active",
    role: "Professor",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  "pedagogo@escola.com": {
    id: "2",
    name: "Maria Souza",
    email: "pedagogo@escola.com",
    phoneNumber: "92988888888",
    registrationNumber: "REG002",
    status: "Active",
    role: "Pedagogue",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
};

export const handlers = [
  // POST /auth/login
  http.post("/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers[body.email];

    if (!user || body.password !== "123456") {
      return HttpResponse.json(
        { message: "Credenciais inválidas." },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      { user },
      {
        headers: {
          "Set-Cookie":
            "token=mock-jwt-token; Path=/; Max-Age=86400; SameSite=Strict",
        },
      },
    );
  }),

  // GET /auth/me
  http.get("/auth/me", ({ cookies }) => {
    if (!cookies.token) {
      return HttpResponse.json(
        { message: "Não autenticado." },
        { status: 401 },
      );
    }

    return HttpResponse.json({ user: mockUsers["professor@escola.com"] });
  }),

  // POST /auth/logout
  http.post("/auth/logout", () => {
    return HttpResponse.json(
      { message: "Logout realizado." },
      {
        headers: {
          "Set-Cookie": "token=; Path=/; Max-Age=0",
        },
      },
    );
  }),
];
