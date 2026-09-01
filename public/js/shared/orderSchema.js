import { z } from "zod";

export const orderSchema = z.object({
  email: z.email({ error: "Correo electrónico inválido" }),
  firstName: z.string().min(1, { error: "El nombre es requerido" }),
  lastName: z.string().min(1, { error: "El apellido es requerido" }),
  company: z.string().optional(),
  address: z.string().min(1, { error: "La dirección es requerida" }),
  city: z.string().min(1, { error: "La ciudad es requerida" }),
  country: z.string().min(1, { error: "El país es requerido" }),
  region: z.string().min(1, { error: "La provincia/estado es requerida" }),
  zipCode: z.string().min(1, { error: "El código postal es requerido" }),
  phone: z.string().min(1, { error: "El teléfono es requerido" }),
});