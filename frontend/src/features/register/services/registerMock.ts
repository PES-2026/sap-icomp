import { RegisterForm, RegisterResponse } from "../types/register";

const MOCK_DELAY_MS = 200;

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

export const createMockAccount = async (
  data: RegisterForm,
): Promise<RegisterResponse> => {
  await wait();

  if (data.email === "existente@teste.com") {
    throw new Error(`Email ${data.email} already exists`);
  }

  if (data.email === "erro@teste.com") {
    throw new Error("Não foi possível criar a conta.");
  }

  return {
    id: `mock-account-request-${Date.now()}`,
    name: data.name,
    email: data.email,
    phoneNumber: data.phoneNumber,
    registrationNumber: data.registrationNumber,
    role: "PROFESSOR",
    userStatus: "PENDING",
  };
};
