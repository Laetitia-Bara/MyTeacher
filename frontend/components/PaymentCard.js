import styles from "../styles/PaymentCard.module.css";
import Link from "next/link";

function PaymentCard(props) {
  return (
    <div className={styles.content}>
      <p className={styles.name}>
        {props.firstname} {props.lastname}
      </p>
      <p className={styles.term}>{props.paymentTerm}</p>

      <p className={styles.status}>{props.status}</p>
    </div>
  );
}

export default PaymentCard;
