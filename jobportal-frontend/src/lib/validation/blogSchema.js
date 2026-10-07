import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(3, "Enter a title"),
  category: z.string().min(2, "Enter a category"),
  author: z.string().min(2, "Enter an author name"),
  excerpt: z.string().min(10, "Enter a short excerpt").max(300, "Keep the excerpt under 300 characters"),
  content: z.string().min(50, "Post content should be at least 50 characters"),
});
