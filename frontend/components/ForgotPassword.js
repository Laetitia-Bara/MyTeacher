import { useState } from "react";
import { api } from "../lib/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [resetLink, setResetLink] = useState("");

  const onSend = async () => {
    setMsg("");
    setResetLink("");

    const { ok, data } = await api("/users/forgot_password", {
      method: "POST",
      body: { email },
    });

    if (!ok) return setMsg(data?.error || "Error");

    setMsg("Si cet email existe, un lien de réinitialisation a été généré.");
    if (data.resetLink) setResetLink(data.resetLink);
  };

  return (
    <main style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Mot de passe oublié</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={onSend}>Générer un lien</button>

      {msg && <p>{msg}</p>}
      {resetLink && (
        <code style={{ display: "block", padding: 12, background: "#f3f3f3" }}>
          {resetLink}
        </code>
      )}
    </main>
  );
}

export default ForgotPassword;
