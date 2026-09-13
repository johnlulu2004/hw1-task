import { useCallback, useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskToolbar from './components/TaskToolbar';
import {
  fetchTasks,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
} from './api/tasks';
import './App.css';

const DEFAULT_FILTERS = {
  q: '',
  status: 'all',
  sort: 'deadline_asc',
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async (nextFilters = filters) => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(nextFilters);
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const handle = setTimeout(() => {
      loadTasks(filters);
    }, filters.q ? 250 : 0);

    return () => clearTimeout(handle);
  }, [filters, loadTasks]);

  async function handleCreate(payload) {
    await createTask(payload);
    await loadTasks(filters);
  }

  async function handleToggle(id) {
    await completeTask(id, { toggle: true });
    await loadTasks(filters);
  }

  async function handleUpdate(id, updates) {
    await updateTask(id, updates);
    await loadTasks(filters);
  }

  async function handleDelete(id) {
    await deleteTask(id);
    await loadTasks(filters);
  }

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="app">
      <div className="atmosphere" aria-hidden="true" />

      <header className="hero">
        <h1 className="brand">eventually!</h1>
        <TaskForm onCreate={handleCreate} />
      </header>

      <main className="workspace">
        <div className="workspace__header">
          <h2>Your list</h2>
          <p className="workspace__count">
            {loading
              ? '…'
              : `${pendingCount} pending · ${tasks.length} shown`}
          </p>
        </div>

        <TaskToolbar filters={filters} onChange={setFilters} />

        {error ? (
          <p className="banner-error" role="alert">
            {error} — is the API running on port 3001?
          </p>
        ) : null}

        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>

    </div>
  );
}
