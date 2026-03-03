import Image from "next/image";
import FooterProf from "./FooterProf";
import styles from "../styles/SigninProf.module.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "../lib/api";

function SigninProf() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async () => {
    setError("");
    const { ok, data } = await api("/users/login", {
      method: "POST",
      body: { email, password },
    });

    if (!ok) return setError(data?.error || "Login failed");

    // redirection simple vers dashboard prof
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
        <button className={styles.boutonBleu} onClick={onLogin}>
          Se connecter
        </button>

        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </div>

      <button
        className={styles.boutonVert}
        onClick={() => router.push("/signin_prof")}
      >
        Pas encore de compte ? Par ici !
      </button>

      <button
        className={styles.boutonVert}
        onClick={() => router.push("/forgot_password")}
      >
        Mot de passe oublié ?
      </button>

      <FooterProf />
    </div>
  );
}

export default SigninProf;
