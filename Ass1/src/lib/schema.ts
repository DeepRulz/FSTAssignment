import { z } from "zod";

export const itemSchema = z.object({
  name: z
    .string()
    .min(3, "Item name must be at least 3 characters")
    .max(50, "Item name must be under 50 characters"),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a valid number" })
    .min(1, "Price must be at least $1")
    .max(10000, "Price cannot exceed $10,000"),
});

export type ItemInput = z.infer<typeof itemSchema>;

export type ActionResult<T> =
  | { success: true; data: T; message: string }
  | { success: false; errors: Record<string, string[]>; message: string };
