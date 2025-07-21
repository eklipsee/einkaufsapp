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
          res.text().then(alert); // Zeigt Backend-Meldung
        }
      })
      .catch((err) => console.error("Fehler beim Erstellen:", err));
  };

  return (
    <div>
      <h2>Deine Finanzinstanzen</h2>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Partner-Benutzername"
          value={newPartner}
          onChange={(e) => setNewPartner(e.target.value)}
        />
        <button type="submit">Neue Instanz erstellen</button>
      </form>

      <ul>
        {statuses.map((status) => (
          <li key={status.id}>
            <strong>{status.partnerUsername}</strong>: {status.balance.toFixed(2)} €
            <button onClick={() => setSelectedId(status.id)}>Auswählen</button>
          </li>
        ))}
      </ul>

      {selectedId && (
        <form onSubmit={handleSubmit}>
          <h3>Betrag hinzufügen (Belegsumme)</h3>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="z. B. 23.50"
          />
          <button type="submit">Hinzufügen</button>
        </form>
      )}

      <button onClick={onLogout} style={{ marginTop: "20px" }}>
        Ausloggen
      </button>
    </div>
  );
}

export default FinanceStatus;