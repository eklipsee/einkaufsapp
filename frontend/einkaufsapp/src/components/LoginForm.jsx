import { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // FormData für Form-Login verwenden
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const loginResponse = await axios.post("/api/users/login", formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true
      });

      // Nach erfolgreichem Login User-Daten abrufen
      const userResponse = await axios.get("/api/users/me", {
        withCredentials: true
      });

      onLogin(userResponse.data);
    } catch (err) {
      console.error("Login Fehler:", err);
      alert("Login fehlgeschlagen");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        value={username} 
        onChange={e => setUsername(e.target.value)} 
        placeholder="Username" 
        required
      />
      <input 
        type="password" 
        value={password} 
        onChange={e => setPassword(e.target.value)} 
        placeholder="Passwort" 
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;