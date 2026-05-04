import React, { useState } from "react";
import RCLoginPage from "./components/login/RCLoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div>
      {!isLoggedIn ? (
        <RCLoginPage
          setIsLoggedIn={setIsLoggedIn}
          setLoggedInUser={setLoggedInUser}
        />
      ) : (
        <DashboardLayout loggedInUser={loggedInUser} />
      )}
    </div>
  );
}

export default App;