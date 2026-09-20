import api from "@/lib/axios";

/**
 * Expects a backend endpoint at PUT /profile that updates the current
 * user's `name`/`email` and, for employers, upserts their `company`
 * row in one request — mirroring how `AuthController::register` creates
 * both in one go. Not yet implemented on the backend as of this file;
 * see the note where this is wired up in EmployerProfileForm.jsx.
 */
export const profileService = {
  update: (payload) => api.put("/profile", payload).then((r) => r.data),
};
