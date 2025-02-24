'use client';
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

import General from "components/admin/profile/General";
import ModalButton from "components/button/ModalButton";
import ExerciseCard from "components/card/ExerciseCard";
import InputField from "components/fields/InputField";
import { HttpRequest } from "utils/http-request";

interface TokenPayload {
  id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

interface IGetLessonPlanResponse {
  id: string;
  name: string;
  theme: string;
}

const Classes = () => {
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState("");
  const [points, setPoints] = useState(0);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);

  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [lessonPlans, setLessonPlans] = useState<IGetLessonPlanResponse[]>([]);
  const [selectedLessonPlan, setSelectedLessonPlan] = useState<string>("");

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        const httpRequest = new HttpRequest();
        const data = await httpRequest.getAllLessonPlans();
        setLessonPlans(data);
      } catch (err) {
        console.error("Erro ao carregar planos de aula.", err);
      }
    };

    fetchLessonPlans();

    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setTeacherId(decoded.id);
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!teacherId) {
      alert("Erro: ID do professor não encontrado!");
      setLoading(false);
      return;
    }

    if (!selectedLessonPlan) {
      alert("Selecione um plano de aula!");
      setLoading(false);
      return;
    }

    try {
      const httpRequest = new HttpRequest();
      const result = await httpRequest.createClass(
        name,
        dueDate,
        url,
        points,
        type,
        teacherId,
        selectedLessonPlan 
      );
      console.log("Aula criada com sucesso:", result);
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      alert("Ocorreu um erro ao criar a aula.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Aulas</h1>
        <ModalButton buttonText="Criar aula" modalTitle="Criar aula">
          <div className="p-4">
            <h3 className="mb-4 text-xl font-bold">Criar Aula</h3>
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
                id="url"
                label="URL*"
                placeholder="https://exemplo.com"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
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
                className="w-full p-2 border border-gray-300 rounded-md mb-3"
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
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700"
                }`}
              >
                {loading ? "Enviando..." : "Criar Aula"}
              </button>
            </form>
          </div>
        </ModalButton>
      </div>

      <div className="flex w-full flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="z-20 col-span-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          <ExerciseCard title="Abstract Colors" price="0.91" />
          <ExerciseCard title="ETH AI Brain" price="0.7" />
          <ExerciseCard title="Mesh Gradients" price="2.91" />
        </div>
      </div>

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-5 lg:col-span-6">
          <General />
        </div>
      </div>
    </div>
  );
};

export default Classes;
