import React, { useState, useRef } from "react";
import { Upload, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { syncFile } from "../data/api";

const COLUMNS = [
  { header: "Employee Name", note: "" },
  { header: "Employee Code", note: "" },
  { header: "Join Date",     note: "" },
  { header: "Branch",        note: "" },
  { header: "Department",    note: "" },
  { header: "Day",           note: "" },
  { header: "Date",          note: "" },
  { header: "SPST",          note: "Status" },
  { header: "SHIFT IN",      note: "Scheduled in" },
  { header: "SHIFT OUT",     note: "Scheduled out" },
  { header: "ARRV",          note: "Actual arrival" },
  { header: "DEPT",          note: "Actual departure" },
];

function SyncToDB() {
  const [file, setFile]     = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMsg]   = useState("");
  const inputRef            = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f || null);
    setStatus("");
    setMsg("");
  }

  async function handleSync() {
    if (!file) {
      setStatus("error");
      setMsg("Please select the processed Excel file first.");
      return;
    }
    setStatus("syncing");
    setMsg("");
    try {
      const result = await syncFile(file);
      setStatus("done");
      setMsg(result.message);
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    }
  }

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Sync to Database</h1>
      <p className="text-gray-500 text-sm mb-8">
        Upload an Excel file to sync its contents to the live PostgreSQL database.
        New records are added and existing records are updated (upsert).
      </p>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl">
        <h2 className="text-xl font-semibold mb-1">Sync Employee Data</h2>
        <p className="text-gray-500 text-sm mb-4">
          Your Excel file must have these column headers (order does not matter):
        </p>

        {/* Column reference table */}
        <div className="mb-6 overflow-x-auto">
          <table className="text-xs w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-yellow-300 font-bold text-gray-800">
                {COLUMNS.map(function(c) {
                  return (
                    <th key={c.header} className="px-3 py-2 text-left border-r border-yellow-400 last:border-0 whitespace-nowrap">
                      {c.header}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                {COLUMNS.map(function(c) {
                  return (
                    <td key={c.header} className="px-3 py-1.5 text-gray-500 border-r border-gray-200 last:border-0 whitespace-nowrap">
                      {c.note || <span className="text-gray-300">—</span>}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* File upload */}
        <label className="block text-sm font-medium text-gray-700 mb-2">Processed Excel File</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition mb-6"
          onClick={function() { inputRef.current.click(); }}
        >
          <Upload className="text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 text-sm">
            {file ? file.name : "Click to choose an Excel file (.xlsx, .xls, .csv)"}
          </p>
          {file && <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleSync}
          disabled={status === "syncing"}
          className="flex items-center gap-2 bg-[#1D3587] hover:bg-[#1D3587] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
        >
          <RefreshCw size={18} className={status === "syncing" ? "animate-spin" : ""} />
          {status === "syncing" ? "Syncing to PostgreSQL..." : "Sync New Data"}
        </button>

        {status === "done" && (
          <div className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-700 text-sm font-semibold">Sync Successful!</p>
              <p className="text-green-600 text-sm mt-1">{message}</p>
              <p className="text-green-600 text-xs mt-2">
                Navigate to Dashboard, Employees, or Reports to see the updated data.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <p className="text-red-600 text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SyncToDB;
