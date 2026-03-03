import { useState } from "react";
import { api } from "../lib/api";

function InviteStudent() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");

  const onInvite = async () => {
    setError("");
    setInviteLink("");

    const { ok, data } = await api("/invitations", {
      method: "POST",
      body: { email },
    });

    if (!ok) return setError(data?.error || "Invite failed");

    setInviteLink(data.inviteLink);
  };

  return (
    <main style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Inviter un élève</h1>
      <input
        placeholder="Email de l'élève"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={onInvite}>Créer le lien</button>

      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {inviteLink && (
        <code style={{ display: "block", padding: 12, background: "#f3f3f3" }}>
          {inviteLink}
        </code>
      )}
    </main>
  );
}

export default InviteStudent;
