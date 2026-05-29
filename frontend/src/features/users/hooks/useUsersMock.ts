import { UserFilters, UserListItem, UsersResponse } from "../types/user";

const MOCK_DELAY_MS = 400;

const names = [
  "Ana Silva",
  "Bruno Lima",
  "Carla Souza",
  "Daniel Costa",
  "Eduarda Martins",
  "Felipe Rocha",
  "Gabriela Alves",
  "Henrique Castro",
  "Isabela Nunes",
  "Joao Pereira",
  "Karina Ribeiro",
  "Lucas Almeida",
  "Mariana Torres",
  "Nicolas Santos",
  "Olivia Ferreira",
  "Paulo Mendes",
  "Renata Gomes",
  "Samuel Barros",
  "Tatiana Freitas",
  "Victor Lopes",
  "Amanda Correia",
  "Caio Batista",
  "Bianca Moreira",
  "Diego Araujo",
  "Elisa Teixeira",
  "Fernando Duarte",
  "Helena Ramos",
  "Igor Cardoso",
  "Julia Cavalcante",
  "Leandro Farias",
  "Monica Vieira",
  "Rafael Peixoto",
  "Sofia Monteiro",
  "Thiago Campos",
  "Valeria Reis",
  "Yasmin Oliveira",
];

export const usersList: UserListItem[] = names.map((name, index) => {
  const id = index + 1;
  const role = id % 4 === 0 ? "PEDAGOGUE" : "PROFESSOR";
  const userStatus = id % 5 === 0 ? "DISABLED" : "ENABLED";

  return {
    id: `mock-user-${id}`,
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@teste.com`,
    phoneNumber: `92999${String(id).padStart(6, "0")}`,
    registrationNumber: String(100000 + id),
    role,
    userStatus,
    createdAt: new Date(2026, 0, id).toISOString(),
    updatedAt: new Date(2026, 1, id).toISOString(),
  };
});

const wait = () => new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

export const getMockUsersResponse = async (
  page: number,
  limit: number,
  filters: UserFilters = {},
): Promise<UsersResponse> => {
  await wait();

  const normalizedName = filters.name?.toLowerCase().trim() ?? "";
  const filteredUsers = usersList.filter((user) => {
    const matchesName = user.name.toLowerCase().includes(normalizedName);
    const matchesStatus =
      !filters.userStatus || user.userStatus === filters.userStatus;

    return matchesName && matchesStatus;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
  const startIndex = (page - 1) * limit;
  const items = filteredUsers.slice(startIndex, startIndex + limit);

  return {
    totalItems,
    totalPages,
    currentPage: page,
    items,
  };
};
