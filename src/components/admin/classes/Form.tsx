import { useEffect, useState } from 'react';

import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  _id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

interface IGetLessonPlanResponse {
  id: string;
  name: string;
  theme: string;
}

const Form = () => {
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState('');
  const [points, setPoints] = useState(0);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [lessonPlans, setLessonPlans] = useState<IGetLessonPlanResponse[]>([]);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<string>('');

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        const httpRequest = new HttpRequest();
        const data = await httpRequest.getAllLessonPlans();
        setLessonPlans(data);
      } catch (err) {
        console.error('Erro ao carregar planos de aula.', err);
      }
    };

    fetchLessonPlans();

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
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!teacherId) {
      alert('Erro: ID do professor não encontrado!');
      setLoading(false);
      return;
    }

    if (!selectedLessonPlan) {
      alert('Selecione um plano de aula!');
      setLoading(false);
      return;
    }

    try {
      const httpRequest = new HttpRequest();
      const result = await httpRequest.createClass(
        name,
        dueDate,
        description,
        links,
        points,
        type,
        teacherId,
        selectedLessonPlan,
      );
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      alert('Ocorreu um erro ao criar a aula.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        id="name"
        label="Nome*"
        placeholder="Nome da aula"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        extra="mb-3"
      />

      <InputField
        id="due_date"
        label="Data de Entrega*"
        placeholder="YYYY-MM-DD"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        extra="mb-3"
      />

      <InputField
        id="description"
        label="Descrição*"
        placeholder="Descreva a aula"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        extra="mb-3"
      />

      <InputField
        id="links"
        label="Links*"
        placeholder="https://exemplo.com"
        type="text"
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        extra="mb-3"
      />

      <InputField
        id="points"
        label="Pontos*"
        placeholder="Quantidade de pontos"
        type="number"
        value={points}
        onChange={(e) => setPoints(Number(e.target.value))}
        extra="mb-3"
      />

      <InputField
        id="type"
        label="Tipo*"
        placeholder="Tipo de aula"
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        extra="mb-3"
      />

      <label className="block text-sm font-medium text-gray-700">
        Plano de Aula*
      </label>
      <select
        id="lesson_plan_id"
        value={selectedLessonPlan}
        onChange={(e) => setSelectedLessonPlan(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 p-2"
      >
        <option value="">Selecione um plano de aula</option>
        {lessonPlans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${
          loading
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'
        }`}
      >
        {loading ? 'Enviando...' : 'Criar Aula'}
      </button>
    </form>
  );
};

export default Form;
