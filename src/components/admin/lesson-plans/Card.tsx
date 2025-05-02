'use client';

import './styles/card.css';

import { BsLink45Deg, BsPencil, BsTrash, BsX } from 'react-icons/bs';
import { useEffect, useState } from 'react';

import { HttpRequest } from 'utils/http-request';
import { ILessonPlan } from 'app/admin/plans/page';
import { JwtService } from 'auth/jwtService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CardProps {
  lessonPlansData: ILessonPlan[];
}

const themeImages: Record<string, string> = {
  FLOREST: '/img/themes/florest.png',
  CAVERN: '/img/themes/cavern.png',
  DUNGEON: '/img/themes/dungeon.png',
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
      alert('Link copiado para a área de transferência!');
      setInviteLink(null);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lessonPlansData.map((plan) => (
        <div
          key={plan._id}
          className="group relative transform overflow-hidden rounded-lg border border-teal-500 bg-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
        >
          <div className="p-4">
          <Link href={`/admin/plans/geral/${plan._id}`}>
              <h3 className="cursor-pointer text-lg font-semibold hover:underline">
                {plan.name}
              </h3>
            </Link>
          </div>

          {isTeacher && (
            <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => setDeletePlanId(plan._id)}
                className="relative flex items-center rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
              >
                <BsTrash size={16} />
                <span className="absolute bottom-full mb-1 rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:opacity-100">
                  Deletar
                </span>
              </button>
              <button
                onClick={() =>
                  setInviteLink(
                    `${window.location.origin}/admin/invite/${plan._id}`,
                  )
                }
                className="relative flex items-center rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
              >
                <BsLink45Deg size={16} />
                <span className="absolute bottom-full mb-1 rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:opacity-100">
                  Convidar
                </span>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Modal de Confirmação para Exclusão */}
      {deletePlanId && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              Tem certeza que deseja excluir?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletePlanId(null)}
                className="rounded-lg bg-gray-300 px-4 py-2 transition hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePlan}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Link de Convite */}
      {inviteLink && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setInviteLink(null)}
              className="absolute right-2 top-2 text-gray-600 hover:text-gray-800"
            >
              <BsX size={20} />
            </button>
            <h2 className="mb-4 text-lg font-semibold">Link de Convite</h2>
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="mb-4 w-full rounded-lg border border-gray-300 p-2"
            />
            <button
              onClick={handleCopyLink}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
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
