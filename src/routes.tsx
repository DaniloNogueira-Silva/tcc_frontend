// Icon Imports

import {
  MdAssignment,
  MdBarChart,
  MdFitnessCenter,
  MdHome,
  MdMap,
  MdOutlineShoppingCart,
  MdPerson
} from 'react-icons/md';

import { JwtService } from 'auth/jwtService';
import React from 'react';

const jwtService = new JwtService();
const isTeacher = await jwtService.getUserRole();

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
    show: isTeacher, 
  },
  {
    name: "Plano de aulas",
    layout: "/admin",
    path: 'plans',
    icon: <MdMap className="h-6 w-6" />,
    show: true,  
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: 'nft-marketplace',
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    secondary: true,
    show: isTeacher,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <MdBarChart className="h-6 w-6" />,
    path: 'data-tables',
    show: isTeacher,
  },
  {
    name: 'Perfil',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
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
];

export default routes;
