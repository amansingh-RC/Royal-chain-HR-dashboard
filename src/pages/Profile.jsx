import React, { useState } from "react";
import { User, Mail, Shield, LogOut, AlertCircle } from "lucide-react";

function Profile({ loggedInUser, onLogout }) {
  const user = loggedInUser || { email: "hr.admin@royalchains.com", role: "HR Admin" };
  const [showConfirm, setShowConfirm] = useState(false);

  function confirmLogout() {
    setShowConfirm(false);
    if (typeof onLogout === "function") onLogout();
  }

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-1">Profile</h1>
      <p className="text-gray-500 text-sm mb-8">Your account details.</p>

      <div className="bg-white rounded-2xl shadow-md p-8 max-w-lg">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1D3587] flex items-center justify-center text-white text-2xl font-bold">
            {user.email ? user.email[0].toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{user.role || "HR Admin"}</p>
            <p className="text-gray-500 text-sm">Royal Chain Limited</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Mail className="text-[#1D3587] shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Shield className="text-[#1D3587] shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Role</p>
              <p className="text-gray-800 font-medium">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <User className="text-[#1D3587] shrink-0" size={20} />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Organization</p>
              <p className="text-gray-800 font-medium">Royal Chain Limited</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={function() { setShowConfirm(true); }}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-colors"
          >
            <LogOut size={18} />
            Logout
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
              <h3 className="text-lg font-bold text-gray-900">Logout?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              You will be signed out and returned to the login page. You can sign in again any time.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={function() { setShowConfirm(false); }}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
