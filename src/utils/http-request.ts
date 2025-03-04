import axios from 'axios';

export class HttpRequest {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('token');
    }
    return null;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/login`, {
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
    isTeacher: boolean,
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/users`, {
        name,
        email,
        password,
        is_teacher: isTeacher,
      });

      console.log('response', response);
      return response.data;
    } catch (error) {
      console.log('error', error);

      throw new Error('Ocorreu um erro ao criar o usuário', error);
    }
  }

  async getAllLessonPlans() {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.baseUrl}/lesson-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos de aula:', error);
      throw error;
    }
  }

  async createClass(
    name: string,
    due_date: string,
    description: string,
    links: string,
    points: number,
    type: string,
    teacher_id: string,
    lesson_plan_id: string,
  ): Promise<any> {
    try {
      const token = this.getToken();

      const response = await axios.post(
        `${this.baseUrl}/classes`,
        {
          name,
          due_date,
          description,
          links,
          points,
          type,
          teacher_id,
          lesson_plan_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('response', response);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar aula:', error);
      throw new Error('Ocorreu um erro ao criar a aula: ' + error);
    }
  }

  async getAllClasses() {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.baseUrl}/classes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por id:', error);
      throw error;
    }
  }

  async getUser() {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.baseUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por id:', error);
      throw error;
    }
  }

  async getStatistics() {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.baseUrl}/users/statics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário por id:', error);
      throw error;
    }
  }

  async createLessonPlan(name: string, theme: string): Promise<any> {
    try {
      const token = this.getToken();

      const response = await axios.post(
        `${this.baseUrl}/lesson-plans`,
        {
          name,
          theme,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar plano de aula:', error);
      throw new Error('Ocorreu um erro ao criar plano de aula: ' + error);
    }
  }

  async getLessonPlans() {
    try {
      const token = this.getToken();

      const response = await axios.get(`${this.baseUrl}/lesson-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar planos de aula:', error);
      throw new Error('Ocorreu um erro ao buscar planos de aula: ' + error);
    }
  }

  async deleteLessonPlan(id: string) {
    try {
      const token = this.getToken();

      await axios.delete(`${this.baseUrl}/lesson-plans/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return;
    } catch (error) {
      console.error('Erro ao deletar plano de aula:', error);
      throw new Error('Ocorreu um erro ao deletar plano de aula: ' + error);
    }
  }
}
