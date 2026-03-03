import styles from "../styles/ModalPlanning.module.css";

export default function ModalPlanning({ title, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        <img className={styles.logo} src="/images/bird.svg" alt="logo" />

        <h2 className={styles.title}>{title}</h2>
      </div>
    </div>
  );
}
