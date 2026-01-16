import { z } from "zod";

// companySchemas.ts
export const companyCreateSchema = z.object({
  name: z.string().min(1, "Введите название"),
  description: z.string().optional(),
  logo_url: z.string().optional(),
  company_type: z.enum(["startup", "investor", "contractor", "executor"], {
    message: "Выберите тип компании",
  }),
});


export type CompanyCreateDTO = z.infer<
  typeof companyCreateSchema
>;
