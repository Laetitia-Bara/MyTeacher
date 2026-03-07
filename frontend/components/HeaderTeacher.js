import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/HeaderTeacher.module.css";
import { logout } from "../lib/api";

function HeaderTeacher() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      localStorage.removeItem("user");
      router.push("/signin");
    }
  };

  return (
    <header className={styles.content}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/LogoMT.ico" alt="Logo" width={65} height={50} />
        </Link>
      </div>
      <div className={styles.menu}>
        <button className={styles.btnNavigation}>
          <Link href="/">
            <span className={styles.menuText}>Mes structures</span>
          </Link>
        </button>
        <button className={styles.btnNavigation}>
          <Link href="/">
            <span className={styles.menuText}>Ressources</span>
          </Link>
        </button>
        <button className={styles.btnNavigation}>
          <Link href="/">
            <span className={styles.menuText}>Suivi paiements</span>
          </Link>
        </button>
        <button className={styles.btnNavigation}>
          <Link href="/">
            <span className={styles.menuText}>Planning</span>
          </Link>
        </button>
        <button className={styles.btnNavigation}>
          <Link href="/">
            <span className={styles.menuText}>Messagerie</span>
          </Link>
        </button>
        <div className={styles.btnParameters}>
          <p>{user?.firstName || "Profil"}</p>
        </div>
        <button
          type="button"
          className={styles.btnLogout}
          onClick={handleLogout}
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </header>
  );
}

export default HeaderTeacher;
