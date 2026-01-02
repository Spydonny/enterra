import { z } from "zod";

/* ================= LOGIN ================= */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Введите корректный email"),
  password: z
    .string()
    .min(6, "Пароль должен быть минимум 6 символов"),
});

/* ================= REGISTER ================= */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Минимум 2 символа"),
    lastName: z
      .string()
      .trim()
      .min(2, "Минимум 2 символа"),

    email: z
      .string()
      .trim()
      .email("Введите корректный email"),

    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .regex(/[A-Z]/, "Минимум 1 заглавная буква")
      .regex(/[0-9]/, "Минимум 1 цифра"),

    confirmPassword: z.string(),

    agreement: z.boolean().refine(Boolean, {
      message: "Необходимо принять условия",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Пароли не совпадают",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type LoginDTO = z.infer<typeof loginSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
