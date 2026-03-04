import Image from "next/image";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/AuthForm.module.css";
import { useMemo, useState } from "react";
import { api } from "../lib/api";

export default function InviteStudent() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 0, [email]);

  const onInvite = async () => {
    setError("");
    setInviteLink("");
    if (loading) return;

    setLoading(true);
    const { ok, data } = await api("/invitations", {
      method: "POST",
      body: { email },
    });
    setLoading(false);

    if (!ok) return setError(data?.error || "Invite failed");

    setInviteLink(data.inviteLink);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {}
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Image
          className={styles.logo}
          src="/LogoMT.ico"
          alt="Logo"
          width={65}
          height={50}
        />
      </div>

      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>Inviter un élève</h1>

          <div className={styles.form}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email de l'élève"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className={styles.primaryBtn}
              onClick={onInvite}
              disabled={!canSubmit || loading}
            >
              {loading ? "Création..." : "Créer le lien"}
            </button>

            {error && <div className={styles.errorBox}>{error}</div>}

            {inviteLink && (
              <>
                <code className={styles.codeBox}>{inviteLink}</code>

                <button
                  className={styles.secondaryBtn}
                  onClick={copyToClipboard}
                  type="button"
                >
                  Copier le lien
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <FooterTeacher />
    </div>
  );
}
