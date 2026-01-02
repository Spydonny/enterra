import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterDTO,
} from "@/validation/authSchemas";
import { signupApi } from "@/data/api/auth.api";
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
      agreed_to_terms: data.agreement,
      agreed_to_policy: data.agreement,
    });

    onSuccess();
  };

  return (
    <AuthLayout>
      <AuthLogo subtitle="Регистрация" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <input {...register("firstName")} placeholder="Имя" className="input" />
          <input {...register("lastName")} placeholder="Фамилия" className="input" />
        </div>

        <input {...register("email")} placeholder="Email" className="input" />
        <input {...register("password")} type="password" placeholder="Пароль" className="input" />
        <input {...register("confirmPassword")} type="password" placeholder="Подтвердите пароль" className="input" />

        <label className="flex gap-2 text-sm">
          <input type="checkbox" {...register("agreement")} />
          Согласен с обработкой данных
        </label>

        {errors.agreement && (
          <p className="error-text">{errors.agreement.message}</p>
        )}

        <button
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          Создать аккаунт
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
