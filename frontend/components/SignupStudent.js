import Image from "next/image";
import FooterEleve from "./FooterEleve";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../lib/api";

function SignupStudent() {
  const router = useRouter();
  const { token } = router.query;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSignup = async () => {
    setError("");
    setSuccess("");

    if (!token) return setError("Lien invalide : token manquant.");
    if (password !== password2)
      return setError("Les mots de passe ne correspondent pas");

    const { ok, data } = await api("/users/signup/student", {
      method: "POST",
      body: { token, firstName, lastName, password },
    });

    if (!ok) return setError(data?.error || "Signup failed");

    setSuccess("Compte élève créé ✅");
    // redirection vers dashboard élève
    router.push("/dashboard_eleve");
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Image src="/LogoMT.ico" alt="Logo" width={65} height={50} />
        <h1 style={{ margin: 0 }}>Inscription élève</h1>
      </div>

      {!token && (
        <p style={{ color: "crimson", marginTop: 16 }}>
          Token manquant dans l’URL. Utilise le lien d’invitation du professeur.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gap: 12,
          marginTop: 16,
          opacity: token ? 1 : 0.6,
        }}
      >
        <input
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button onClick={onSignup} disabled={!token}>
          Créer mon compte élève
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button
          onClick={() => router.push("/signup_prof")}
          style={{ background: "transparent", border: "1px solid #ccc" }}
        >
          Déjà un compte ? Se connecter
        </button>
      </div>

      {typeof FooterEleve !== "undefined" ? <FooterEleve /> : null}
    </div>
  );
}

export default SignupStudent;
