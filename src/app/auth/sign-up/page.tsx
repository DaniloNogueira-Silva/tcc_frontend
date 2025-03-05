'use client';

import Default from 'components/auth/variants/DefaultAuthLayout';
import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SignInDefault() {
    // Estados para nome, email, senha e se é professor
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT'); // Definição de valor padrão
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
                role, // Garante que o role é enviado corretamente
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

                            {/* Select para Professor ou Estudante */}
                            <div className="mb-6 flex items-center">
                                <label htmlFor="role" className="mr-2 font-medium">Função:</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="STUDENT">Estudante</option>
                                    <option value="TEACHER">Professor</option>
                                </select>
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
