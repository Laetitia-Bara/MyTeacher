import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/HeaderStudent.module.css";
import { logout } from "../lib/api";

function HeaderStudent() {
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
    <div className={styles.container}>
      <div>
        <Image
          className={styles.logo}
          src="/LogoMT.ico"
          alt="Logo"
          width={65}
          height={50}
        />
      </div>
      <div className={styles.right_side}>
        <Link href="">
          <span className={styles.link}>Dashboard</span>
        </Link>
        <Link href="">
          <span className={styles.link}>Mes ressources</span>
        </Link>
        <Link href="">
          <span className={styles.link}>Paiement</span>
        </Link>
        <Link href="">
          <span className={styles.link}>Planning</span>
        </Link>
        <Link href="">
          <span className={styles.mlink}>Messagerie</span>
        </Link>
        <Link href="">
          <span className={styles.profil}>Julien</span>
        </Link>
        <button
          type="button"
          className={styles.exit}
          onClick={handleLogout}
          aria-label="Déconnexion"
          title="Déconnexion"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
        </button>
      </div>
    </div>
  );
}

export default HeaderStudent;
