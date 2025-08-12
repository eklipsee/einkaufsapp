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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
              <LoginForm onLogin={() => setAuth(true)} />
              <div className="text-center mt-6 bg-white rounded-xl shadow-lg p-6">
                <p className="text-gray-600 mb-4">
                  Noch keinen Account?
                </p>
                <button 
                  onClick={() => setShowRegister(true)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  🎯 Jetzt registrieren
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <FinanceStatus onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;