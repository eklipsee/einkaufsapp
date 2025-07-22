import { useState } from "react";
import axios from "axios";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // WICHTIG: Relative URL verwenden, damit der Proxy greift
      const response = await axios.post("/api/users/register", {
        username,
        password,
      });
      setMessage("Erfolgreich registriert. Du kannst dich jetzt einloggen.");
      // Nach 2 Sekunden zurück zum Login
      setTimeout(() => {
        if (onRegister) onRegister();
      }, 2000);
    } catch (error) {
      console.error("Registrierung Fehler:", error);
      setMessage("Fehler bei der Registrierung. Benutzername evtl. vergeben.");
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Benutzername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrieren</button>
      </form>
      <button onClick={onRegister}>Zurück</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterForm;