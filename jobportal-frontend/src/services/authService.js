import api from "@/lib/axios";

export const authService = {
  login: (credentials) =>
    api.post("/auth/login", credentials).then((r) => r.data),

  // Step 1 of sign-up: validates the form and emails a 6-digit code. No account / token yet.
  register: (payload) =>
    api.post("/auth/register", payload).then((r) => r.data),

  // Step 2: right code -> the account is created. 201 { message }.
  verifyRegistration: ({ email, otp }) =>
    api.post("/auth/register/verify", { email, otp }).then((r) => r.data),

  resendRegistrationCode: ({ email }) =>
    api.post("/auth/register/resend", { email }).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),

  changePassword: (payload) =>
    api.post("/auth/change-password", payload).then((r) => r.data),
};
