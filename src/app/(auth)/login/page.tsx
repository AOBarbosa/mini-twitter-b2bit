import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginForm } from "@/components/forms/login-form.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegisterForm } from "@/components/forms/register-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8">
      <header className="fixed top-0 right-0 p-4">
        <ThemeToggle />
      </header>

      <main className="w-full max-w-[480px] flex flex-col gap-6 items-center">
        <h1 className="font-bold text-4xl dark:text-primary-white text-primary-blue">
          Mini Twitter
        </h1>

        <Tabs defaultValue="login" className="w-full flex flex-col gap-10">
          <TabsList variant="line" className="w-full h-11">
            <TabsTrigger
              value="login"
              className="w-1/2 flex items-center justify-center pt-2 pb-3 font-bold cursor-pointer"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="w-1/2 flex items-center justify-center pt-2 pb-3 font-bold cursor-pointer"
            >
              Cadastrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex flex-col gap-6">
            <div>
              <h1 className="text-primary-blue dark:text-primary-white text-3xl font-bold">
                Olá, de novo!
              </h1>
              <p className="text-primary-gray dark:text-text-secondary-dark">
                Por favor, insira os seus dados para fazer o login.
              </p>
            </div>

            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="flex flex-col gap-6">
            <div>
              <h1 className="text-primary-blue dark:text-primary-white text-3xl font-bold">
                Olá, vamos começar!
              </h1>
              <p className="text-primary-gray dark:text-text-secondary-dark">
                Por favor, insira os dados solicitados para fazer cadastro.
              </p>
            </div>

            <RegisterForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
