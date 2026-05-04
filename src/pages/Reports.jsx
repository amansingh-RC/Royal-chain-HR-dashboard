import React, { useState, useEffect } from "react";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { fetchReports } from "../data/api";

const MONTHS = [
  "All Months","January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function statusColor(s) {
  if (s === "DP")     return "bg-green-100 text-green-700";
  if (s === "PL")     return "bg-blue-100 text-blue-700";
  if (s === "WO")     return "bg-gray-100 text-gray-600";
  if (s === "PH")     return "bg-yellow-100 text-yellow-700";
  if (s === "ABS")    return "bg-red-100 text-red-700";
  return "bg-orange-100 text-orange-700";
}

function Reports() {
  const [search, setSearch]   = useState("");
  const [month, setMonth]     = useState("All Months");
  const [fromDate, setFrom]   = useState("");
  const [toDate, setTo]       = useState("");
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  function runFetch(s, m, f, t) {
    setLoading(true);
    setError("");
    fetchReports(s, m, f, t)
      .then(setRows)
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }

  // Load all records on mount
  useEffect(function() { runFetch("", "All Months", "", ""); }, []);

  function applyFilter() { runFetch(search, month, fromDate, toDate); }

  function exportCSV() {
    // Headers exactly match the Excel column names
    const header = [
      "Employee Name","Employee Code","Join Date","Branch","Department",
      "Day","Date","SPST","SHIFT IN","SHIFT OUT","ARRV","DEPT"
    ];
    const lines = rows.map(function(r) {
      return [
        r.name, r.code, r.joinDate, r.branch || "", r.department,
        r.day, r.date, r.spst, r.shiftIn, r.shiftOut, r.arrv, r.dept
      ].map(function(c) { return '"' + String(c || "").replace(/"/g, '""') + '"'; }).join(",");
    });
    const csv  = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "RC_Employee_Report.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Employee Reports</h1>
      <p className="text-gray-500 text-sm mb-8">Filter and export employee activity from the live database.</p>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-1">Full Employee Report</h2>
        <p className="text-gray-500 text-sm mb-5">Use the filters below to generate a report from the database.</p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input
              type="text" placeholder="Search by name or code..."
              value={search}
              onChange={function(e) { setSearch(e.target.value); }}
              className="border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300 w-52"
            />
          </div>

          <select
            value={month}
            onChange={function(e) { setMonth(e.target.value); }}
            className="border rounded-xl px-4 py-2 text-sm outline-none"
          >
            {MONTHS.map(function(m) { return <option key={m}>{m}</option>; })}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From</span>
            <input type="date" value={fromDate} onChange={function(e) { setFrom(e.target.value); }}
              className="border rounded-xl px-3 py-2 text-sm outline-none" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">To</span>
            <input type="date" value={toDate} onChange={function(e) { setTo(e.target.value); }}
              className="border rounded-xl px-3 py-2 text-sm outline-none" />
          </div>

          <button
            onClick={applyFilter}
            className="flex items-center gap-2 border border-[#1D3587] text-[#1D3587] hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Filter size={15} /> Apply Filter
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#1D3587] hover:bg-[#1D3587] text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
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
                    <th className="text-left py-3 px-3 whitespace-nowrap">Employee Name</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Employee Code</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Join Date</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Branch</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Department</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Day</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">Date</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">SPST</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">SHIFT IN</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">SHIFT OUT</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">ARRV</th>
                    <th className="text-left py-3 px-3 whitespace-nowrap">DEPT</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={12} className="text-center py-10 text-gray-400">No records found.</td>
                    </tr>
                  )}
                  {rows.map(function(r, i) {
                    return (
                      <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-medium text-[#1D3587] whitespace-nowrap">{r.name}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.code}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.joinDate}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.branch || "—"}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.department}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.day}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.date}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + statusColor(r.spst)}>
                            {r.spst}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.shiftIn}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.shiftOut}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.arrv}</td>
                        <td className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{r.dept}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">{rows.length} record(s) shown</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
