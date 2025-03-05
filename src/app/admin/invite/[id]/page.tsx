'use client'; // 🔥 Necessário para usar useState, useEffect e useParams

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { HttpRequest } from "utils/http-request";
import { JwtService } from "auth/jwtService";

const themeImages: Record<string, string> = {
    FLOREST: "/img/themes/florest.png",
    CAVERN: "/img/themes/cavern.png",
    DUNGEON: "/img/themes/dungeon.png",
};

const InvitePage = () => {
    const { id } = useParams(); // ✅ Obtém o ID da URL no App Router
    const [lessonPlanId, setLessonPlanId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [lessonPlanName, setLessonPlanName] = useState<string>("");
    const [lessonPlanTheme, setLessonPlanTheme] = useState<string>("");
    const router = useRouter();

    const jwtService = new JwtService();
    const httpRequest = new HttpRequest();

    useEffect(() => {
        const fetchUserId = async () => {
            if (id) {
                setLessonPlanId(id as string);

                try {
                    const userIdFromToken = await jwtService.getUserId();

                    setUserId(userIdFromToken);
                } catch (error) {
                    console.error("Erro ao obter ID do usuário:", error);
                }

                setLessonPlanName("Plano Exemplo");
                setLessonPlanTheme("FLOREST");
            }
        };

        fetchUserId();
    }, [id]);

    const handleJoinLesson = async () => {
        await httpRequest.createUserMap(userId as string, lessonPlanId as string);

        router.push(`/admin/plans`)
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">{lessonPlanName}</h2>
                <img
                    src={themeImages[lessonPlanTheme.toUpperCase()] || "/img/themes/default.png"}
                    alt={lessonPlanTheme}
                    className="w-full h-48 object-cover rounded-md mb-4"
                />
                <button
                    onClick={handleJoinLesson}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default InvitePage;
