import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [revealed, setRevealed] = useState({}); // id -> parola în clar

  const API_BASE = "http://localhost:8080/api";

  const loadPasswords = async () => {
    try {
      const res = await fetch(`${API_BASE}/passwords`);
      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      console.error(err);
      setMessage("Eroare la încărcarea parolelor.");
    }
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  const handleSave = async () => {
    if (!label || !password) {
      setMessage("Te rog completează label + parolă.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/passwords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ label, password }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      await res.json();
      setMessage("Parola a fost criptată și salvată!");
      setLabel("");
      setPassword("");
      setRevealed({});
      loadPasswords();
    } catch (err) {
      console.error(err);
      setMessage("Eroare la comunicarea cu serverul.");
    }
  };

  const handleReveal = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/passwords/${id}/reveal`);
      const text = await res.text();
      setRevealed((prev) => ({ ...prev, [id]: text }));
    } catch (err) {
      console.error(err);
      setMessage("Eroare la comunicarea cu serverul.");
    }
  };

  return (
    <div className="App">
      <h1>Mini Password Manager</h1>

      <div className="card">
        <h2>Adaugă parolă</h2>
        <label>
          Label (ex: Instagram, Gmail):
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Numele parolei..."
          />
        </label>

        <label>
          Parolă:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parola ta..."
          />
        </label>

        <button onClick={handleSave}>Criptează și salvează</button>

        {message && <p className="info">{message}</p>}
      </div>

      <div className="card list-card">
        <h2>Parole salvate</h2>
        {passwords.length === 0 && <p>Nu ai nicio parolă salvată încă.</p>}

        <ul className="password-list">
          {passwords.map((p) => (
            <li key={p.id} className="password-item">
              <div className="password-main">
                <span className="password-label">{p.label}</span>
                <button onClick={() => handleReveal(p.id)}>
                  Vezi parola
                </button>
              </div>
              {revealed[p.id] && (
                <div className="password-revealed">
                  Parola: <strong>{revealed[p.id]}</strong>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
