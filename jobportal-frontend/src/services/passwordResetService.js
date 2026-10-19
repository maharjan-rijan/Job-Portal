import api from "@/lib/axios";

/**
 * Forgot-password API.  Backend contract (to be built next):
 *
 *   POST /auth/forgot-password  { email, method: "link" | "otp" }
 *        -> 200 { message }       emails a reset link OR a 6-digit code
 *        -> 404 / 422             email isn't registered
 *   POST /auth/verify-otp       { email, otp }
 *        -> 200 { token }         one-time reset token (same kind the email link carries)
 *        -> 422                   wrong or expired code
 *   POST /auth/reset-password   { email, token, password, password_confirmation }
 *        -> 200 { message }
 *        -> 422                   invalid/expired token, weak password
 *
 * Both flows end on the same /reset-password?token=…&email=… page.
 *
 * Set VITE_MOCK_PASSWORD_RESET=true in .env to try the whole UI before the
 * backend exists: no request is made, the code is always 123456, and an email
 * containing "unknown" behaves as "not registered".
 */
const MOCK = import.meta.env.VITE_MOCK_PASSWORD_RESET === "true";

const wait = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

export const OTP_LENGTH = 6;

export const passwordResetService = {
  async sendReset({ email, method }) {
    if (MOCK) {
      await wait();
      if (email.includes("unknown"))
        throw new Error("No account found with this email address");
      return { message: method === "otp" ? "Code sent" : "Link sent" };
    }
    return api
      .post("/auth/forgot-password", { email, method })
      .then((r) => r.data);
  },

  async verifyOtp({ email, otp }) {
    if (MOCK) {
      await wait();
      if (otp !== "123456")
        throw new Error("That code is incorrect or has expired");
      return { token: "mock-reset-token" };
    }
    return api.post("/auth/verify-otp", { email, otp }).then((r) => r.data);
  },

  async resetPassword({ email, token, password }) {
    if (MOCK) {
      await wait();
      return { message: "Password reset" };
    }
    return api
      .post("/auth/reset-password", {
        email,
        token,
        password,
        password_confirmation: password,
      })
      .then((r) => r.data);
  },
};
