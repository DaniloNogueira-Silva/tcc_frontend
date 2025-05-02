import { FaBookOpen, FaClipboardList, FaTasks, FaUser } from "react-icons/fa";

import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Sidebar (responsivo com slide no mobile) */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-100 text-black p-4 z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <h2 className="text-xl font-bold mb-6">EDUCAMAIS</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/admin/plans" className="flex items-center gap-3 hover:text-black/70">
            <FaBookOpen className="text-blue-500" />
            PLANO DE AULA
          </Link>
          <Link href="/admin/classes" className="flex items-center gap-3 hover:text-black/70">
            <FaTasks className="text-blue-500" />
            ATIVIDADES
          </Link>
          <Link href="/admin/exercises" className="flex items-center gap-3 hover:text-black/70">
            <FaClipboardList className="text-blue-500" />
            EXERCÍCIOS
          </Link>
          <Link href="/admin/profile" className="flex items-center gap-3 hover:text-black/70">
            <FaUser className="text-blue-500" />
            PERFIL
          </Link>
        </nav>
      </div>

      {/* Footbar - apenas ícones, cores distintas */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-gray-100 text-black py-2 md:hidden">
        <Link href="/admin/plans">
          <FaBookOpen className="text-blue-500" size={24} />
        </Link>
        <Link href="/admin/classes">
          <FaTasks className="text-blue-500" size={24} />
        </Link>
        <Link href="/admin/exercises">
          <FaClipboardList className="text-blue-500" size={24} />
        </Link>
        <Link href="/admin/profile">
          <FaUser className="text-blue-500" size={24} />
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
