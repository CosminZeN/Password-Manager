import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "https://password-manager-production-f01e.up.railway.app/api";
const AUTH_BASE = "https://password-manager-production-f01e.up.railway.app/auth";


function App() {
  const [view, setView] = useState("login"); // "login" | "register" | "app"

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [loggedUsername, setLoggedUsername] = useState("");

  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [revealed, setRevealed] = useState({}); // id -> parola în clar

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      setView("app");
      fetchPasswords();
      fetchUsernameFromToken(); // optional sau păstrăm din login
    }
  }, []); // rulează o singură dată

  const fetchPasswords = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/passwords`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const data = await res.json();
      setPasswords(data);
    } catch (err) {
      console.error(err);
      setMessage("Eroare la încărcarea parolelor.");
    }
  };

  const fetchUsernameFromToken = () => {
    // avem username-ul în AuthResponse la login, deci îl setăm acolo
    // sau putem ignora funcția asta pentru moment
  };

  const handleRegister = async () => {
    setAuthMessage("");
    try {
      const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password: authPassword }),
      });

      const text = await res.text();
      if (!res.ok) {
        setAuthMessage("Eroare la înregistrare: " + text);
      } else {
        setAuthMessage("Înregistrare reușită! Te poți loga acum.");
        setView("login");
      }
    } catch (err) {
      console.error(err);
      setAuthMessage("Eroare la comunicarea cu serverul.");
    }
  };

  const handleLogin = async () => {
    setAuthMessage("");
    try {
      const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: authPassword }),
      });

      if (!res.ok) {
        const text = await res.text();
        setAuthMessage("Login eșuat: " + text);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setLoggedUsername(data.username);
      setView("app");
      setAuthPassword("");
      fetchPasswords();
    } catch (err) {
      console.error(err);
      setAuthMessage("Eroare la comunicarea cu serverul.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setView("login");
    setLoggedUsername("");
    setPasswords([]);
    setRevealed({});
  };

  const handleSavePassword = async () => {
    if (!label || !password) {
      setMessage("Te rog completează label + parolă.");
      return;
    }
    if (!token) {
      setMessage("Trebuie să fii logat.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/passwords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ label, password }),
      });

      const text = await res.text();
      if (!res.ok) {
        setMessage("Eroare: " + text);
      } else {
        setMessage("Parola a fost criptată și salvată!");
        setLabel("");
        setPassword("");
        setRevealed({});
        fetchPasswords();
      }
    } catch (err) {
      console.error(err);
      setMessage("Eroare la comunicarea cu serverul.");
    }
  };

  const handleReveal = async (id) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/passwords/${id}/reveal`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const text = await res.text();
      setRevealed((prev) => ({ ...prev, [id]: text }));
    } catch (err) {
      console.error(err);
      setMessage("Eroare la comunicarea cu serverul.");
    }
  };

  // UI pentru login/register/app:

  if (view === "login") {
    return (
      <div className="App">
        <h1>Login - Password Manager</h1>
        <div className="card">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email..."
            />
          </label>
          <label>
            Parolă:
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="parola..."
            />
          </label>
          <button onClick={handleLogin}>Login</button>
          {authMessage && <p className="info">{authMessage}</p>}
          <p style={{ marginTop: "1rem" }}>
            Nu ai cont?{" "}
            <button onClick={() => setView("register")}>Înregistrează-te</button>
          </p>
        </div>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="App">
        <h1>Register - Password Manager</h1>
        <div className="card">
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email..."
            />
          </label>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username..."
            />
          </label>
          <label>
            Parolă:
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="parola..."
            />
          </label>
          <button onClick={handleRegister}>Înregistrare</button>
          {authMessage && <p className="info">{authMessage}</p>}
          <p style={{ marginTop: "1rem" }}>
            Ai deja cont?{" "}
            <button onClick={() => setView("login")}>Mergi la login</button>
          </p>
        </div>
      </div>
    );
  }

  // view === "app"
  return (
    <div className="App">
      <h1>Mini Password Manager</h1>
      <p>Bun venit, {loggedUsername || "user"}!</p>
      <button onClick={handleLogout}>Logout</button>

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

        <button onClick={handleSavePassword}>Criptează și salvează</button>

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
                <button onClick={() => handleReveal(p.id)}>Vezi parola</button>
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
