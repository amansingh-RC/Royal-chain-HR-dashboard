import React, { useState, useRef } from "react";
import { Upload, RefreshCw, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { syncFile, clearAllData } from "../data/api";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const inputRef            = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f || null);
    setStatus("");
    setMsg("");
  }

  async function handleClear() {
    setShowConfirm(false);
    setClearing(true);
    setStatus("");
    setMsg("");
    try {
      const result = await clearAllData();
      setStatus("done");
      setMsg(result.message + " You can now upload a fresh Excel file with new employees.");
    } catch (err) {
      setStatus("error");
      setMsg(err.message);
    } finally {
      setClearing(false);
    }
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

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mt-6 border border-red-200">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle size={18} /> Danger Zone
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Permanently delete <b>all</b> employees and attendance records from the database.
              This cannot be undone. Use this when you want to start fresh with new employee data.
            </p>
          </div>
          <button
            onClick={function() { setShowConfirm(true); }}
            disabled={clearing}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shrink-0"
          >
            <Trash2 size={16} />
            {clearing ? "Clearing..." : "Clear All Data"}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2.5 rounded-full">
                <AlertCircle className="text-red-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete All Employee Data?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              This will permanently delete <b>all employees</b> and <b>all attendance records</b>
              from the database. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={function() { setShowConfirm(false); }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SyncToDB;
