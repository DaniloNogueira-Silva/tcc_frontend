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
    isTeacher: boolean,
  ): Promise<any> {
    try {
      const response = await axios.post(`${this.baseUrl}/user`, {
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

      const response = await axios.get(`${this.baseUrl}/lessonPlan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar planos de aula:", error);
      throw error;
    }
  }

  async createClass(
    name: string,
    due_date: string,
    url: string,
    points: number,
    type: string,
    teacher_id: string,
    lesson_plan_id: string,
    extra_lesson_id: string | null = null,
  ): Promise<any> {
    try {
      const token = this.getToken();

      const response = await axios.post(
        `${this.baseUrl}/class`,
        {
          name,
          due_date,
          url,
          points,
          type,
          teacher_id,
          lesson_plan_id,
          extra_lesson_id,
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
}
