export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const passwordPatterns = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  specialCharacter: /[^a-zA-Z0-9]/,
};

export const passwordRequirements = [
  {
    id: "length",
    label: `Entre ${PASSWORD_MIN_LENGTH} e ${PASSWORD_MAX_LENGTH} caracteres`,
    validate: (password: string) =>
      password.trim().length >= PASSWORD_MIN_LENGTH &&
      password.trim().length <= PASSWORD_MAX_LENGTH,
  },
  {
    id: "uppercase",
    label: "Uma letra maiúscula",
    validate: (password: string) =>
      passwordPatterns.uppercase.test(password.trim()),
  },
  {
    id: "lowercase",
    label: "Uma letra minúscula",
    validate: (password: string) =>
      passwordPatterns.lowercase.test(password.trim()),
  },
  {
    id: "number",
    label: "Um número",
    validate: (password: string) =>
      passwordPatterns.number.test(password.trim()),
  },
  {
    id: "special-character",
    label: "Um caractere especial",
    validate: (password: string) =>
      passwordPatterns.specialCharacter.test(password.trim()),
  },
];
