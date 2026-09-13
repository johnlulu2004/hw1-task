import { useState } from 'react';

/**
 * Form for creating a new todo with description and deadline.
 */
export default function TaskForm({ onCreate }) {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await onCreate({ description, deadline });
      setDescription('');
      setDeadline('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Description of Task</span>
        <input
          type="text"
          name="description"
          placeholder="Enter Text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={280}
        />
      </label>

      <label className="field field--deadline">
        <span>Deadline</span>
        <input
          type="date"
          name="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </label>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add task'}
      </button>

      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </form>
  );
}
