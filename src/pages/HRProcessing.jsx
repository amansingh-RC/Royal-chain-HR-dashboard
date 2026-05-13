import React, { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet, CheckCircle } from "lucide-react";

function HRProcessing() {
  const [file, setFile]                 = useState(null);
  const [status, setStatus]             = useState("");
  const [processedBlob, setProcessedBlob] = useState(null);
  const [stats, setStats]               = useState(null);
  const inputRef                        = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f || null);
    setStatus("");
    setProcessedBlob(null);
    setStats(null);
  }

  async function handleProcess() {
    if (!file) {
      setStatus("error:Please select an Excel file first.");
      return;
    }
    setStatus("processing");
    setStats(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("https://hr-dashboard-backend-hw9y.onrender.com/api/process", { method: "POST", body: form });

      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        // Try to surface JSON error from server, otherwise generic message
        const errMsg = ct.includes("application/json")
          ? (await res.json()).error || "Processing failed."
          : "Server returned " + res.status + ". Make sure the backend is running and restarted.";
        setStatus("error:" + errMsg);
        return;
      }

      // Read processing stats from custom header (may be missing if proxy strips it)
      const statsHeader = res.headers.get("x-process-stats");
      if (statsHeader) {
        try { setStats(JSON.parse(statsHeader)); } catch { /* ignore */ }
      }

      const blob = await res.blob();
      setProcessedBlob(blob);
      setStatus("done");
    } catch (err) {
      setStatus("error:" + err.message);
    }
  }

  function handleDownload() {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RC_HR_Processed_" + (file ? file.name.replace(/\.(xlsx|xls|csv)$/i, "") : "output") + ".xlsx";
    a.click();
    URL.revokeObjectURL(url);
  }

  const isError  = status.startsWith("error:");
  const errorMsg = isError ? status.slice(6) : "";

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Manage HR Database</h1>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <FileSpreadsheet className="text-[#1D3587]" size={24} />
          <h2 className="text-xl font-semibold">Royal Chains HR Data</h2>
        </div>
        <p className="text-gray-500 text-sm mb-2">
          Select an Excel file. the file will be processed and compressed for download. Then upload the processed file in <b>Sync to DB</b> to update the database.
        </p>

        {/* File picker */}
        <label className="block text-sm font-medium text-gray-700 mb-2">Excel File</label>
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

        {isError && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={status === "processing"}
            className="flex items-center gap-2 bg-[#1D3587] hover:bg-[#1D3587] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
          >
            <FileSpreadsheet size={18} />
            {status === "processing" ? "Processing..." : "Process & Download"}
          </button>

          {status === "done" && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
            >
              <Download size={18} />
              Download File
            </button>
          )}
        </div>

        {status === "done" && (
          <div className="mt-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-green-700 text-sm font-semibold">File processed successfully.</p>
              <p className="text-green-600 text-xs mt-2">
                Click <b>Download File</b>, then upload it in <b>Sync to DB</b>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HRProcessing;
