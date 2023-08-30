import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required",
    })
    .max(50, {
      message: "Name cannot be longer than 50 characters",
    }),
  imageUrl: z.string().min(1, {
    message: "Image URL is required",
  }),
});
