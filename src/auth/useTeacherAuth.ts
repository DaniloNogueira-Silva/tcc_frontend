import { useEffect, useState } from 'react';

import { JwtService } from 'auth/jwtService';
import { useRouter } from 'next/navigation';

const jwtService = new JwtService(); // ✅ Mover para fora para evitar recriação a cada render

const useTeacherAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null); // ✅ Começa como `null` para evitar renderizações incorretas
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTeacher = jwtService.getUserRole();

    if (!isTeacher) {
      console.warn('Acesso negado. Redirecionando para página inicial...');
      router.push('/auth/sign-in');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  return isAuthorized;
};

export default useTeacherAuth;
