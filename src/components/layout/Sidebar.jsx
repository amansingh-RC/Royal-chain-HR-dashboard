import React from "react";

function Sidebar({ activePage, setActivePage }) {
  const menus = [
    "Dashboard",
    "Profile",
    "Employees",
    "Reports",
    "Sync To DB",
    "HR Processing"
  ];

  return (
    <div className="w-64 min-h-screen bg-white shadow-lg p-5">
      <img
        src="https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_2048/https://royalchaingroup.com/wp-content/uploads/2026/02/Royal-Chain-Limited-3-2048x1413.webp"
        alt="logo"
        className="h-12 mb-10 mx-auto"
      />

      {menus.map(function(menu, index) {
        return (
          <div
            key={index}
            onClick={function() { setActivePage(menu); }}
            className={`p-3 mb-3 rounded-xl cursor-pointer font-medium ${
              activePage === menu
                ? "bg-[#1D3587] text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {menu}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;