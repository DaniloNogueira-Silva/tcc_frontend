// Icon Imports

import {
  MdAssignment,
  MdFitnessCenter,
  MdMap,
  MdPerson
} from 'react-icons/md';

import { JwtService } from 'auth/jwtService';
import React from 'react';

const jwtService = new JwtService();
const isTeacher = await jwtService.getUserRole();

const routes = [
  {
    name: "PLANO DE AULA",
    layout: "/admin",
    path: 'plans',
    icon: <MdMap className="h-8 w-8" />,
    show: isTeacher,
  },
  {
    name: 'ATIVIDADES',
    layout: '/admin',
    path: 'classes',
    icon: <MdAssignment className="h-8 w-8" />,
    show: isTeacher === true,
  },
  {
    name: 'EXERCÍCIO',
    layout: '/admin',
    path: 'exercises',
    icon: <MdFitnessCenter className="h-8 w-8" />,
    show: isTeacher === true,
  },
  {
    name: 'PERFIL',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-8 w-8" />,
    show: isTeacher,
  },
];

export default routes;
