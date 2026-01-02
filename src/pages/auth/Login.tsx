import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginDTO,
} from "@/validation/authSchemas";
import { loginApi } from "@/data/api/auth.api";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthLogo } from "@/components/AuthLogo";

type LoginProps = {
  onSuccess: () => void;
  onGoRegister: () => void;
};

export const Login = ({
  onSuccess,
  onGoRegister,
}: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDTO) => {
    await loginApi(data.email, data.password);
    onSuccess();
  };

  return (
    <AuthLayout>
      <AuthLogo subtitle="Войти" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div>
          <input {...register("email")} placeholder="Email" className="input" />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div>
          <input {...register("password")} type="password" placeholder="Пароль" className="input" />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <button
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          Войти
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Нет аккаунта?{" "}
        <button
          type="button"
          onClick={onGoRegister}
          className="text-blue-600 hover:underline"
        >
          Зарегистрироваться
        </button>
      </p>
    </AuthLayout>
  );
};
