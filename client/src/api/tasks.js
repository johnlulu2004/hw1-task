/**
 * Thin API client for the eventually! Express backend.
 */

const BASE = '/api/tasks';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  return data;
}

export function fetchTasks({ q = '', status = 'all', sort = 'deadline_asc' } = {}) {
  const params = new URLSearchParams({ q, status, sort });
  return request(`${BASE}?${params}`);
}

export function createTask({ description, deadline }) {
  return request(BASE, {
    method: 'POST',
    body: JSON.stringify({ description, deadline }),
  });
}

export function updateTask(id, updates) {
  return request(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function completeTask(id, { toggle = false } = {}) {
  return request(`${BASE}/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ toggle }),
  });
}

export function deleteTask(id) {
  return request(`${BASE}/${id}`, { method: 'DELETE' });
}
