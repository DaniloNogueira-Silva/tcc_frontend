import React, { useState } from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { IExercise } from 'app/admin/exercises/page';
import { HttpRequest } from 'utils/http-request';
import QuestionForm from './Form';

interface CardProps {
  exercisesData: IExercise[];
}

const Card = ({ exercisesData }: CardProps) => {
  const [deleteExerciseId, setDeleteExerciseId] = useState<string | null>(null);
  const [editExercise, setEditExercise] = useState<IExercise | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isAssociated, setIsAssociated] = useState(false); // Estado para verificar associação
  const httpRequest = new HttpRequest();

  // Função para verificar se o exercício está associado a alguma aula
  const checkAssociation = async (exerciseId: string) => {
    try {
      const isAssociated = await httpRequest.getClassExercise(exerciseId);
      setIsAssociated(isAssociated); // Diretamente usa o valor true/false
    } catch (error) {
      console.error('Erro ao verificar associação:', error);
      setIsAssociated(false); // Caso haja erro, assumimos que não está associado
    }
  };

  const handleDeleteExercise = async () => {
    if (!deleteExerciseId) return;

    const confirmMessage = isAssociated
      ? 'Este exercício está associado a uma aula. Tem certeza que deseja excluí-lo?'
      : 'Tem certeza que deseja excluir?';

    const confirmDelete = window.confirm(confirmMessage);
    if (!confirmDelete) return; // Se o usuário cancelar, não deleta

    try {
      await httpRequest.deleteExercise(deleteExerciseId);
      setDeleteExerciseId(null);
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Erro ao excluir exercício:', error);
      alert('Erro ao excluir exercício.');
    }
  };

  const renderExercises = (exercises: IExercise[], title: string) => (
    <div className="col-span-12">
      <h2 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {exercises.length > 0 ? (
          exercises.map((exerciseItem) => (
            <div
              key={exerciseItem._id}
              className="relative flex h-full w-full flex-col rounded-lg bg-white p-4 dark:!bg-navy-800 dark:text-white dark:shadow-none"
              onMouseEnter={() => setHoveredCard(exerciseItem._id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="mb-3">
                <p className="text-lg font-bold text-navy-700 dark:text-white">
                  {exerciseItem.statement || 'Sem nome'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Resposta: {exerciseItem.answer || 'Sem resposta definida'}
                </p>
              </div>
              <div className="mb-3 flex flex-col">
                {exerciseItem.type === 'multiple_choice' &&
                  exerciseItem.options && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Opções: {exerciseItem.options.join(', ')}
                    </p>
                  )}
                {exerciseItem.type === 'true_false' && exerciseItem.options && (
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>Opções:</p>
                    <ul className="list-disc pl-5">
                      {exerciseItem.options.map((option, index) => (
                        <li key={index}>
                          {option.statement} (
                          {option.answer ? 'Verdadeiro' : 'Falso'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="text-sm font-bold text-brand-500 dark:text-white">
                  Mostrar resposta: {exerciseItem.showAnswer ? 'Sim' : 'Não'}
                </p>
              </div>
              <div
                className={`flex space-x-2 transition-opacity duration-300 ${
                  hoveredCard === exerciseItem._id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  onClick={() => setEditExercise(exerciseItem)}
                  className="flex items-center rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
                >
                  <BsPencil size={16} />
                </button>
                <button
                  onClick={() => {
                    setDeleteExerciseId(exerciseItem._id);
                    checkAssociation(exerciseItem._id); // Verifica a associação ao clicar
                  }}
                  className="flex items-center rounded-lg bg-red-500 p-2 text-white transition hover:bg-red-600"
                >
                  <BsTrash size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Nenhum exercício disponível
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-5 p-4 shadow-shadow-500 transition-all dark:bg-navy-700 dark:shadow-none lg:grid lg:grid-cols-12">
      {renderExercises(
        exercisesData.filter((e) => e.type === 'open'),
        'Questões Abertas',
      )}
      {renderExercises(
        exercisesData.filter((e) => e.type === 'multiple_choice'),
        'Questões de Múltipla Escolha',
      )}
      {renderExercises(
        exercisesData.filter((e) => e.type === 'true_false'),
        'Questões de Verdadeiro ou Falso',
      )}

      {deleteExerciseId && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">
              {isAssociated
                ? 'Tem certeza que deseja excluir este exercício que está em uma aula?'
                : 'Tem certeza que deseja excluir?'}
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteExerciseId(null)}
                className="rounded-lg bg-gray-300 px-4 py-2 transition hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteExercise}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {editExercise && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Editar Exercício</h2>
            <QuestionForm
              reloadOnSubmit={true}
              initialData={editExercise}
              onClose={() => setEditExercise(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
