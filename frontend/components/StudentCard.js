import styles from "../styles/StudentCard.module.css";
import Link from "next/link";

function StudentCard(props) {
  return (
    <div className={styles.content}>
      <button className={styles.studentLink}>
        <Link href="/">
          <span className={styles.name}>{props.name}</span>
        </Link>
      </button>
      <p className={styles.discipline}>{props.discipline}</p>
      <button className={styles.inviteBtn}>
        <span className={styles.inviteText}>Inviter</span>
      </button>
      <p className={styles.status}>{props.status}</p>
      <p className={styles.abonnement}>{props.abonnement}</p>
    </div>
  );
}

export default StudentCard;
