import styles from "../styles/StudentCard.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateStudentStatus } from "../reducers/students";
import Link from "next/link";

function StudentCard(props) {
  const [status, setStatus] = useState(props.status);
  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    // Fetch pour mettre à jour le statut de l'étudiant dans la base de données à ajouter
    // Puid dispatch pour mettre à jour le statut de l'étudiant dans le store si retour BDD OK
    dispatch(updateStudentStatus({ id: props.id, status: newStatus }));
  };

  return (
    <div className={styles.content}>
      <button className={styles.studentLink}>
        <Link href="/">
          <span className={styles.name}>
            {props.firstname} {props.lastname}
          </span>
        </Link>
      </button>
      <p className={styles.discipline}>{props.discipline}</p>
      {/*{!props.invite && (
        <button className={styles.inviteBtn}>
          <span className={styles.inviteText}>Inviter</span>
        </button>
      )} 
       changement du bloc invite pour faire fonctionner l'envoi de mail */}
      {props.invite && (
        <button
          className={styles.inviteBtn}
          type="button"
          onClick={() => props.onInviteClick?.(props.email)}
          disabled={!props.email}
          title={!props.email ? "Email manquant" : "Inviter cet élève"}
        >
          <span className={styles.inviteText}>
            {props.email ? "Inviter" : "Email manquant"}
          </span>
        </button>
      )}
      <select
        className={styles.selectList}
        type="text"
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="">Choisir une option</option>
        <option value="Actif">Actif</option>
        <option value="Inactif">Inactif</option>
        <option value="Prospect">Prospect</option>
      </select>
      <p className={styles.subscription}>{props.subscription}</p>
    </div>
  );
}

export default StudentCard;
