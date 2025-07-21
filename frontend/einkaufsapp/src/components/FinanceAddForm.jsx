import React, { useState } from "react";

function FinanceAddForm({ onNewInstance }) {
  const [partner, setPartner] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/api/finance/link", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ partner }),
    })
      .then((res) => res.text().then((text) => ({ ok: res.ok, text })))
      .then(({ ok, text }) => {
        setMessage(text);
        if (ok && onNewInstance) {
          onNewInstance(); // Trigger z. B. zum Neuladen der Liste
        }
      })
      .catch(() => setMessage("Verbindungsfehler"));
  };

  return (
    <div>
      <h3>Neue Finanzverbindung erstellen</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={partner}
          onChange={(e) => setPartner(e.target.value)}
          placeholder="Partner-Username"
        />
        <button type="submit">Verknüpfen</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FinanceAddForm;