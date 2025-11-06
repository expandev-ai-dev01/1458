/**
 * @page HomePage
 * @summary Welcome page for TODO List application
 * @domain core
 * @type page-component
 * @category public
 */

import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">TODO List</h1>
        <p className="mb-8 text-xl text-gray-600">Sistema de Gerenciamento de Tarefas</p>
        <div className="space-y-4">
          <p className="text-gray-700">Bem-vindo ao sistema de gerenciamento de tarefas.</p>
          <button
            onClick={() => navigate('/tasks/create')}
            className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
          >
            Criar Nova Tarefa
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
