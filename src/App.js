import React, { useState } from "react";
import Login from "./login";
import "./App.css";
import Dashboard from "./pages/Dashboard";




function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  
  return (
    <div className="App">
      {isLoggedIn ? 
        <Dashboard onLogout={handleLogout} /> : 
        <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

export default App;