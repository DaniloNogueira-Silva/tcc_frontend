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

  async createUser(
    name: string,
    email: string,
    password: string,
    isTeacher: boolean
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/user`, {
        name,
        email,
        password,
        is_teacher: isTeacher
      });

      console.log('response', response);
      return response.data;
    } catch (error) {
      console.log('error', error);

      throw new Error('Ocorreu um erro ao criar o usuário', error);
    }
  }
}
