const BASE = '/api';

export async function fetchDashboard() {
  const res = await fetch(BASE + '/dashboard');
  if (!res.ok) throw new Error('Failed to fetch dashboard data');
  return res.json();
}

export async function fetchEmployees(search = '', month = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (month && month !== 'All Months') params.set('month', month);
  const res = await fetch(BASE + '/employees?' + params.toString());
  if (!res.ok) throw new Error('Failed to fetch employees');
  return res.json();
}

export async function fetchEmployeeAttendance(code, month = '') {
  const params = new URLSearchParams();
  if (month && month !== 'All Months') params.set('month', month);
  const res = await fetch(BASE + '/employees/' + code + '/attendance?' + params.toString());
  if (!res.ok) throw new Error('Failed to fetch attendance');
  return res.json();
}

export async function fetchReports(search = '', month = '', from = '', to = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (month && month !== 'All Months') params.set('month', month);
  if (from)  params.set('from', from);
  if (to)    params.set('to', to);
  const res = await fetch(BASE + '/reports?' + params.toString());
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export async function syncFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(BASE + '/sync', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Sync failed');
  return data;
}
