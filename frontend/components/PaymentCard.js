import styles from "../styles/PaymentCard.module.css";

function PaymentCard(props) {
  const formattedDate = props.date
    ? new Date(props.date).toLocaleDateString("fr-FR")
    : "-";

  const statusLabel =
    props.status === "paid"
      ? "Payé"
      : props.status === "late"
        ? "En retard"
        : props.status === "scheduled"
          ? "Programmé"
          : "En attente";

  const statusClass =
    props.status === "paid"
      ? styles.paid
      : props.status === "late"
        ? styles.late
        : props.status === "scheduled"
          ? styles.scheduled
          : styles.pending;

  return (
    <div className={styles.card}>
      <div className={styles.studentBlock}>
        <p className={styles.name}>
          {props.firstname} {props.lastname}
        </p>
        <p className={styles.discipline}>
          {props.discipline || "Discipline non renseignée"}
        </p>
      </div>

      <div className={styles.dateBlock}>
        <span className={styles.label}>Date</span>
        <p className={styles.value}>{formattedDate}</p>
      </div>

      <div className={styles.amountBlock}>
        <span className={styles.label}>Montant</span>
        <p className={styles.value}>{props.amount || 0} €</p>
      </div>

      <div className={styles.statusBlock}>
        <span className={`${styles.status} ${statusClass}`}>{statusLabel}</span>
      </div>
    </div>
  );
}

export default PaymentCard;
