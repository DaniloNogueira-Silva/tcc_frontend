'use client';

import { useEffect, useState } from 'react';

import Banner from 'components/admin/profile/Banner';
import { HttpRequest } from 'utils/http-request';

const ProfileOverview = () => {
  const [user, setUser] = useState(null);
  const httpRequest = new HttpRequest();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const getUser = await httpRequest.getUser();
        setUser(getUser);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex w-full flex-col gap-5 lg:gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner user={user} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
