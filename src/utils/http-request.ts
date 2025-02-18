import axios from 'axios';

export class HttpRequest {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/user/auth`, {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error('Ocorreu um erro ao realizar o login', error);
    }
  }
}
