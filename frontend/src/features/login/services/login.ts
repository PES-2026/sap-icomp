import { LoginCredentials, LoginResponse } from "../types/login";

export const loginService = {
  async authenticate(data: LoginCredentials): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "erro@teste.com") {
      throw new Error("Erro ao realizar login. Verifique suas credenciais.");
    }

    if (data.email === "pedagogo@teste.com") {
      return {
        user: {
          id: "1",
          name: "Pedagogo Teste",
          email: "pedagogo@teste.com",
          phoneNumber: "123456789",
          registrationNumber: "123456",
          status: "Active",
          role: "Pedagogue",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    return {
      user: {
        id: "2",
        name: "Professor Teste",
        email: "professor@teste.com",
        phoneNumber: "987654321",
        registrationNumber: "654321",
        status: "Active",
        role: "Professor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },
};
