import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; 

    const token = sessionStorage.getItem('token');

    if (!token) {
      window.location.href = '/auth/sign-in';
    } else {
      setIsAuthenticated(true);
    }
  }, [isClient]);

  return isAuthenticated;
};

export default useAuth;
