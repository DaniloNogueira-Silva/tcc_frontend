'use client';

import Default from 'components/auth/variants/DefaultAuthLayout';
import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

function SignInDefault() {
  // Estados para email e senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Função que lida com o envio do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const httpRequest = new HttpRequest();
      const data = await httpRequest.login(email, password);

      sessionStorage.setItem('token', data);

      router.push('/admin/profile');
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar login. Por favor, verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Seção de login */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Entrar
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Insira seu email e sua senha para acessar sua conta!
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <InputField
                id="email"
                label="Email*"
                extra="mb-3"
                placeholder="mail@email.com"
                type="text"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />

              {/* Senha */}
              <InputField
                id="password"
                label="Senha*"
                extra="mb-3"
                placeholder="Min. 8 caracteres"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                disabled={loading}
                className={`linear w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200'
                  }`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <div className="mt-4">
              <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Não está cadastrado ainda?
              </span>
              <a
                href="/auth/sign-up"
                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Criar uma conta
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
