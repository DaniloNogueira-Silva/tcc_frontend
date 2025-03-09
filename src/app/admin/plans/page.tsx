'use client';

import { useEffect, useState } from 'react';

import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import LessonPlanCard from 'components/admin/lesson-plans/Card';
import ModalButton from 'components/button/ModalButton';
import useTeacherAuth from 'auth/useTeacherAuth';

export interface ILessonPlan {
  _id: string;
  name: string;
  theme: string;
  teacher_id: string;
  createdAt: string;
  updatedAt: string;
}

const Plans = () => {

  // estados
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [lessonPlans, setLessonPlans] = useState<ILessonPlan[]>([]);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        const allLessonPlans = await httpRequest.getAllLessonPlans();
        setLessonPlans(allLessonPlans);
      } catch (error) {
        console.error('Erro ao carregar planos de aulas:', error);
      }
    };

    fetchLessonPlans();
  }, []);

  const handleCreateLessonPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      await httpRequest.createLessonPlan(name, theme);
  
      const modalElement = document.querySelector(".modal");
      if (modalElement) {
        modalElement.classList.remove("open");
      }
  
      setTimeout(() => {
        window.location.reload();
      }, 500);
  
    } catch (error) {
      console.error("Erro ao criar plano de aula:", error);
      alert("Ocorreu um erro ao criar plano de aula.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bem vindo!</h1>
        <ModalButton buttonText="Registar novo plano" modalTitle="Registar novo plano">
          <div className="p-4">
            <h3 className="mb-4 text-xl font-bold">Registar novo plano</h3>
            <form onSubmit={handleCreateLessonPlan}>
              <InputField
                id="name"
                label="Nome*"
                placeholder="Nome do plano de aula"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                extra="mb-3"
              />

              <InputField
                id="theme"
                label="Tema*"
                placeholder="Tema do plano de aula"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                extra="mb-3"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700"
                  }`}
              >
                {loading ? "Enviando..." : "Criar plano"}
              </button>
            </form>
          </div>
        </ModalButton>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <LessonPlanCard lessonPlansData={lessonPlans} />
      </div>
    </div>
  );
};

export default Plans;
