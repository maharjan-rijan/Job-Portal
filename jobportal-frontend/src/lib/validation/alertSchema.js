import { z } from "zod";

export const alertSchema = z.object({
  name: z.string().min(2, "Enter an alert name"),
  keywords: z.string().min(2, "Enter one or more keywords"),
  type: z.string().min(1, "Choose a contract type"),
  frequency: z.string().min(1, "Choose a frequency"),
});
