import InputField from 'components/fields/InputField';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { HttpRequest } from 'utils/http-request';

interface TokenPayload {
  _id: string;
  email?: string;
  exp?: number;
  iat?: number;
}

// Definimos um tipo para cada afirmação (sub-questão) de V/F
interface TrueFalseStatement {
  statement: string;
  answer: 'true' | 'false';
}

const QuestionForm = () => {
  const [statement, setStatement] = useState(''); // Enunciado principal da questão
  const [type, setType] = useState('open');
  const [answer, setAnswer] = useState(''); // Usado apenas em questões "open" e "multiple_choice"
  const [options, setOptions] = useState<string[]>(['', '', '', '']); // Opções de múltipla escolha

  // Para verdadeiro/falso múltiplo, teremos um array de sub-afirmações
  const [trueFalseStatements, setTrueFalseStatements] = useState<
    TrueFalseStatement[]
  >([{ statement: '', answer: 'true' }]);

  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState<string | null>(null);

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

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  // Handlers para o array de afirmações True/False
  const handleTfStatementChange = (index: number, value: string) => {
    const updatedTf = [...trueFalseStatements];
    updatedTf[index].statement = value;
    setTrueFalseStatements(updatedTf);
  };

  const handleTfAnswerChange = (index: number, value: 'true' | 'false') => {
    const updatedTf = [...trueFalseStatements];
    updatedTf[index].answer = value;
    setTrueFalseStatements(updatedTf);
  };

  // Adiciona uma nova linha de V/F
  const addTrueFalseStatement = () => {
    setTrueFalseStatements([
      ...trueFalseStatements,
      { statement: '', answer: 'true' },
    ]);
  };

  // Remove uma linha de V/F
  const removeTrueFalseStatement = (index: number) => {
    const updatedTf = [...trueFalseStatements];
    updatedTf.splice(index, 1);
    setTrueFalseStatements(updatedTf);
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
      const httpRequest = new HttpRequest();

      // Dependendo do tipo de questão, montamos o payload de maneira diferente
      if (type === 'open') {
        await httpRequest.createExercise(
          statement,
          type,
          answer,
          showAnswer,
          teacherId,
        );
      } else if (type === 'multiple_choice') {
        await httpRequest.createExercise(
          statement,
          type,
          answer,
          showAnswer,
          teacherId,
          options, // aqui estamos enviando as opções
        );
      } else if (type === 'true_false') {
        // O enunciado principal vai em "statement",

        const combinedAnswers = trueFalseStatements
          .map((tf) => (tf.answer === 'true' ? 'V' : 'F'))
          .join(', ');

        await httpRequest.createExercise(
          statement,
          type,
          combinedAnswers, // não precisamos de 'answer' simples
          showAnswer,
          teacherId,
          trueFalseStatements, // enviamos nosso array de afirmações como "options"
        );
      }

      alert('Exercício criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      alert('Ocorreu um erro ao criar o exercício.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Enunciado Principal */}
      <InputField
        id="statement"
        label="Enunciado*"
        placeholder="Digite o enunciado da questão"
        type="text"
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        extra="mb-3"
      />

      {/* Tipo de Questão */}
      <label className="block text-sm font-medium text-gray-700">
        Tipo de Questão*
      </label>
      <select
        id="type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 p-2"
      >
        <option value="open">Questão Aberta</option>
        <option value="multiple_choice">Múltipla Escolha</option>
        <option value="true_false">Verdadeiro ou Falso</option>
      </select>

      {/* Caso seja Questão Aberta */}
      {type === 'open' && (
        <InputField
          id="answer"
          label="Resposta Correta*"
          placeholder="Digite a resposta"
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          extra="mb-3"
        />
      )}

      {/* Caso seja Múltipla Escolha */}
      {type === 'multiple_choice' && (
        <>
          <label className="block text-sm font-medium text-gray-700">
            Opções*
          </label>
          {options.map((option, index) => (
            <InputField
              label=""
              key={index}
              id={`option_${index}`}
              placeholder={`Opção ${index + 1}`}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              extra="mb-2"
            />
          ))}
          <InputField
            id="answer"
            label="Resposta Correta*"
            placeholder="Digite a resposta correta (ex: 1, 2, 3, 4 ou texto)"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            extra="mb-3"
          />
        </>
      )}

      {/* Caso seja Verdadeiro ou Falso com múltiplas afirmações */}
      {type === 'true_false' && (
        <>
          <p className="mb-3 text-sm text-gray-700">
            Adicione abaixo as afirmações de Verdadeiro ou Falso.
          </p>

          {/* Container que terá a barra de rolagem */}
          <div className="mb-3 max-h-64 overflow-y-auto">
            {trueFalseStatements.map((tf, index) => (
              <div
                key={index}
                className="mb-4 rounded-md border bg-gray-50 p-3"
              >
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Afirmativa {index + 1}
                </label>
                <InputField
                  id={`tfStatement_${index}`}
                  label=""
                  placeholder="Digite a afirmativa"
                  type="text"
                  value={tf.statement}
                  onChange={(e) =>
                    handleTfStatementChange(index, e.target.value)
                  }
                  extra="mb-2"
                />

                <label className="block text-sm font-medium text-gray-700">
                  Verdadeiro ou Falso?
                </label>
                <select
                  value={tf.answer}
                  onChange={(e) =>
                    handleTfAnswerChange(
                      index,
                      e.target.value as 'true' | 'false',
                    )
                  }
                  className="mb-2 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="true">Verdadeiro</option>
                  <option value="false">Falso</option>
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

      {/* Mostrar resposta ao aluno? */}
      <label className="block text-sm font-medium text-gray-700">
        Mostrar resposta ao aluno?
      </label>
      <input
        type="checkbox"
        checked={showAnswer}
        onChange={(e) => setShowAnswer(e.target.checked)}
        className="mb-3"
      />

      {/* Botão de Submit */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${
          loading
            ? 'cursor-not-allowed bg-gray-400'
            : 'bg-brand-500 hover:bg-brand-600 active:bg-brand-700'
        }`}
      >
        {loading ? 'Enviando...' : 'Criar Exercício'}
      </button>
    </form>
  );
};

export default QuestionForm;
