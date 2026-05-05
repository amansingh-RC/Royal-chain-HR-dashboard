import React, { useState, useEffect, useCallback } from "react";
import { Search, X, Download, RefreshCw } from "lucide-react";
import { fetchEmployees, fetchEmployeeAttendance } from "../data/api";
import { formatTimeFromDecimal } from "../data/formatTime";

const MONTHS = [
  "All Months",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function statusColor(s) {
  if (s === "DP") return "bg-green-100 text-green-700";
  if (s === "PL") return "bg-blue-100 text-blue-700";
  if (s === "WO") return "bg-gray-100 text-gray-600";
  if (s === "PH") return "bg-yellow-100 text-yellow-700";
  if (s === "ABS") return "bg-red-100 text-red-700";
  return "bg-orange-100 text-orange-700";
}

function formatDate(value) {
  if (!value) return "—";

  // Excel Serial Date Number Handling
  if (!isNaN(value) && Number(value) > 1000) {
    const excelStart = new Date(1899, 11, 30);
    const converted = new Date(excelStart.getTime() + Number(value) * 86400000);

    const day = String(converted.getDate()).padStart(2, "0");
    const month = String(converted.getMonth() + 1).padStart(2, "0");
    const year = converted.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Normal SQL Date Handling
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function EmployeeModal({ employee, onClose }) {
  const [month, setMonth] = useState("All Months");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    function () {
      setLoading(true);
      fetchEmployeeAttendance(employee.code, month)
        .then(setData)
        .catch(function () {
          setData({
            records: [],
            summary: { counts: {}, totalPresent: 0, totalAbsent: 0 },
          });
        })
        .finally(function () {
          setLoading(false);
        });
    },
    [employee.code, month],
  );

  function exportCSV() {
    if (!data) return;

    const header = [
      "Employee Code",
      "Employee Name",
      "Branch",
      "Department",
      "Date",
      "Day",
      "SPST",
      "SHIFT IN",
      "SHIFT OUT",
      "ARRV",
      "DEPT",
    ];

    const rows = data.records.map(function (r) {
      return [
        employee.code,
        employee.name,
        employee.branch || "",
        employee.department,
        formatDate(r.date),
        r.day,
        r.status,
        formatTimeFromDecimal(r.shift_in),
        formatTimeFromDecimal(r.shift_out),
        formatTimeFromDecimal(r.entry),
        formatTimeFromDecimal(r.exit_time),
      ];
    });

    const csv = [header, ...rows]
      .map(function (r) {
        return r
          .map(function (c) {
            return '"' + String(c || "").replace(/"/g, '""') + '"';
          })
          .join(",");
      })
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = employee.code + "_attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const summary = data ? data.summary : {};
  const counts = summary.counts || {};

  const summaryItems = [
    { label: "DP", value: counts.DP || 0 },
    { label: "PL", value: counts.PL || 0 },
    { label: "WO", value: counts.WO || 0 },
    { label: "PH", value: counts.PH || 0 },
    { label: "ABS/DP", value: counts["ABS/DP"] || 0 },
    { label: "DP/ABS", value: counts["DP/ABS"] || 0 },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">{employee.name} – Details</h2>
            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-600">
              <span>
                <b className="text-gray-800">Code:</b> {employee.code}
              </span>
              <span>
                <b className="text-gray-800">Branch:</b>{" "}
                {employee.branch || "—"}
              </span>
              <span>
                <b className="text-gray-800">Department:</b>{" "}
                {employee.department}
              </span>
              <span>
                <b className="text-gray-800">Join Date:</b>{" "}
                {formatDate(employee.join_date)}
              </span>
              <span className="text-green-600 font-medium">
                Present: {summary.totalPresent || 0} days
              </span>
              <span className="text-red-500 font-medium">
                Absent: {summary.totalAbsent || 0} days
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 ml-4 cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-4 border-b">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Status Summary
          </p>
          <div className="grid grid-cols-6 gap-3">
            {summaryItems.map(function (item) {
              return (
                <div
                  key={item.label}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <p className="text-2xl font-bold text-gray-800">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 pt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">
            Attendance History
          </p>

          <div className="flex gap-3">
            <select
              value={month}
              onChange={function (e) {
                setMonth(e.target.value);
              }}
              className="border rounded-lg px-3 py-1.5 text-sm outline-none"
            >
              {MONTHS.map(function (m) {
                return <option key={m}>{m}</option>;
              })}
            </select>

            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1 px-6 pb-2 mt-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin text-blue-600" size={24} />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b bg-gray-50">
                  <th className="text-left py-2 px-2">Date</th>
                  <th className="text-left py-2 px-2">Day</th>
                  <th className="text-left py-2 px-2">SPST</th>
                  <th className="text-left py-2 px-2">SHIFT IN</th>
                  <th className="text-left py-2 px-2">SHIFT OUT</th>
                  <th className="text-left py-2 px-2">ARRV</th>
                  <th className="text-left py-2 px-2">DEPT</th>
                </tr>
              </thead>
              <tbody>
                {(!data || data.records.length === 0) && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      No records found.
                    </td>
                  </tr>
                )}

                {data &&
                  data.records.map(function (r, i) {
                    return (
                      <tr
                        key={i}
                        className="border-b last:border-0 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2">{formatDate(r.date)}</td>
                        <td className="py-2 px-2">{r.day}</td>
                        <td className="py-2 px-2">
                          <span
                            className={
                              "px-2 py-0.5 rounded-full text-xs font-medium " +
                              statusColor(r.status)
                            }
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-gray-600">
                          {formatTimeFromDecimal(r.shift_in)}
                        </td>
                        <td className="py-2 px-2 text-gray-600">
                          {formatTimeFromDecimal(r.shift_out)}
                        </td>
                        <td className="py-2 px-2 text-gray-600">
                          {formatTimeFromDecimal(r.entry)}
                        </td>
                        <td className="py-2 px-2 text-gray-600">
                          {formatTimeFromDecimal(r.exit_time)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="border px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Employees() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("All Months");
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(
    function () {
      setLoading(true);
      setError("");

      fetchEmployees(search, month)
        .then(setEmployees)
        .catch(function (e) {
          setError(e.message);
        })
        .finally(function () {
          setLoading(false);
        });
    },
    [search, month],
  );

  useEffect(load, [load]);

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Employee Directory</h1>
      <p className="text-gray-500 text-sm mb-8">
        Find employees and view their detailed records from the live database.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-1">Directory</h2>
        <p className="text-gray-500 text-sm mb-4">
          A list of all employees in your organization. Click 'View Details' for
          more.
        </p>

        <div className="flex gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={function (e) {
                setSearch(e.target.value);
              }}
              className="w-full border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <select
            value={month}
            onChange={function (e) {
              setMonth(e.target.value);
            }}
            className="border rounded-xl px-4 py-2 text-sm outline-none"
          >
            {MONTHS.map(function (m) {
              return <option key={m}>{m}</option>;
            })}
          </select>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-blue-600" size={28} />
          </div>
        )}

        {error && <p className="text-red-500 text-sm py-4">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs border-b bg-gray-50">
                  <th className="text-left py-3 px-3">Employee Name</th>
                  <th className="text-left py-3 px-3">Employee Code</th>
                  <th className="text-left py-3 px-3">Join Date</th>
                  <th className="text-left py-3 px-3">Branch</th>
                  <th className="text-left py-3 px-3">Department</th>
                  <th className="text-left py-3 px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      No employees found.
                    </td>
                  </tr>
                )}

                {employees.map(function (emp) {
                  return (
                    <tr
                      key={emp.code}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-3 px-3 font-medium text-blue-800">
                        {emp.name}
                      </td>
                      <td className="py-3 px-3 text-gray-600">{emp.code}</td>
                      <td className="py-3 px-3 text-gray-600">
                        {formatDate(emp.join_date)}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {emp.branch || "—"}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {emp.department}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={function () {
                            setSelected(emp);
                          }}
                          className="text-blue-700 hover:underline font-medium text-sm cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <EmployeeModal
          employee={selected}
          onClose={function () {
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

export default Employees;
