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
    <div className="flex w-full justify-center items-center">
      <Banner user={user} />
    </div>
  );
};

export default ProfileOverview;
