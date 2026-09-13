/**
 * Search, status filter, and sort controls for the task list.
 */
export default function TaskToolbar({ filters, onChange }) {
  return (
    <div className="toolbar">
      <label className="toolbar__search">
        <span className="visually-hidden">Search tasks</span>
        <input
          type="search"
          placeholder="Search by keyword…"
          value={filters.q}
          onChange={(e) => onChange({ ...filters, q: e.target.value })}
        />
      </label>

      <label>
        <span className="visually-hidden">Filter by status</span>
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label>
        <span className="visually-hidden">Sort tasks</span>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="deadline_asc">Deadline ↑</option>
          <option value="deadline_desc">Deadline ↓</option>
          <option value="status">Status then deadline</option>
          <option value="created_desc">Newest first</option>
        </select>
      </label>
    </div>
  );
}
