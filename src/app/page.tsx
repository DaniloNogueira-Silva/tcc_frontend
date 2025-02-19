import { redirect } from "next/navigation";

export default function Home({ }) {
    redirect('/auth/sign-in'); // 🔥 Redireciona qualquer acesso a "/"
}
