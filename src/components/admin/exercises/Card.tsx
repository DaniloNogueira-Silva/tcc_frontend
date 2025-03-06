import React from 'react';
import { IExercise } from 'app/admin/exercises/page';

interface CardProps {
  exercisesData: IExercise[];
}

const Card = ({ exercisesData }: CardProps) => {
  // Separar os exercícios por tipo
  const openExercises = exercisesData.filter(
    (exercise) => exercise.type === 'open',
  );
  const multipleChoiceExercises = exercisesData.filter(
    (exercise) => exercise.type === 'multiple_choice',
  );
  const trueFalseExercises = exercisesData.filter(
    (exercise) => exercise.type === 'true_false',
  );

  // Função para renderizar os exercícios
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
              className="flex h-full w-full flex-col rounded-lg bg-white p-4 dark:!bg-navy-800 dark:text-white dark:shadow-none"
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
                {exerciseItem.type === 'multiple_choice' && exerciseItem.options && (
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
                          {option.statement} ({option.answer ? 'Verdadeiro' : 'Falso'})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-sm font-bold text-brand-500 dark:text-white">
                  Mostrar resposta: {exerciseItem.showAnswer ? 'Sim' : 'Não'}
                </p>
              </div>

              <button className="rounded-lg bg-brand-900 px-4 py-2 text-base font-medium text-white transition-all duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-white/20 dark:active:bg-white/10">
                Ação
              </button>
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
      {renderExercises(openExercises, 'Questões Abertas')}
      {renderExercises(multipleChoiceExercises, 'Questões de Múltipla Escolha')}
      {renderExercises(trueFalseExercises, 'Questões Verdadeiro ou Falso')}
    </div>
  );
};

export default Card;
