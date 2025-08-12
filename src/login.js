import React, { useState } from "react";
import "./login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        setErro("Usuário ou senha inválidos.");
        return;
      }

      const data = await response.json();
      alert("Login realizado com sucesso!");
    } catch (err) {
      setErro("Erro ao conectar com o servidor.");
      console.error(err);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Login</h2>

        <label className="label">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Digite seu email"
        />

        <label className="label">Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="input"
          placeholder="Digite sua senha"
        />

        {erro && <div className="error">{erro}</div>}

        <button type="submit" className="button">
          Entrar
        </button>
      </form>
    </div>
  );
}