import React, { useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { IClass } from 'app/admin/classes/page';
import { HttpRequest } from 'utils/http-request';
import ClassForm from './Form';

interface CardProps {
  classesData: IClass[];
}

const formatDate = (isoDate?: string): string => {
  if (!isoDate) return 'Sem data';

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Data inválida';

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Card = ({ classesData }: CardProps) => {
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [editClass, setEditClass] = useState<IClass | null>(null);
  const httpRequest = new HttpRequest();

  const handleDeleteClass = async () => {
    if (!deleteClassId) return;
    await httpRequest.deleteClass(deleteClassId);
    setDeleteClassId(null);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div className="flex w-full flex-col gap-5 p-4 shadow-shadow-500 transition-all dark:bg-navy-700 dark:shadow-none lg:grid lg:grid-cols-12">
      <div className="z-20 col-span-12 grid grid-cols-1 gap-5 p-4 shadow-shadow-500 transition-all dark:bg-navy-700 dark:shadow-none md:grid-cols-3">
        {classesData.length > 0 ? (
          classesData.map((classItem) => (
            <div
              key={classItem._id}
              className="flex h-full w-full flex-col rounded-lg bg-white p-4 dark:!bg-navy-800 dark:text-white dark:shadow-none relative"
              onMouseEnter={() => setHoveredCard(classItem._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="mb-3">
                <p className="text-lg font-bold text-navy-700 dark:text-white">
                  {classItem.name || 'Sem nome'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {classItem.description || 'Sem descrição'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
                    Pontos: {classItem.points ?? 0}
                  </p>
                  <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
                    Data de entrega: {formatDate(classItem.due_date)}
                  </p>
                </div>
                <div className={`flex space-x-2 transition-opacity duration-300 ${hoveredCard === classItem._id ? 'opacity-100' : 'opacity-0'}`}>
                  <button 
                    onClick={() => setEditClass(classItem)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                  >
                    <BsPencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteClassId(classItem._id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center"
                  >
                    <BsTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-12 text-center text-gray-500 dark:text-gray-300">
            Nenhuma aula disponível
          </p>
        )}
      </div>

      {deleteClassId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Tem certeza que deseja excluir?</h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteClassId(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteClass}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {editClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Editar Aula</h2>
            <ClassForm initialData={editClass} onClose={() => setEditClass(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
