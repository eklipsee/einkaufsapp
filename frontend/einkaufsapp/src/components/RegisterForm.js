import { useState } from "react";
import axios from "axios";

function RegisterForm({ onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/register", {
        username,
        password,
      });
      setMessage("Erfolgreich registriert. Du kannst dich jetzt einloggen.");
    } catch (error) {
      setMessage("Fehler bei der Registrierung. Benutzername evtl. vergeben.");
    }
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <input
        placeholder="Benutzername"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrieren</button>
      <button onClick={onBack}>Zurück</button>
      <p>{message}</p>
    </div>
  );
}

export default RegisterForm;