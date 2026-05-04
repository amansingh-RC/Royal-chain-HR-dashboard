import React, { useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchReports } from "../data/api";

const MONTHS = [
  "All Months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const PAGE_SIZE = 50;

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

  if (!isNaN(value) && Number(value) > 1000) {
    const excelStart = new Date(1899, 11, 30);
    const converted = new Date(excelStart.getTime() + Number(value) * 86400000);

    const day = String(converted.getDate()).padStart(2, "0");
    const month = String(converted.getMonth() + 1).padStart(2, "0");
    const year = converted.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

function formatExcelTime(value) {
  if (value === null || value === undefined || value === "") return "--";

  if (!isNaN(value) && Number(value) >= 0 && Number(value) < 1) {
    const totalSeconds = Math.round(Number(value) * 24 * 60 * 60);
    let hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      " " +
      ampm
    );
  }

  return value;
}

function Reports() {
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("All Months");
  const [fromDate, setFrom] = useState("");
  const [toDate, setTo] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function runFetch(s, m, f, t) {
    setLoading(true);
    setError("");
    setCurrentPage(1);

    fetchReports(s, m, f, t)
      .then(setRows)
      .catch(function (e) {
        setError(e.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  useEffect(function () {
    runFetch("", "All Months", "", "");
  }, []);

  function applyFilter() {
    runFetch(search, month, fromDate, toDate);
  }

  function exportCSV() {
    const header = [
      "Employee Name","Employee Code","Join Date","Branch","Department",
      "Day","Date","SPST","SHIFT IN","SHIFT OUT","ARRV","DEPT"
    ];

    const lines = rows.map(function (r) {
      return [
        r.name,
        r.code,
        formatDate(r.joinDate),
        r.branch || "",
        r.department,
        r.day,
        formatDate(r.date),
        r.spst,
        formatExcelTime(r.shiftIn),
        formatExcelTime(r.shiftOut),
        formatExcelTime(r.arrv),
        formatExcelTime(r.dept)
      ]
        .map(function (c) {
          return '"' + String(c || "").replace(/"/g, '""') + '"';
        })
        .join(",");
    });

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RC_Employee_Report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(rows.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRows = rows.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Employee Reports</h1>
      <p className="text-gray-500 text-sm mb-8">
        Filter and export employee activity from the live database.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-1">Full Employee Report</h2>
        <p className="text-gray-500 text-sm mb-5">
          Use the filters below to generate a report from the database.
        </p>

        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 w-52"
            />
          </div>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm outline-none"
          >
            {MONTHS.map((m) => <option key={m}>{m}</option>)}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <input type="date" value={fromDate} onChange={(e) => setFrom(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm outline-none" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">To</span>
            <input type="date" value={toDate} onChange={(e) => setTo(e.target.value)}
              className="border rounded-xl px-3 py-2 text-sm outline-none" />
          </div>

          <button
            onClick={applyFilter}
            className="flex items-center gap-2 border border-[#1D3587] text-[#1D3587] hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Filter size={15} /> Apply Filter
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#1D3587] text-white px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Download size={15} /> Export to Excel
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="animate-spin text-[#1D3587]" size={28} />
          </div>
        )}

        {error && <p className="text-red-500 text-sm py-4">{error}</p>}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs border-b bg-gray-50">
                    <th className="text-left py-3 px-3">Employee Name</th>
                    <th className="text-left py-3 px-3">Employee Code</th>
                    <th className="text-left py-3 px-3">Join Date</th>
                    <th className="text-left py-3 px-3">Branch</th>
                    <th className="text-left py-3 px-3">Department</th>
                    <th className="text-left py-3 px-3">Day</th>
                    <th className="text-left py-3 px-3">Date</th>
                    <th className="text-left py-3 px-3">SPST</th>
                    <th className="text-left py-3 px-3">SHIFT IN</th>
                    <th className="text-left py-3 px-3">SHIFT OUT</th>
                    <th className="text-left py-3 px-3">ARRV</th>
                    <th className="text-left py-3 px-3">DEPT</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRows.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center py-10 text-gray-400">
                        No records found.
                      </td>
                    </tr>
                  )}

                  {paginatedRows.map(function (r, i) {
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-[#1D3587]">{r.name}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.code}</td>
                        <td className="py-2.5 px-3 text-gray-600">{formatDate(r.joinDate)}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.branch || "—"}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.department}</td>
                        <td className="py-2.5 px-3 text-gray-600">{r.day}</td>
                        <td className="py-2.5 px-3 text-gray-600">{formatDate(r.date)}</td>
                        <td className="py-2.5 px-3">
                          <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + statusColor(r.spst)}>
                            {r.spst}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600">{formatExcelTime(r.shiftIn)}</td>
                        <td className="py-2.5 px-3 text-gray-600">{formatExcelTime(r.shiftOut)}</td>
                        <td className="py-2.5 px-3 text-gray-600">{formatExcelTime(r.arrv)}</td>
                        <td className="py-2.5 px-3 text-gray-600">{formatExcelTime(r.dept)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-5">
              <p className="text-xs text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + PAGE_SIZE, rows.length)} of {rows.length} records
              </p>

              <div className="flex items-center gap-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="border px-3 py-1 rounded-lg disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="border px-3 py-1 rounded-lg disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;

