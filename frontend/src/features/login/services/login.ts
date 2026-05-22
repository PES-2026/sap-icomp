import { LoginCredentials, LoginResponse } from "../types/login";

export const loginService = {
  async authenticate(data: LoginCredentials): Promise<LoginResponse> {
    // const response = await api.post<LoginResponse>("/auth/login", data, {
    //   fallbackMsg: "Não foi realizar o login.",
    // });

    return {
      user: {
        id: "aaaaaaeeeeeiiiiiioooouuuuuuuuuuuu",
        name: "Teste dos Testes Teste",
        email: "teste@teste.com",
        phoneNumber: "92985674312",
        registrationNumber: "1234443232",
        status: "Active",
        role: "Pedagogue",
        createdAt: "2026-05-21T00:00:00.000Z",
        updatedAt: "2026-05-21T00:00:00.000Z",
      },
    };
  },
};
