export const userService = {
  updateProfile: async (data: any) => {
    // stub: simulate network latency and return the payload
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, user: data }), 200);
    });
  },
};
