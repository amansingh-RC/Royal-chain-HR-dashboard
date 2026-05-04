import defaultEmployees from './employees.js';
import defaultAttendance from './attendance.js';

const EMPLOYEES_KEY = 'rc_employees';
const ATTENDANCE_KEY = 'rc_attendance';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getEmployees() {
  return load(EMPLOYEES_KEY, defaultEmployees);
}

export function getAttendance() {
  return load(ATTENDANCE_KEY, defaultAttendance);
}

export function setEmployees(data) {
  save(EMPLOYEES_KEY, data);
}

export function setAttendance(data) {
  save(ATTENDANCE_KEY, data);
}

export function getAttendanceForEmployee(code) {
  return getAttendance().filter(function(r) { return r.code === code; });
}

export function getEmployeeSummary(code) {
  const records = getAttendanceForEmployee(code);
  const counts = { DP: 0, PL: 0, WO: 0, PH: 0, 'ABS/DP': 0, 'DP/ABS': 0, ABS: 0 };
  records.forEach(function(r) {
    if (counts[r.status] !== undefined) counts[r.status]++;
    else counts.ABS++;
  });
  const totalPresent = records.filter(function(r) {
    return r.status === 'DP' || r.status === 'DP/ABS';
  }).length;
  const totalAbsent = records.filter(function(r) {
    return r.status === 'ABS' || r.status === 'ABS/DP';
  }).length;
  return { counts, totalPresent, totalAbsent };
}

export function getDashboardStats() {
  const employees = getEmployees();
  const attendance = getAttendance();

  const latestDate = attendance.reduce(function(max, r) {
    return r.date > max ? r.date : max;
  }, '');

  const todayRecords = attendance.filter(function(r) { return r.date === latestDate; });
  const present = todayRecords.filter(function(r) { return r.status === 'DP' || r.status === 'DP/ABS'; }).length;
  const absent = todayRecords.filter(function(r) { return r.status === 'ABS' || r.status === 'ABS/DP'; }).length;

  const depts = {};
  employees.forEach(function(e) {
    if (!depts[e.department]) depts[e.department] = { present: 0, absent: 0, total: 0 };
    depts[e.department].total++;
  });

  todayRecords.forEach(function(r) {
    const emp = employees.find(function(e) { return e.code === r.code; });
    if (!emp) return;
    const d = depts[emp.department];
    if (!d) return;
    if (r.status === 'DP' || r.status === 'DP/ABS') d.present++;
    else if (r.status === 'ABS' || r.status === 'ABS/DP') d.absent++;
  });

  return {
    total: employees.length,
    present,
    absent,
    latestDate,
    departments: depts,
  };
}
