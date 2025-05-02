import React, { useEffect, useState } from 'react';
// import { RiMoonFill, RiSunFill } from 'react-icons/ri';
// import Configurator from './Configurator';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';

import Dropdown from 'components/dropdown';
import { HttpRequest } from 'utils/http-request';
import Image from 'next/image';
import NavLink from 'components/link/NavLink';
import avatar from '/public/img/avatars/avatarSimmmple.png';

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { brandText } = props;
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark'),
  );

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
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <NavLink
            href="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </NavLink>
        </p>
      </div>

      <div className="relative mt-1 flex h-12 w-auto items-center justify-end gap-3 rounded-full bg-white px-3 py-1 shadow-md shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none">
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <Image
              width="2"
              height="20"
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          classNames={'py-2 top-8 -left-[180px] w-max'}
        >
          <div className="flex h-48 w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
            <div className="ml-4 mt-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  👋 Olá, {user?.name}
                </p>{' '}
              </div>
            </div>
            <div className="mt-3 h-px w-full bg-gray-200 dark:bg-white/20 " />

            <div className="ml-4 mt-3 flex flex-col">
              <a
                href="/admin/profile"
                className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
              >
                Perfil
              </a>
              <a
                href="/auth/sign-in"
                className="mt-3 text-sm font-medium text-red-500 hover:text-red-500"
              >
                Sair
              </a>
            </div>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
