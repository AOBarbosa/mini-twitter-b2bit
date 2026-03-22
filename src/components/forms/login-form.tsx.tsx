"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EyeIcon, SmsIcon } from "@/icons";
import { loginSchema, LoginFormData } from "@/schemas/loginSchema";
import { useLogin } from "@/hooks/useLogin";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <form className="w-full" noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel
            htmlFor="form-email"
            className="text-sm text-primary-gray dark:text-text-secondary-dark"
          >
            E-mail
          </FieldLabel>
          <div className="flex items-center justify-between px-4 rounded-[8px] h-14 bg-primary-white dark:bg-secondary-blue border border-primary-gray/30 dark:border-text-secondary-dark/30">
            <Input
              id="form-email"
              type="email"
              placeholder="Insira o seu e-mail"
              {...register("email")}
              className="border-none bg-transparent dark:bg-secondary-blue shadow-none focus-visible:ring-0 text-primary-gray dark:text-text-secondary-dark placeholder:text-primary-gray/60 dark:placeholder:text-text-secondary-dark/60 h-full flex-1 p-0"
            />
            <SmsIcon className="text-primary-gray dark:text-text-secondary-dark" />
          </div>
          {errors.email && (
            <p className="text-xs text-primary-red mt-1">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <FieldLabel
            htmlFor="form-password"
            className="text-sm text-primary-gray dark:text-text-secondary-dark"
          >
            Senha
          </FieldLabel>
          <div className="flex items-center justify-between px-4 rounded-[8px] h-14 bg-primary-white dark:bg-secondary-blue border border-primary-gray/30 dark:border-text-secondary-dark/30">
            <Input
              id="form-password"
              type={showPassword ? "text" : "password"}
              placeholder="Insira a sua senha"
              {...register("password")}
              className="border-none bg-transparent dark:bg-secondary-blue shadow-none focus-visible:ring-0 text-primary-gray dark:text-text-secondary-dark placeholder:text-primary-gray/60 dark:placeholder:text-text-secondary-dark/60 h-full flex-1 p-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={`cursor-pointer ${showPassword ? "text-primary-blue" : "text-primary-gray dark:text-text-secondary-dark"}`}
            >
              <EyeIcon />
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-primary-red mt-1">{errors.password.message}</p>
          )}
        </Field>

        {error && (
          <p className="text-xs text-primary-red text-center">
            E-mail ou senha inválidos.
          </p>
        )}

        <Field orientation="horizontal">
          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary-blue text-primary-white w-full h-14 rounded-full font-bold disabled:opacity-60"
          >
            {isPending ? "Entrando..." : "Continuar"}
          </Button>
        </Field>

        <p className="text-center text-xs text-primary-gray dark:text-text-secondary-dark">
          Ao clicar em continuar, você concorda com nossos <br />
          <span className="underline cursor-pointer">Termos de Serviço</span> e{" "}
          <span className="underline cursor-pointer">Política de Privacidade</span>.
        </p>
      </FieldGroup>
    </form>
  );
}
