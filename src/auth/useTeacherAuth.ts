import { useEffect, useState } from 'react';

import { JwtService } from 'auth/jwtService';
import { useRouter } from 'next/navigation';

const jwtService = new JwtService(); // ✅ Mover para fora para evitar recriação a cada render

const useTeacherAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // ✅ Começa como `null` para evitar renderizações incorretas
  const router = useRouter();

  useEffect(() => {
    const getId = async () => {
      if (typeof window === 'undefined') return;

      const isTeacher = await jwtService.getUserRole();
      console.log('isTeacher', isTeacher);
      if (!isTeacher) {
        console.warn('Acesso negado. Redirecionando para página inicial...');
        router.push('/auth/sign-in');
      } else {
        setIsAuthorized(true);
      }
    };

    getId();
  }, [router]);

  return isAuthorized;
};

export default useTeacherAuth;
