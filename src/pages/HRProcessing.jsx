import React, { useState, useRef } from "react";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

function HRProcessing() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [processedBlob, setProcessedBlob] = useState(null);
  const inputRef = useRef();

  function handleFileChange(e) {
    const f = e.target.files[0];
    setFile(f || null);
    setStatus("");
    setProcessedBlob(null);
  }

  function handleProcess() {
    if (!file) {
      setStatus("error:Please select an Excel file first.");
      return;
    }
    setStatus("processing");

    // Simulate processing delay, then offer the same file as download
    setTimeout(function() {
      const blob = new Blob([file], { type: file.type });
      setProcessedBlob(blob);
      setStatus("done");
    }, 1500);
  }

  function handleDownload() {
    if (!processedBlob) return;
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RC_HR_Processed_" + file.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isError = status.startsWith("error:");
  const errorMsg = isError ? status.slice(6) : "";

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Manage HR Database</h1>
      <p className="text-gray-500 text-sm mb-8">Update Employee Times</p>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <FileSpreadsheet className="text-[#1D3587]" size={24} />
          <h2 className="text-xl font-semibold">Royal Chains HR Data</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6">
          Select an Excel file. The file will be processed and compressed for download.
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
            className="flex items-center gap-2 bg-[#1D3587] hover:[#1D3587] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold cursor-pointer"
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
          <p className="text-green-600 text-sm mt-4">
            File processed successfully. You can now download it and upload it to Sync to DB.
          </p>
        )}
      </div>
    </div>
  );
}

export default HRProcessing;
