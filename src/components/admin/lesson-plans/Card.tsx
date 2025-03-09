'use client';

import "./styles/card.css";

import { BsLink45Deg, BsPencil, BsTrash, BsX } from "react-icons/bs";
import { useEffect, useState } from "react";

import { HttpRequest } from "utils/http-request";
import { ILessonPlan } from "app/admin/plans/page";
import { JwtService } from "auth/jwtService";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CardProps {
  lessonPlansData: ILessonPlan[];
}

const themeImages: Record<string, string> = {
  FLOREST: "/img/themes/florest.png",
  CAVERN: "/img/themes/cavern.png",
  DUNGEON: "/img/themes/dungeon.png",
};

const LessonPlanCards = ({ lessonPlansData }: CardProps) => {
  const httpRequest = new HttpRequest();
  const jwtService = new JwtService();
  const router = useRouter();

  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    const verifyRole = async () => {
      const role = await jwtService.getUserRole();
      setIsTeacher(role);
    };
    verifyRole();
  }, []);

  const handleDeletePlan = async () => {
    if (!deletePlanId) return;
    await httpRequest.deleteLessonPlan(deletePlanId);
    setDeletePlanId(null);
    setTimeout(() => window.location.reload(), 500);
  };

  const handleCopyLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      alert("Link copiado para a área de transferência!");
      setInviteLink(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {lessonPlansData.map((plan) => (
        <div
          key={plan._id}
          className="border border-teal-500 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105 hover:shadow-lg relative overflow-hidden group"
        >
          <Link href="./maps">
            <img
              src={themeImages[plan.theme.toUpperCase()] || "/img/themes/default.png"}
              alt={plan.theme}
              className="w-full h-48 object-cover cursor-pointer"
            />
          </Link>
          <div className="p-4">
            <Link href="./maps">
              <h3 className="text-lg font-semibold cursor-pointer hover:underline">
                {plan.name}
              </h3>
            </Link>
          </div>

          {isTeacher && (
            <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setDeletePlanId(plan._id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center relative"
              >
                <BsTrash size={16} />
                <span className="absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">Deletar</span>
              </button>
              <button
                onClick={() => setInviteLink(`${window.location.origin}/admin/invite/${plan._id}`)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center relative"
              >
                <BsLink45Deg size={16} />
                <span className="absolute bottom-full mb-1 bg-gray-700 text-white text-xs rounded px-2 py-1 opacity-0 hover:opacity-100 transition-opacity">Convidar</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Modal de Confirmação para Exclusão */}
      {deletePlanId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Tem certeza que deseja excluir?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletePlanId(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Link de Convite */}
      {inviteLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setInviteLink(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <BsX size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Link de Convite</h2>
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="w-full border border-gray-300 p-2 rounded-lg mb-4"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-full"
            >
              Copiar Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonPlanCards;
