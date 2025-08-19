import React from "react";
import Login from "./login";  // importa o componente Login
import "./App.css";           // mantém o estilo padrão se quiser
import Estados from './components/Estados';


function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;