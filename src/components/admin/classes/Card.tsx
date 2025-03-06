import React from 'react';
import { IClass } from 'app/admin/classes/page';

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
  return (
    <div className="flex w-full flex-col gap-5 p-4 shadow-shadow-500 transition-all dark:bg-navy-700 dark:shadow-none lg:grid lg:grid-cols-12">
      <div className="z-20 col-span-12 grid grid-cols-1 gap-5 p-4 shadow-shadow-500 transition-all dark:bg-navy-700 dark:shadow-none md:grid-cols-3">
        {classesData.length > 0 ? (
          classesData.map((classItem) => (
            <div
              key={classItem._id}
              className="flex h-full w-full flex-col rounded-lg bg-white p-4 dark:!bg-navy-800 dark:text-white dark:shadow-none"
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
                <button className="rounded-lg bg-brand-900 px-4 py-2 text-base font-medium text-white transition-all duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-white/20 dark:active:bg-white/10">
                  Ação
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-12 text-center text-gray-500 dark:text-gray-300">
            Nenhuma aula disponível
          </p>
        )}
      </div>
    </div>
  );
};

export default Card;
