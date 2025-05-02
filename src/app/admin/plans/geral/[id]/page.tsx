'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import LessonCard from 'components/admin/classes/Card';
import ShowExercise from 'components/admin/exercises/ShowExercise';
import { HttpRequest } from 'utils/http-request';
import { IClass } from '../../../classes/page';
import { IExercise } from '../../../exercises/page';
import { useParams } from 'next/navigation';

const Geral = () => {
  const params = useParams();
  const id = params.id as string;

  const [classes, setClasses] = useState<IClass[]>([]);
  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [user, setUser] = useState<{ role: 'STUDENT' | 'TEACHER' } | null>(
    null,
  );

  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allExercises, allClasses, getUser] = await Promise.all([
          httpRequest.getAllExercises(),
          httpRequest.getAllLessons(),
          httpRequest.getUser(),
        ]);
        console.log("adsas",allClasses)
        setExercises(allExercises);
        setClasses(allClasses);
        setUser(getUser);
        console.log("dadadad",allClasses)
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) return <p className="p-6">Carregando usuário...</p>;
  console.log(exercises)
  console.log(classes)
  console.log(user)
  const filteredExercises = exercises.filter(
    (e) => e.lesson_plan_id === id,
  );
  
  const filteredClasses = classes.filter(
    (c) => c.lesson_plan_id === id,
  );

  const openQuestions = filteredExercises.filter((e) => e.type === 'open');
  const multipleChoiceQuestions = filteredExercises.filter(
    (e) => e.type === 'multiple_choice',
  );
  const trueFalseQuestions = filteredExercises.filter(
    (e) => e.type === 'true_false',
  );

  const renderSection = (title: string, data: IExercise[]) => (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {data.length > 0 ? (
        data.map((exercise) => {
          const href =
            user.role === 'TEACHER'
              ? `/admin/exercises/correction/${exercise._id}`
              : `/admin/exercises/do/${exercise._id}`;

          return (
            <Link
              key={exercise._id}
              href={href}
              className="block hover:underline"
            >
              <ShowExercise exercise={exercise} />
            </Link>
          );
        })
      ) : (
        <p className="text-sm text-gray-500">Nenhum exercício disponível</p>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Aulas</h2>
      <LessonCard classesData={filteredClasses} showActions={false} />

      <hr className="my-8" />

      <h2 className="mb-4 text-2xl font-bold">Exercícios</h2>
      <div className="grid gap-6">
        {renderSection('Questões Abertas', openQuestions)}
        {renderSection('Questões de Múltipla Escolha', multipleChoiceQuestions)}
        {renderSection('Questões de Verdadeiro ou Falso', trueFalseQuestions)}
      </div>
    </div>
  );
};

export default Geral;
