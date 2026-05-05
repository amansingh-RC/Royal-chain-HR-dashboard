import React, { useState, useRef } from "react";
import {
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Trash2,
  Download,
} from "lucide-react";
import { syncFile, clearAllData } from "../data/api";

function SyncToDB() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [clearing, setClearing] = useState(false);
  const inputRef = useRef();

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
      setMsg(
        result.message +
          " You can now upload a fresh Excel file with new employees.",
      );
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

  function downloadDummyCSV() {
    const csvContent =
      `Employee Name,Employee Code,Join Date,Branch,Department,Day,Date,SPST,SHIFT IN,SHIFT OUT,ARRV,DEPT\n` +
      `Aman Kumar,EMP001,01-01-2025,Mumbai,IT,Monday,01-05-2026,DP,09:00 AM,06:00 PM,09:05 AM,06:10 PM\n` +
      `Rahul Sharma,EMP002,15-02-2025,Delhi,HR,Monday,01-05-2026,WO,09:30 AM,06:30 PM,09:28 AM,06:35 PM\n` +
      `Priya Singh,EMP003,20-03-2025,Pune,Accounts,Monday,01-05-2026,ABS,09:00 AM,06:00 PM,--,--`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "Employee_Dummy_Format.csv");
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Sync to Database</h1>
      <p className="text-gray-500 text-sm mb-8">
        Upload an Excel/CSV file to sync its contents to the live PostgreSQL
        database. New records are added and existing records are updated
        automatically.
      </p>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Sync Employee Data</h2>

        {/* Dummy CSV Download Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-[#1D3587] mb-2">
            Need File Format?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Download the dummy CSV template, replace the sample employee data
            with your actual data, save the file, and upload it below for
            syncing.
          </p>

          <button
            onClick={downloadDummyCSV}
            className="flex items-center gap-2 bg-[#1D3587] hover:bg-[#1D3587] text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Download size={16} />
            Export Dummy Data
          </button>
        </div>

        {/* File Upload */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Processed Excel / CSV File
        </label>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition mb-6"
          onClick={() => inputRef.current.click()}
        >
          <Upload className="text-gray-400 mb-2" size={32} />
          <p className="text-gray-500 text-sm">
            {file
              ? file.name
              : "Click to choose an Excel file (.xlsx, .xls, .csv)"}
          </p>
          {file && (
            <p className="text-xs text-gray-400 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          )}
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
          className="flex items-center gap-2 bg-[#1D3587] hover:bg-[#16296b] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
        >
          <RefreshCw
            size={18}
            className={status === "syncing" ? "animate-spin" : ""}
          />
          {status === "syncing" ? "Syncing to PostgreSQL..." : "Sync New Data"}
        </button>

        {status === "done" && (
          <div className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-700 text-sm font-semibold">
                Sync Successful!
              </p>
              <p className="text-green-600 text-sm mt-1">{message}</p>
              <p className="text-green-600 text-xs mt-2">
                Navigate to Dashboard, Employees, or Reports to see the updated
                data.
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
              Permanently delete all employees and attendance records from the
              database. This cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            disabled={clearing}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shrink-0"
          >
            <Trash2 size={16} />
            {clearing ? "Clearing..." : "Clear All Data"}
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2.5 rounded-full">
                <AlertCircle className="text-red-600" size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delete All Employee Data?
              </h3>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              This will permanently delete all employees and attendance records.
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
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
