'use client';

import { useEffect, useState } from 'react';

import Card from 'components/admin/exercises/Card';
import General from 'components/admin/profile/General';
import { HttpRequest } from 'utils/http-request';
import ModalButton from 'components/button/ModalButton';
import QuestionForm from 'components/admin/exercises/QuestionForm';

export interface IExercise {
  _id: string;
  statement: string;
  type: string;
  answer: string;
  showAnswer: boolean;
  teacher_id: string;
  options?: string[];
}

const Exercises = () => {
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchAllExercises = async () => {
      try {
        const allExercises = await httpRequest.getAllExercises();
        setExercises(allExercises);
      } catch (error) {
        console.error('Erro ao carregar aulas:', error);
      }
    };

    fetchAllExercises();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold"></h1>
        <ModalButton buttonText="Criar exercício" modalTitle="Criar exercício">
          <div className="p-4">
            <h3 className="mb-4 text-xl font-bold">Criar Aula</h3>
            <QuestionForm />
          </div>
        </ModalButton>
      </div>

      <Card exercisesData={exercises} />

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-5 lg:col-span-6">
          <General />
        </div>
      </div>
    </div>
  );
};

export default Exercises;
