import React, { useState, useEffect } from "react";
import RCLoginPage from "./components/login/RCLoginPage";
import DashboardLayout from "./components/layout/DashboardLayout";

const STORAGE_KEY = "rc_logged_in_user";

function loadStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(loadStoredUser);
  const isLoggedIn = !!loggedInUser;

  // Persist whenever the user changes (login / logout)
  useEffect(function() {
    if (loggedInUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [loggedInUser]);

  function handleLogin(user) {
    setLoggedInUser(user);
  }

  function handleLogout() {
    setLoggedInUser(null);
  }

  return (
    <div>
      {!isLoggedIn ? (
        <RCLoginPage
          setIsLoggedIn={function() { /* no-op, kept for compat */ }}
          setLoggedInUser={handleLogin}
        />
      ) : (
        <DashboardLayout loggedInUser={loggedInUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
