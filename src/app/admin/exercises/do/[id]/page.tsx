'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { HttpRequest } from 'utils/http-request';

interface IExercise {
  _id: string;
  statement: string;
  type: 'open' | 'multiple_choice' | 'true_false';
  options?: string[];
}

const Do = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState<IExercise | null>(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const data = await httpRequest.getExerciseById(id as string);
        setExercise(data);
      } catch (error) {
        console.error('Erro ao carregar exercício:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const handleSubmit = async () => {
    if (!answer) return alert('Resposta vazia');

    try {
      if (exercise?.type === 'multiple_choice') {
        await httpRequest.submitMultipleChoiceAnswer(exercise._id, answer);
      } else {
        alert('Tipo de exercício não suportado no envio (ainda).');
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      alert('Erro ao enviar resposta');
    }
  };

  if (loading) return <p className="p-6 text-center">Carregando...</p>;
  if (!exercise)
    return (
      <p className="p-6 text-center text-red-600">Exercício não encontrado.</p>
    );

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Exercício</h1>
      <p className="mb-6 text-lg">{exercise.statement}</p>

      {exercise.type === 'open' && (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          placeholder="Digite sua resposta..."
          className="mb-4 w-full rounded border p-2"
        />
      )}

      {exercise.type === 'multiple_choice' && (
        <div className="mb-4 space-y-2">
          {exercise.options?.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input
                type="radio"
                name="multiple_choice"
                value={opt}
                checked={answer === opt}
                onChange={() => setAnswer(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      )}

      {exercise.type === 'true_false' && (
        <div className="mb-4 space-y-2">
          <div className="mb-2">
            {exercise.options?.map((opt, index) => (
              <div key={index} className="text-sm">
                {index + 1}) {opt.statement}
              </div>
            ))}
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder='Digite a ordem: Ex: "V, F, V"'
            className="w-full rounded border p-2"
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Enviar Resposta
      </button>
    </div>
  );
};

export default Do;
