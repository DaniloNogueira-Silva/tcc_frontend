import { jwtDecode } from 'jwt-decode';

export class JwtService {
  private secretKey: string | undefined = process.env.NEXT_PUBLIC_JWT_SECRET;

  async decodeToken() {
    if (typeof window === 'undefined') return null;

    const token = sessionStorage.getItem('token');

    if (!token) {
      console.warn('Nenhum token encontrado no sessionStorage.');
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return null;
    }
  }

  async getUserId() {
    const decodedToken = await this.decodeToken();
    return decodedToken?.id || null;
  }

  async getUserRole() {
    const decodedToken = await this.decodeToken();
    console.log('decodedToken', decodedToken);
    return decodedToken?.is_teacher || false;
  }
}
