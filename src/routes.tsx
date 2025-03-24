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
    name: "Plano de aulas",
    layout: "/admin",
    path: 'plans',
    icon: <MdMap className="h-6 w-6" />,
    show: true,
  },
  {
    name: 'Aulas',
    layout: '/admin',
    path: 'classes',
    icon: <MdAssignment className="h-6 w-6" />,
    show: isTeacher,
  },
  {
    name: 'Exercícios',
    layout: '/admin',
    path: 'exercises',
    icon: <MdFitnessCenter className="h-6 w-6" />,
    show: isTeacher,
  },
  {
    name: 'Perfil',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
    show: true,
  },
];

export default routes;
