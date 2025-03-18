'use client';

import { useEffect, useState } from 'react';

import Card from 'components/admin/classes/Card';
import ClassForm from 'components/admin/classes/Form';
import General from 'components/admin/profile/General';
import { HttpRequest } from 'utils/http-request';


export interface IClass {
  _id: string;
  name: string;
  description: string;
  points: number;
  due_date: string;
  links: string;
  type: string;
  lesson_plan_id: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const allClasses = await httpRequest.getAllClasses();
        setClasses(allClasses);
      } catch (error) {
        console.error('Erro ao carregar aulas:', error);
      }
    };

    fetchAllClasses();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Aulas</h1>
        <button
          className="rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
          onClick={() => setIsFormOpen(true)}
        >
          Criar aula
        </button>
      </div>

      <Card classesData={classes} />

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-5 lg:col-span-6">
          <General />
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
          <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="mb-4 text-xl font-bold">Criar Aula</h3>
            <ClassForm onClose={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
