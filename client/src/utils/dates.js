/**
 * Format a deadline date for display.
 */
export function formatDeadline(isoDate) {
  if (!isoDate) return '';
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Relative urgency label based on today vs deadline.
 */
export function deadlineUrgency(isoDate, completed) {
  if (completed) return 'done';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${isoDate}T00:00:00`);
  const diffDays = Math.round((deadline - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 3) return 'soon';
  return 'later';
}
