import { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8080/api/users/me", {
        auth: {
          username,
          password,
        },
      });
      onLogin(res.data, { username, password }); // speichert Auth-Daten im State
    } catch (err) {
      alert("Login fehlgeschlagen");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;