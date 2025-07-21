import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FinanceStatus from "./components/FinanceStatus";

function App() {
  const [auth, setAuth] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    fetch("/logout", { method: "POST", credentials: "include" }).then(() =>
      setAuth(false)
    );
  };

  return (
    <div>
      {!auth ? (
        showRegister ? (
          <RegisterForm onRegister={() => setShowRegister(false)} />
        ) : (
          <>
            <LoginForm onLogin={() => setAuth(true)} />
            <p>
              Noch keinen Account?{" "}
              <button onClick={() => setShowRegister(true)}>Registrieren</button>
            </p>
          </>
        )
      ) : (
        <FinanceStatus onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;