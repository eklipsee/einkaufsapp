import React, { useEffect, useState } from "react";

function FinanceStatus({ onLogout }) {
  const [statuses, setStatuses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [amount, setAmount] = useState("");
  const [newPartner, setNewPartner] = useState("");

  const loadData = () => {
    fetch("/api/finance", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setStatuses)
      .catch((err) => console.error("Fehler beim Laden der Instanzen:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedId || !amount) return;

    fetch(`/api/finance/${selectedId}/add?amount=${amount}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) loadData();
        else alert("Fehler beim Aktualisieren");
      })
      .catch((err) => console.error("Fehler:", err));

    setAmount("");
    setSelectedId(null);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newPartner) return;

    fetch(`/api/finance/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ partner: newPartner }),
    })
      .then((res) => {
        if (res.ok) {
          setNewPartner("");
          loadData();
        } else {
          res.text().then(alert);
        }
      })
      .catch((err) => console.error("Fehler beim Erstellen:", err));
  };

  const getBarColor = (creditorName, partnerName) => {
    if (creditorName === "Ausgeglichen") return "#4ade80"; // Grün
    return "#3b82f6"; // Blau
  };

  const getMaxAmount = () => {
    if (statuses.length === 0) return 100;
    return Math.max(...statuses.map(s => s.absoluteBalance), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            💰 Deine Finanzübersicht
          </h2>

          {/* Neue Instanz erstellen */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              ➕ Neue Finanzverbindung
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Partner-Benutzername eingeben..."
                value={newPartner}
                onChange={(e) => setNewPartner(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleCreate(e)}
              />
              <button 
                onClick={handleCreate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Verknüpfen
              </button>
            </div>
          </div>

          {/* Finanzinstanzen Liste */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              📊 Aktuelle Verbindungen
            </h3>
            
            {statuses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg">Noch keine Finanzverbindungen vorhanden</p>
                <p className="text-sm">Erstelle eine neue Verbindung oben!</p>
              </div>
            ) : (
              statuses.map((status) => (
                <div 
                  key={status.id} 
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {status.partnerUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {status.partnerUsername}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {status.creditorName === "Ausgeglichen" 
                            ? "🟢 Ausgeglichen" 
                            : `💸 ${status.creditorName} hat mehr bezahlt`
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-800">
                        {status.absoluteBalance.toFixed(2)} €
                      </div>
                      <button 
                        onClick={() => setSelectedId(selectedId === status.id ? null : status.id)}
                        className={`mt-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          selectedId === status.id 
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {selectedId === status.id ? 'Abbrechen' : 'Zahlung hinzufügen'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Fortschrittsbalken */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(status.absoluteBalance / getMaxAmount()) * 100}%`,
                        backgroundColor: getBarColor(status.creditorName, status.partnerUsername)
                      }}
                    />
                  </div>
                  
                  {/* Betrag hinzufügen Form */}
                  {selectedId === status.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-3">
                        <input
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Betrag eingeben (z.B. 23.50)"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                          required
                        />
                        <button 
                          onClick={handleSubmit}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          💰 Hinzufügen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Logout Button */}
          <div className="text-center pt-6 border-t border-gray-200">
            <button 
              onClick={onLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              🚪 Ausloggen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceStatus;