'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HttpRequest } from 'utils/http-request';

interface IStudent {
  id: string;
  name: string;
}

interface IExercise {
  id: string;
  title: string;
  students: IStudent[];
}

const ExerciseCorrection = () => {
  const params = useParams();
  const id = params.id as string;

  const [exercise, setExercise] = useState<IExercise | null>(null);
  const [grades, setGrades] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;
      try {
        const data = await httpRequest.getExerciseById(id);
        setExercise(data);
      } catch (error) {
        console.error('Erro ao carregar exercício:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleGradeChange = (studentId: string, value: string) => {
    const parsed = parseFloat(value);
    setGrades((prev) => ({
      ...prev,
      [studentId]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSubmit = async (studentId: string) => {
    const grade = grades[studentId];
    const points = Math.round(grade * 10);

    if (grade == null || isNaN(grade)) {
      alert('Nota inválida');
      return;
    }

    try {
      await httpRequest.teacherCorretion(id, grade, points);
      alert(
        `Nota ${grade} enviada com ${points} pontos para o aluno ${studentId}`,
      );
    } catch (error) {
      console.error('Erro ao enviar nota:', error);
      alert('Erro ao enviar nota');
    }
  };

  if (loading)
    return <p className="p-6 text-center">Carregando exercício...</p>;

  if (!exercise)
    return (
      <p className="p-6 text-center text-red-600">Exercício não encontrado</p>
    );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">{exercise.title}</h1>

      {!exercise.students || exercise.students.length === 0 ? (
        <p className="text-gray-500">
          Nenhum aluno realizou esse exercício ainda.
        </p>
      ) : (
        <div className="space-y-4">
          {exercise.students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between rounded-lg border p-4 shadow-sm"
            >
              <span>{student.name}</span>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={grades[student.id] ?? ''}
                  onChange={(e) =>
                    handleGradeChange(student.id, e.target.value)
                  }
                  placeholder="Nota"
                  className="w-20 rounded border px-2 py-1"
                />
                <button
                  onClick={() => handleSubmit(student.id)}
                  className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  Enviar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseCorrection;
