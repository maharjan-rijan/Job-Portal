import api from "@/lib/axios";

export const profileService = {
  update: (payload) => {
    console.log("Profile update payload:", payload);

    return api.put("/profile", payload, {
      headers: {
        Accept: "application/json",
      },
    }).then((r) => r.data);
  },
};
