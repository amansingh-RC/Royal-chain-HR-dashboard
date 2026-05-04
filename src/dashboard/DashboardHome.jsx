import React, { useState, useEffect } from "react";
import { Users, UserCheck, UserX, RefreshCw } from "lucide-react";
import { fetchDashboard } from "../data/api";

function DashboardHome() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  function load() {
    setLoading(true);
    setError("");
    fetchDashboard()
      .then(setStats)
      .catch(function(e) { setError(e.message); })
      .finally(function() { setLoading(false); });
  }

  useEffect(load, []);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 min-h-screen">
      <RefreshCw className="animate-spin text-[#1D3587]" size={36} />
    </div>
  );

  if (error) return (
    <div className="flex-1 p-8 bg-gray-100 min-h-screen">
      <p className="text-red-500 font-medium">Error: {error}</p>
      <button onClick={load} className="mt-3 text-[#1D3587] underline text-sm">Retry</button>
    </div>
  );

  const deptEntries  = Object.entries(stats.departments);
  const maxTotal     = Math.max(...deptEntries.map(function([, d]) { return d.total; }), 1);
  const maxPresent   = Math.max(...deptEntries.map(function([, d]) { return d.present; }), 1);

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">A real-time overview of your organization's status from the database.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl"><Users className="text-blue-700" size={28} /></div>
          <div>
            <p className="text-gray-500 text-sm">Total Employees</p>
            <p className="text-4xl font-bold mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl"><UserCheck className="text-green-600" size={28} /></div>
          <div>
            <p className="text-gray-500 text-sm">Present on {stats.latestDate}</p>
            <p className="text-4xl font-bold mt-1 text-green-600">{stats.present}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl"><UserX className="text-red-500" size={28} /></div>
          <div>
            <p className="text-gray-500 text-sm">Absent on {stats.latestDate}</p>
            <p className="text-4xl font-bold mt-1 text-red-500">{stats.absent}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Department Attendance */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-gray-700 mb-1">Department Attendance</h2>
          <p className="text-xs text-gray-400 mb-5">Present vs. Absent employees by department for {stats.latestDate}.</p>
          <div className="space-y-4">
            {deptEntries.map(function([dept, d]) {
              return (
                <div key={dept}>
                  <p className="text-xs text-gray-500 mb-1 truncate">{dept}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-[#1D3587] h-3 rounded-full" style={{ width: (d.present / maxPresent * 100) + '%' }} />
                    </div>
                    <span className="text-xs text-[#1D3587] w-5 text-right">{d.present}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-red-400 h-3 rounded-full" style={{ width: (d.absent / maxPresent * 100) + '%' }} />
                    </div>
                    <span className="text-xs text-red-400 w-5 text-right">{d.absent}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-[#1D3587] inline-block" /> Present</span>
            <span className="flex items-center gap-1 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Absent</span>
          </div>
        </div>

        {/* Employees by Department */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-semibold text-gray-700 mb-1">Employees by Department</h2>
          <p className="text-xs text-gray-400 mb-5">Distribution of employees across departments.</p>
          <div className="space-y-4">
            {deptEntries.map(function([dept, d]) {
              return (
                <div key={dept} className="flex items-center gap-3">
                  <p className="text-xs text-gray-600 w-36 truncate shrink-0">{dept}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className="bg-[#1D3587] h-4 rounded-full" style={{ width: (d.total / maxTotal * 100) + '%' }} />
                  </div>
                  <span className="text-xs text-gray-700 w-5 text-right">{d.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
