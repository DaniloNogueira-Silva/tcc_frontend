'use client';

import { useEffect, useState } from 'react';

import Card from 'components/admin/exercises/Card';
import { HttpRequest } from 'utils/http-request';
import QuestionForm from 'components/admin/exercises/Form';

export interface IExercise {
  _id: string;
  statement: string;
  type: string;
  answer: string;
  showAnswer: boolean;
  teacher_id: string;
  options?: any[];
}

const Exercises = () => {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const allExercises = await httpRequest.getAllExercises();
        setExercises(allExercises);
      } catch (error) {
        console.error('Erro ao carregar exercícios:', error);
      }
    };

    fetchAllExercises();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Exercícios</h1>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
          onClick={() => setIsFormOpen(true)}
        >
          Criar exercício
        </button>
      </div>

      <Card exercisesData={exercises} />

      {isFormOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="mb-4 text-xl font-bold">Criar Exercício</h3>
            <QuestionForm reloadOnSubmit={true} onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
