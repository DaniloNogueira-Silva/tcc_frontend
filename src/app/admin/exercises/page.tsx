'use client';
import General from 'components/admin/profile/General';
import ModalButton from 'components/button/ModalButton';
import ExerciseCard from 'components/card/ExerciseCard';

const Exercises = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Cabeçalho com título e botão */}
      <div className="mt-3 flex items-center justify-between">
        <h1 className="text-2xl font-bold"></h1>
        <ModalButton buttonText="Criar exercício" modalTitle="Criar exercício">
          <p>Aqui vai o formulário ou conteúdo para criar exercício</p>
        </ModalButton>
      </div>

      <div className="flex w-full flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-12 z-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          <ExerciseCard title="Abstract Colors" price="0.91" />
          <ExerciseCard title="ETH AI Brain" price="0.7" />
          <ExerciseCard title="Mesh Gradients" price="2.91" />
        </div>
      </div>

      {/* Seções inferiores da página */}
      <div className="mb-4 grid h-full grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="col-span-5 lg:col-span-6">
          <General />
        </div>
        {/* ... resto do layout */}
      </div>
    </div>
  );
};

export default Exercises;
