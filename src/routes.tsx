// Icon Imports
import {
  MdBarChart,
  MdHome,
  MdOutlineShoppingCart,
  MdPerson,
} from 'react-icons/md';

import { JwtService } from 'auth/jwtService';
import React from 'react';

const jwtService = new JwtService();
const isTeacher = jwtService.getUserRole();

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
    show: isTeacher,  // Apenas para professores
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: 'nft-marketplace',
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    secondary: true,
    show: true, // Disponível para todos
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <MdBarChart className="h-6 w-6" />,
    path: 'data-tables',
    show: true, // Disponível para todos
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
    show: true, // Disponível para todos
  },
  {
    name: 'Painel do Professor',
    layout: '/admin',
    path: 'professor-dashboard',
    icon: <MdHome className="h-6 w-6" />,
    show: true, // Apenas para professores
  },
];

export default routes;
