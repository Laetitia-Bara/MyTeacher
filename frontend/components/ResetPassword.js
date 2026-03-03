import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../lib/api";

function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const onReset = async () => {
    setMsg("");
    if (!token) return setMsg("Token manquant");

    const { ok, data } = await api(`/users/reset-password/${token}`, {
      method: "POST",
      body: { password },
    });

    if (!ok) return setMsg(data?.error || "Reset failed");

    setMsg("Mot de passe modifié ✅");
    router.push("/signup_prof"); // retour login
  };

  return (
    <main style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Réinitialiser le mot de passe</h1>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onReset} disabled={!token}>
        Reset
      </button>
      {msg && <p>{msg}</p>}
    </main>
  );
}

export default ResetPassword;
