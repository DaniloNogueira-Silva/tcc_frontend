'use client';

import Checkbox from 'components/checkbox';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

function SignInDefault() {
    // Estados para nome, email, senha e se é professor
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    // Função que lida com o envio do formulário 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const httpRequest = new HttpRequest();
            await httpRequest.createUser(
                name,
                email,
                password,
                isTeacher,
            );

            router.push('/auth/sign-in');
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
                    {/* Seção de criação de conta */}
                    <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                            Criar conta
                        </h3>
                        <form onSubmit={handleSubmit}>

                            {/* Nome */}
                            <InputField
                                id="name"
                                label="Nome*"
                                extra="mb-3"
                                placeholder="João da Silva"
                                type="text"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />

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

                            {/* Checkbox para Professor */}
                            <div className="mb-6 flex items-center">
                                <Checkbox
                                    id="is_teacher"
                                    checked={isTeacher}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setIsTeacher(e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor="is_teacher"
                                    className="ml-2 text-gray-700 dark:text-white cursor-pointer"
                                >
                                    Sou Professor
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`linear w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:bg-brand-200'
                                    }`}
                            >
                                {loading ? 'Enviando...' : 'Criar Conta'}
                            </button>
                        </form>
                    </div>
                </div>
            }
        />
    );
}

export default SignInDefault;
