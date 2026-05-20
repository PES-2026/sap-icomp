const TOKEN_KEY = "@App:token";

export const saveAuthToken = (token: string): void => {
  // Expire in {days} days
  const days = 1;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${TOKEN_KEY}=${token};expires=${date.toUTCString()};path=/;Secure;SameSite=Strict`;
};

export const clearAuthToken = (): void => {
  document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};
