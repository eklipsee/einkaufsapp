import { useState } from "react";
import axios from "axios";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/users/register", {
        username,
        password,
      });
      alert("Registrierung erfolgreich");
    } catch (err) {
      alert("Fehler bei Registrierung");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" />
      <button type="submit">Registrieren</button>
    </form>
  );
}

export default RegisterForm;