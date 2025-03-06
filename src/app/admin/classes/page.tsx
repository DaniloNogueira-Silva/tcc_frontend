'use client';

import { useState, useEffect } from 'react';
import General from 'components/admin/profile/General';
import ModalButton from 'components/button/ModalButton';
import Form from 'components/admin/classes/Form';
import { HttpRequest } from 'utils/http-request';
import Card from 'components/admin/classes/Card';

export interface IClass {
  _id: string;
  name: string;
  description: string;
  points: number;
  due_date: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const allClasses = await httpRequest.getAllClasses();
        console.log('Classes obtidas:', allClasses);
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
        <ModalButton buttonText="Criar aula" modalTitle="Criar aula">
          <div className="p-4">
            <h3 className="mb-4 text-xl font-bold">Criar Aula</h3>
            <Form />
          </div>
        </ModalButton>
      </div>

      <Card classesData={classes} />

      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-5 lg:col-span-6">
          <General />
        </div>
      </div>
    </div>
  );
};

export default Classes;
