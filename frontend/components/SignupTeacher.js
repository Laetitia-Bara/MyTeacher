import Image from "next/image";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/SignupTeacher.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../lib/api";

function SignupTeacher() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");

  const onSignup = async () => {
    setError("");

    if (password !== password2)
      return setError("Les mots de passe ne correspondent pas");

    const { ok, data } = await api("/users/signup/teacher", {
      method: "POST",
      body: { firstName, lastName, email, password },
    });

    if (!ok) return setError(data?.error || "Signup failed");

    router.push("/");
  };

  return (
    <div className={styles.body}>
      <div className={styles.header}>
        <Image
          className={styles.logo}
          src="/LogoMT.ico"
          alt="Logo"
          width={65}
          height={50}
        />
      </div>

      <h1 className={styles.titre}>Bienvenue sur MyTeacher</h1>

      <div className={styles.container}>
        <input
          className={styles.input}
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          className={styles.input}
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Confirmation de mot de passe"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />

        <button className={styles.boutonBleu} onClick={onSignup}>
          S&apos;inscrire
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>

      <button
        className={styles.boutonVert}
        onClick={() => router.push("/signin")}
      >
        Déjà un compte ? Se connecter !
      </button>

      <FooterTeacher />
    </div>
  );
}

export default SignupTeacher;
