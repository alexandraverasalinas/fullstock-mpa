import { z } from "zod";

const emailSchema = z
  .email({ error: "Correo electrónico inválido" })
  .min(1, { error: "El correo electrónico es requerido" });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { error: "La contraseña es requerida" }),
});

export const signupSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(6, { error: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string().min(1, { error: "Confirma tu contraseña" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });