import { useEffect, useState, useRef } from 'react';
import { HttpRequest } from 'utils/http-request';
import InputField from 'components/fields/InputField';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  _id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

interface TrueFalseStatement {
  statement: string;
  answer: 'true' | 'false';
}

interface FormProps {
  initialData?: any;
  reloadOnSubmit: boolean;
  onCreated?: (exerciseId: string) => void;
  onClose: () => void;
}

const QuestionForm = ({
  initialData,
  onCreated,
  onClose,
  reloadOnSubmit = true,
}: FormProps) => {
  const [statement, setStatement] = useState('');
  const [type, setType] = useState<'open' | 'multiple_choice' | 'true_false'>(
    'open',
  );
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  const [trueFalseStatements, setTrueFalseStatements] = useState<
    TrueFalseStatement[]
  >([{ statement: '', answer: 'true' }]);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialData) {
      setStatement(initialData.statement || '');
      setType(initialData.type || 'open');
      setAnswer(initialData.answer || '');
      setShowAnswer(initialData.showAnswer || false);

      if (initialData.type === 'multiple_choice') {
        if (
          Array.isArray(initialData.options) &&
          initialData.options.length > 0
        ) {
          setOptions(initialData.options);
        } else {
          setOptions(['']);
        }
      } else if (initialData.type === 'true_false') {
        if (
          Array.isArray(initialData.options) &&
          initialData.options.length > 0
        ) {
          const tfArray = initialData.options.map((opt: any) => ({
            statement: opt.statement,
            answer: opt.answer ? 'true' : 'false',
          }));
          setTrueFalseStatements(tfArray);
        } else {
          setTrueFalseStatements([{ statement: '', answer: 'true' }]);
        }
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          setTeacherId(decoded._id);
        } catch (error) {
          console.error('Erro ao decodificar o token:', error);
        }
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const addMultipleChoiceOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  const removeMultipleChoiceOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const addTrueFalseStatement = () => {
    setTrueFalseStatements((prev) => [
      ...prev,
      { statement: '', answer: 'true' },
    ]);
  };

  const removeTrueFalseStatement = (index: number) => {
    setTrueFalseStatements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!teacherId) {
      alert('Erro: ID do professor não encontrado!');
      setLoading(false);
      return;
    }

    try {
      let finalOptions: any[] | string[] = [];
      if (type === 'multiple_choice') {
        finalOptions = options;
      } else if (type === 'true_false') {
        finalOptions = trueFalseStatements.map((tf) => ({
          statement: tf.statement,
          answer: tf.answer === 'true',
        }));
      }

      const httpRequest = new HttpRequest();
      let createdExercise;
      if (initialData?._id) {
        createdExercise = await httpRequest.updateExercise(
          initialData._id,
          statement,
          type,
          answer,
          showAnswer,
          teacherId,
          finalOptions,
        );
      } else {
        createdExercise = await httpRequest.createExercise(
          statement,
          type,
          answer,
          showAnswer,
          teacherId,
          finalOptions,
        );
      }

      if (onCreated && createdExercise?._id) {
        onCreated(createdExercise._id);
      }

      onClose();

      if (reloadOnSubmit) {
        setTimeout(() => window.location.reload(), 500);
      }
    } catch (error) {
      console.error('Erro ao salvar exercício:', error);
      alert('Ocorreu um erro ao salvar o exercício.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div
        ref={formRef}
        className="relative w-96 rounded-lg bg-white p-6 shadow-lg dark:bg-navy-800 dark:text-white"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <InputField
            id="statement"
            label="Enunciado*"
            placeholder="Digite o enunciado da questão"
            type="text"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Questão*
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as 'open' | 'multiple_choice' | 'true_false',
              )
            }
            className="mb-3 w-full rounded-md border border-gray-300 p-2 dark:bg-navy-700 dark:text-white"
          >
            <option value="open" className="dark:text-gray-300">
              Questão Aberta
            </option>
            <option value="multiple_choice" className="dark:text-gray-300">
              Múltipla Escolha
            </option>
            <option value="true_false" className="dark:text-gray-300">
              Verdadeiro ou Falso
            </option>
          </select>

          {type === 'multiple_choice' && (
            <>
              <div className="mb-3 max-h-64 overflow-y-auto">
                {options.map((option, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-md border bg-gray-50 p-3 dark:bg-navy-800 dark:text-white"
                  >
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {`Alternativa ${index + 1}`}
                    </label>

                    <InputField
                      id={`option_${index}`}
                      label=""
                      placeholder={`Digite a alternativa ${index + 1}`}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const updated = [...options];
                        updated[index] = e.target.value;
                        setOptions(updated);
                      }}
                      extra="mb-2 dark:bg-navy-800 dark:text-white"
                    />

                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMultipleChoiceOption(index)}
                        className="mt-1 text-sm text-red-500"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMultipleChoiceOption}
                className="mb-3 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                + Adicionar outra opção
              </button>
            </>
          )}

          {type === 'true_false' && (
            <>
              <p className="mb-3 text-sm text-gray-700">
                Adicione abaixo as afirmações de Verdadeiro ou Falso.
              </p>

              <div className="mb-3 max-h-64 overflow-y-auto">
                {trueFalseStatements.map((tf, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-md border bg-gray-50 p-3 dark:bg-navy-800 dark:text-white"
                  >
                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Afirmativa {index + 1}
                    </label>
                    <InputField
                      id={`tfStatement_${index}`}
                      label=""
                      placeholder="Digite a afirmativa"
                      type="text"
                      value={tf.statement}
                      onChange={(e) => {
                        const updated = [...trueFalseStatements];
                        updated[index].statement = e.target.value;
                        setTrueFalseStatements(updated);
                      }}
                      extra="mb-2 dark:bg-navy-800 dark:text-white"
                    />

                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verdadeiro ou Falso?
                    </label>
                    <select
                      value={tf.answer}
                      onChange={(e) => {
                        const updated = [...trueFalseStatements];
                        updated[index].answer = e.target.value as
                          | 'true'
                          | 'false';
                        setTrueFalseStatements(updated);
                      }}
                      className="mb-2 w-full rounded-md border border-gray-300 p-2 dark:bg-navy-700 dark:text-white"
                    >
                      <option value="true" className="dark:text-gray-300">
                        Verdadeiro
                      </option>
                      <option value="false" className="dark:text-gray-300">
                        Falso
                      </option>
                    </select>

                    {trueFalseStatements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTrueFalseStatement(index)}
                        className="mt-1 text-sm text-red-500"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addTrueFalseStatement}
                className="mb-3 inline-flex items-center rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                + Adicionar outra afirmativa
              </button>
            </>
          )}

          <InputField
            id="answer"
            label="Resposta Correta*"
            placeholder="Digite a resposta correta"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            extra="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mostrar resposta ao aluno quando concluir o exercício?
          </label>
          <input
            type="checkbox"
            checked={showAnswer}
            onChange={(e) => setShowAnswer(e.target.checked)}
            className="mb-3 dark:bg-navy-800 dark:text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${
              loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'
            }`}
          >
            {loading
              ? 'Salvando...'
              : initialData?._id
              ? 'Editar Exercício'
              : 'Criar Exercício'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
