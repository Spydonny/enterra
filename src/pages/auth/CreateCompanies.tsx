import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCompany } from "@/data/api/companies.api";
import {
  uploadFile,
  type FileMeta,
} from "@/data/api/files.api";

import {
  companyCreateSchema,
  type CompanyCreateDTO,
} from "@/validation/companySchemas";

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

      // ⚠️ лучше сохранять ID файла
      setValue("logo_url", uploaded.path, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } catch (err) {
      setUploadError("Не удалось загрузить логотип");
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
        {/* Name */}
        <input
          {...register("name")}
          placeholder="Название компании"
          className="input"
        />
        {errors.name && (
          <p className="error-text">{errors.name.message}</p>
        )}

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Описание (необязательно)"
          className="input"
        />

        {/* Company type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Тип компании
          </label>

          {["startup", "investor", "contractor", "executor"].map(
            (type) => (
              <label
                key={type}
                className="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  value={type}
                  {...register("company_type")}
                  className="w-4 h-4"
                />
                <span className="capitalize">{type}</span>
              </label>
            )
          )}

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
            <p className="text-sm text-red-500">
              {uploadError}
            </p>
          )}

          {/* Preview */}
          {logoMeta && (
            <div className="mt-2">
              <img
                src={logoMeta.path}
                alt="Логотип компании"
                className="h-24 w-24 rounded object-cover border"
              />
              <p className="text-xs text-gray-500 mt-1">
                {logoMeta.filename}
              </p>
            </div>
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
