import { useState } from 'react';
import { formatDeadline, deadlineUrgency } from '../utils/dates';

/**
 * A single todo row with complete, edit, and delete actions.
 */
export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(task.deadline);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const urgency = deadlineUrgency(task.deadline, task.completed);

  async function handleSave(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onUpdate(task.id, { description, deadline });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle() {
    setBusy(true);
    setError('');
    try {
      await onToggle(task.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task?')) return;
    setBusy(true);
    setError('');
    try {
      await onDelete(task.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <li className={`task-item task-item--editing urgency-${urgency}`}>
        <form className="task-item__edit" onSubmit={handleSave}>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={280}
            aria-label="Edit description"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            aria-label="Edit deadline"
          />
          <div className="task-item__actions">
            <button type="submit" className="btn btn--small" disabled={busy}>
              Save
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => {
                setDescription(task.description);
                setDeadline(task.deadline);
                setEditing(false);
                setError('');
              }}
            >
              Cancel
            </button>
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </li>
    );
  }

  return (
    <li className={`task-item urgency-${urgency}${task.completed ? ' is-done' : ''}`}>
      <button
        type="button"
        className="task-item__check"
        onClick={handleToggle}
        disabled={busy}
        aria-pressed={task.completed}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
      >
        <span aria-hidden="true">{task.completed ? '✓' : ''}</span>
      </button>

      <div className="task-item__body">
        <p className="task-item__description">{task.description}</p>
        <p className="task-item__meta">
          <time dateTime={task.deadline}>{formatDeadline(task.deadline)}</time>
          <span className={`badge badge--${urgency}`}>
            {urgency === 'overdue' && 'Overdue'}
            {urgency === 'today' && 'Due today'}
            {urgency === 'soon' && 'Due soon'}
            {urgency === 'later' && 'Upcoming'}
            {urgency === 'done' && 'Done'}
          </span>
        </p>
        {error ? <p className="form-error">{error}</p> : null}
      </div>

      <div className="task-item__actions">
        <button
          type="button"
          className="btn btn--ghost btn--small"
          onClick={() => setEditing(true)}
          disabled={busy}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn btn--danger btn--small"
          onClick={handleDelete}
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
