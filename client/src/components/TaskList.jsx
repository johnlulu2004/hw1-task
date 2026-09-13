import TaskItem from './TaskItem';

/**
 * Renders the list of todo tasks.
 */
export default function TaskList({ tasks, loading, onToggle, onUpdate, onDelete }) {
  if (loading) {
    return <p className="list-status">Loading tasks…</p>;
  }

  if (!tasks.length) {
    return (
      <p className="list-status list-status--empty">
        Nothing here yet. Add a task above — you can finish it eventually.
      </p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
