import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterDTO,
} from "@/validation/authSchemas";
import { signupApi, loginApi } from "@/data/api/auth.api";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthLogo } from "@/components/AuthLogo";

type RegisterProps = {
  onSuccess: () => void;
  onGoLogin: () => void;
};

export const Register = ({
  onSuccess,
  onGoLogin,
}: RegisterProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterDTO) => {
    await signupApi({
      email: data.email,
      password: data.password,
      full_name: `${data.firstName} ${data.lastName}`,
      agreed_to_terms: data.agreement,
      agreed_to_policy: data.agreement,
    });

    await loginApi(data.email, data.password);


    onSuccess();
  };

  return (
    <AuthLayout>
      <AuthLogo subtitle="Регистрация" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Имя + Фамилия */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              {...register("firstName")}
              placeholder="Имя"
              className={`input ${errors.firstName ? "input-error" : ""}`}
            />
            {errors.firstName && (
              <p className="error-text">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("lastName")}
              placeholder="Фамилия"
              className={`input ${errors.lastName ? "input-error" : ""}`}
            />
            {errors.lastName && (
              <p className="error-text">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            placeholder="Email"
            className={`input ${errors.email ? "input-error" : ""}`}
          />
          {errors.email && (
            <p className="error-text">{errors.email.message}</p>
          )}
        </div>

        {/* Пароль */}
        <div>
          <input
            {...register("password")}
            type="password"
            placeholder="Пароль"
            className={`input ${errors.password ? "input-error" : ""}`}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div>
          <input
            {...register("confirmPassword")}
            type="password"
            placeholder="Подтвердите пароль"
            className={`input ${
              errors.confirmPassword ? "input-error" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="error-text">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Agreement */}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("agreement")} />
          Согласен с обработкой данных
        </label>

        {errors.agreement && (
          <p className="error-text">{errors.agreement.message}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Создание..." : "Создать аккаунт"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <button
          type="button"
          onClick={onGoLogin}
          className="text-blue-600 hover:underline"
        >
          Войти
        </button>
      </p>
    </AuthLayout>
  );
};
