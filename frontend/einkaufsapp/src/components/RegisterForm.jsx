import { useState } from "react";
import axios from "axios";

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      // WICHTIG: Relative URL verwenden, damit der Proxy greift
      const response = await axios.post("/api/users/register", {
        username,
        password,
      });
      
      setSuccess(true);
      setMessage("✅ Erfolgreich registriert! Du kannst dich jetzt einloggen.");
      
      // Nach 2 Sekunden zurück zum Login
      setTimeout(() => {
        if (onRegister) onRegister();
      }, 2000);
    } catch (error) {
      console.error("Registrierung Fehler:", error);
      setMessage("❌ Fehler bei der Registrierung. Benutzername evtl. schon vergeben.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Konto erstellen</h2>
          <p className="text-gray-600">Erstelle dein neues Benutzerkonto</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Benutzername
            </label>
            <input
              type="text"
              placeholder="Wähle einen Benutzernamen..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passwort
            </label>
            <input
              type="password"
              placeholder="Erstelle ein sicheres Passwort..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Wird erstellt...</span>
              </div>
            ) : (
              <>✨ Registrieren</>
            )}
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
            success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Zurück Button */}
        <div className="mt-6 text-center">
          <button 
            onClick={onRegister}
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            ← Zurück zum Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;