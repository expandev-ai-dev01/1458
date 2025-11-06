/**
 * @page TaskCreatePage
 * @summary Page for creating new tasks
 * @domain task
 * @type page-component
 * @category task-management
 */

import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type { CreateTaskDto } from '@/domain/task/types';

export const TaskCreatePage = () => {
  const navigate = useNavigate();
  const { createTask, isCreating } = useTaskCreate({
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await createTask(data);
    } catch (error: unknown) {
      console.error('Error creating task:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nova Tarefa</h1>
          <p className="mt-2 text-gray-600">Preencha os campos abaixo para criar uma nova tarefa</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isCreating} />
        </div>
      </div>
    </div>
  );
};

export default TaskCreatePage;
