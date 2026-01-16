import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCompany } from "@/data/api/companies.api";
import { uploadFile, getFileUrl } from "@/data/api/files.api";
import {
  companyCreateSchema,
  type CompanyCreateDTO,
} from "@/validation/companySchemas";

type CreateCompanyProps = {
  onSuccess: () => void;
};

export const CreateCompany = ({ onSuccess }: CreateCompanyProps) => {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyCreateDTO>({
    resolver: zodResolver(companyCreateSchema),
  });

  const onSubmit = async (data: CompanyCreateDTO) => {
    await createCompany(data);
    onSuccess();
  };

  const handleLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingLogo(true);

      const uploaded = await uploadFile(file);

      // сохраняем id файла в форму
      setValue("logo_url", getFileUrl(uploaded.id), {
        shouldValidate: true,
        shouldDirty: true,
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h1 className="text-2xl font-semibold">
        Создание компании
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <input
          {...register("name")}
          placeholder="Название компании"
          className="input"
        />
        {errors.name && (
          <p className="error-text">{errors.name.message}</p>
        )}

        <textarea
          {...register("description")}
          placeholder="Описание (необязательно)"
          className="input"
        />

        {/* Company Type Radio Buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Тип компании
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="startup"
                {...register("company_type")}
                className="w-4 h-4"
              />
              <span>Startup</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="Investor"
                {...register("company_type")}
                className="w-4 h-4"
              />
              <span>Investor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="contractor"
                {...register("company_type")}
                className="w-4 h-4"
              />
              <span>Contractor</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="executor"
                {...register("company_type")}
                className="w-4 h-4"
              />
              <span>Executor</span>
            </label>
          </div>
          {errors.company_type && (
            <p className="error-text">{errors.company_type.message}</p>
          )}
        </div>

        <input type="hidden" {...register("logo_url")} />

        {/* Upload logo */}
        <div className="space-y-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="input"
          />
          {isUploadingLogo && (
            <p className="text-sm text-gray-500">
              Загрузка логотипа…
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting || isUploadingLogo}
          className="btn-primary w-full"
        >
          Создать компанию
        </button>
      </form>
    </div>
  );
};
