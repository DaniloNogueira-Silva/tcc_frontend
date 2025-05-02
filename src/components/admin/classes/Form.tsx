import { useEffect, useState, useRef } from 'react';
import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { jwtDecode } from 'jwt-decode';
import QuestionForm from '../exercises/Form';
import { IExercise } from 'app/admin/exercises/page';

interface TokenPayload {
  _id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

interface IGetLessonPlanResponse {
  _id: string;
  name: string;
  theme: string;
}

interface FormProps {
  initialData?: any;
  onClose: () => void;
}

const ClassForm = ({ initialData, onClose }: FormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [links, setLinks] = useState(initialData?.links || '');
  const [points, setPoints] = useState(initialData?.points || 0);
  const [type, setType] = useState(initialData?.type || '');
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [lessonPlans, setLessonPlans] = useState<IGetLessonPlanResponse[]>([]);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState(
    initialData?.lesson_plan_id || '',
  );

  const [exercises, setExercises] = useState<IExercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    initialData?.exercise_id || null,
  );
  const [showCreateExerciseModal, setShowCreateExerciseModal] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const httpRequest = new HttpRequest();

        const plansData = await httpRequest.getAllLessonPlans();
        setLessonPlans(plansData);

        const exercisesData = await httpRequest.getAllExercises();
        setExercises(exercisesData);
      } catch (err) {
        console.error('Erro ao carregar dados.', err);
      }
    };

    fetchData();

    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setTeacherId(decoded._id);
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (showCreateExerciseModal) return;

      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, showCreateExerciseModal]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const httpRequest = new HttpRequest();
      let createdClassId = initialData?._id;

      if (initialData) {
        await httpRequest.updateLesson(
          initialData._id,
          name,
          dueDate,
          description,
          links,
          points,
          type,
          teacherId,
          selectedLessonPlan,
        );
      } else {
        const createdClass = await httpRequest.createLesson(
          name,
          dueDate,
          description,
          links,
          points,
          type,
          teacherId,
          selectedLessonPlan,
        );
        createdClassId = createdClass._id;
      }

      onClose();
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      alert('Ocorreu um erro ao salvar a aula.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewExerciseCreated = (newExerciseId: string) => {
    setShowCreateExerciseModal(false);
    setSelectedExerciseId(newExerciseId);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div
        ref={formRef}
        className="relative w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-navy-800 dark:text-white"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <InputField
            id="name"
            label="Nome*"
            placeholder="Nome da aula"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <InputField
            id="due_date"
            label="Data de Entrega*"
            placeholder="YYYY-MM-DD"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <InputField
            id="description"
            label="Descrição*"
            placeholder="Descreva a aula"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <InputField
            id="links"
            label="Links*"
            placeholder="https://exemplo.com"
            type="text"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <InputField
            id="points"
            label="Pontos*"
            placeholder="Quantidade de pontos"
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <InputField
            id="type"
            label="Tipo*"
            placeholder="Tipo de aula"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Plano de Aula*
          </label>
          <select
            id="lesson_plan_id"
            value={selectedLessonPlan}
            onChange={(e) => setSelectedLessonPlan(e.target.value)}
            className="mb-3 w-full rounded-md border border-gray-300 p-2 dark:bg-navy-700 dark:text-white"
          >
            <option value="">Selecione um plano de aula</option>
            {lessonPlans.map((plan) => (
              <option key={plan._id} value={plan._id}>
                {plan.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Exercício (opcional)
          </label>
          <select
            id="exercise_id"
            value={selectedExerciseId || ''}
            onChange={(e) => setSelectedExerciseId(e.target.value || null)}
            className="mb-3 w-full rounded-md border border-gray-300 p-2 dark:bg-navy-700 dark:text-white"
          >
            <option value="">Nenhum</option>
            {exercises.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.statement.slice(0, 50)}...
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowCreateExerciseModal(true)}
            className="mb-3 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Criar Exercício
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${
              loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'
            }`}
          >
            {loading
              ? 'Salvando...'
              : initialData
              ? 'Editar Aula'
              : 'Criar Aula'}
          </button>
        </form>
      </div>

      {showCreateExerciseModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="relative w-[500px] rounded-lg bg-white p-6 shadow-lg dark:bg-navy-800">
            <button
              onClick={() => setShowCreateExerciseModal(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
            >
              &times;
            </button>

            <QuestionForm
              onClose={() => setShowCreateExerciseModal(false)}
              reloadOnSubmit={false}
              onCreated={(newExerciseId) => {
                setSelectedExerciseId(newExerciseId);
                setShowCreateExerciseModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassForm;
