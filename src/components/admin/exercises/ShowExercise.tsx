import React from 'react';
import { IExercise } from 'app/admin/exercises/page';

interface ShowExerciseProps {
  exercise: IExercise;
}

const ShowExercise = ({ exercise }: ShowExerciseProps) => {
  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md dark:bg-navy-800 dark:text-white">
      <p className="text-lg font-bold text-navy-700 dark:text-white">
        {exercise.statement || 'Sem enunciado'}
      </p>

      <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
        {exercise.due_date && (
          <p>
            <strong>Data de entrega:</strong>{' '}
            {new Date(exercise.due_date).toLocaleDateString('pt-BR')}
          </p>
        )}
        <p>
          <strong>Pontos:</strong> {exercise.points ?? 'Não definido'}
        </p>
        <p>
          <strong>Nota:</strong> {exercise.grade ?? 'Não definida'}
        </p>
      </div>
    </div>
  );
};

export default ShowExercise;
