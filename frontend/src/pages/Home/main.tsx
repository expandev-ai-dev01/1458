/**
 * @page HomePage
 * @summary Welcome page for TODO List application
 * @domain core
 * @type page-component
 * @category public
 */

export const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">TODO List</h1>
        <p className="mb-8 text-xl text-gray-600">Sistema de Gerenciamento de Tarefas</p>
        <div className="space-y-4">
          <p className="text-gray-700">Bem-vindo ao sistema de gerenciamento de tarefas.</p>
          <p className="text-sm text-gray-500">
            A estrutura base está pronta para receber as funcionalidades.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
