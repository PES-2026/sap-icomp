import { RegisterForm, RegisterResponse } from "../types/register";

export const registerService = {
  async createAccount(data: RegisterForm): Promise<RegisterResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "erro@teste.com") {
      throw new Error("Erro ao criar conta. Verifique os dados informados.");
    }

    return {
      user: {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        registrationNumber: data.registrationNumber,
        status: "Pending",
        role: "Professor",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  },
};
