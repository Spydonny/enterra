import { z } from "zod";

// companySchemas.ts
export const companyCreateSchema = z.object({
  name: z.string().min(1, "Введите название"),
  description: z.string().optional(),
  logo_url: z.string().optional(),
});


export type CompanyCreateDTO = z.infer<
  typeof companyCreateSchema
>;
