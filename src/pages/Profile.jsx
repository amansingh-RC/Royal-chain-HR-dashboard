import React from "react";
import { User, Mail, Shield } from "lucide-react";

function Profile({ loggedInUser }) {
  const user = loggedInUser || { email: "hr.admin@royalchains.com", role: "HR Admin" };

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
      </div>
    </div>
  );
}

export default Profile;
