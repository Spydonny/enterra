import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCompany } from "@/data/api/companies.api";
import { uploadFile, type FileMeta } from "@/data/api/files.api";

import {
  companyCreateSchema,
  type CompanyCreateDTO,
} from "@/validation/companySchemas";

import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthLogo } from "@/components/AuthLogo";

type CreateCompanyProps = {
  onSuccess: () => void;
};

export const CreateCompany = ({ onSuccess }: CreateCompanyProps) => {
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoMeta, setLogoMeta] = useState<FileMeta | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

    setUploadError(null);
    setIsUploadingLogo(true);

    try {
      const uploaded = await uploadFile(file);
      setLogoMeta(uploaded);

      setValue("logo_url", uploaded.path, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      setUploadError("Не удалось загрузить логотип");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return (
    <AuthLayout>
      <AuthLogo subtitle="Создание компании" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Name */}
        <div>
          <input
            {...register("name")}
            placeholder="Название компании"
            className="input"
          />
          {errors.name && (
            <p className="error-text">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Описание (необязательно)"
            className="input resize-none"
            rows={3}
          />
        </div>

        {/* Company type */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Тип компании
          </p>

          <div className="grid grid-cols-2 gap-2">
            {["startup", "investor", "contractor", "executor"].map(
              (type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 rounded border px-3 py-2 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    value={type}
                    {...register("company_type")}
                  />
                  <span className="capitalize text-sm">
                    {type}
                  </span>
                </label>
              )
            )}
          </div>

          {errors.company_type && (
            <p className="error-text">
              {errors.company_type.message}
            </p>
          )}
        </div>

        {/* hidden logo field */}
        <input type="hidden" {...register("logo_url")} />

        {/* Logo upload */}
        <div className="space-y-2">
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

          {uploadError && (
            <p className="error-text">{uploadError}</p>
          )}

          {logoMeta && (
            <div className="flex items-center gap-3 mt-2">
              <img
                src={logoMeta.path}
                alt="Логотип"
                className="h-14 w-14 rounded border object-cover"
              />
              <div className="text-xs text-gray-500 truncate">
                {logoMeta.filename}
              </div>
            </div>
          )}
        </div>

        <button
          className="btn-primary w-full"
          disabled={isSubmitting || isUploadingLogo}
        >
          Создать компанию
        </button>
      </form>
    </AuthLayout>
  );
};
