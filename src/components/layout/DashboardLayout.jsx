import React, { useState, useEffect } from "react";
import { ServerCrash } from "lucide-react";
import Sidebar from "./Sidebar";
import DashboardHome from "../../dashboard/DashboardHome";
import Profile from "../../pages/Profile";
import Employees from "../../pages/Employees";
import Reports from "../../pages/Reports";
import SyncToDB from "../../pages/SyncToDB";
import HRProcessing from "../../pages/HRProcessing";

function ServerOfflineBanner() {
  return (
    <div className="bg-red-600 text-white px-6 py-3 hidden items-center gap-3 text-sm none">
      <ServerCrash size={18} className="shrink-0" />
      <span>
        <b>Backend server is offline.</b> Open a terminal, go to the <code className="bg-red-700 px-1 rounded">server</code> folder and run <code className="bg-red-700 px-1 rounded">node index.js</code> — or double-click <b>start.bat</b> at the project root.
      </span>
    </div>
  );
}

function DashboardLayout({ loggedInUser, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(function() {
    function check() {
      fetch('https://hr-dashboard-backend-hw9y.onrender.com/api/health')
        .then(function(r) { setServerOnline(r.ok); })
        .catch(function() { setServerOnline(false); });
    }
    check();
    const interval = setInterval(check, 8000);
    return function() { clearInterval(interval); };
  }, []);

  function renderPage() {
    switch (activePage) {
      case "Dashboard":     return <DashboardHome />;
      case "Profile":       return <Profile loggedInUser={loggedInUser} onLogout={onLogout} />;
      case "Employees":     return <Employees />;
      case "Reports":       return <Reports />;
      case "Sync To DB":    return <SyncToDB />;
      case "HR Processing": return <HRProcessing />;
      default:              return <DashboardHome />;
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Top bar */}
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <p className="text-sm text-gray-500">
            Welcome: <span className="font-semibold text-gray-800">Royal Chain Limited</span>
          </p>
          <div className="flex items-center gap-3">
            <span className={"hidden items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full " +
              (serverOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
              <span className={"w-2 h-2 rounded-full " + (serverOnline ? "bg-green-500" : "bg-red-500")} />
              {serverOnline ? "Server Online" : "Server Offline"}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#1D3587] flex items-center justify-center text-white text-sm font-bold">
              {loggedInUser ? loggedInUser.email[0].toUpperCase() : "R"}
            </div>
          </div>
        </div>

        {!serverOnline && <ServerOfflineBanner />}

        {renderPage()}
      </div>
    </div>
  );
}

export default DashboardLayout;
