import Image from "next/image";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/HeaderStudent.module.css";

function HeaderStudent() {
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
        <FontAwesomeIcon
          className={styles.exit}
          icon={faArrowRightFromBracket}
        />
      </div>
    </div>
  );
}

export default HeaderStudent;
