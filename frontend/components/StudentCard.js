import styles from "../styles/StudentCard.module.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateStudentStatus } from "../reducers/students";
import Link from "next/link";
import { useRouter } from "next/router";

function StudentCard(props) {
  const router = useRouter();
  const [status, setStatus] = useState(props.status || "");
  useEffect(() => {
    setStatus(props.status || "");
  }, [props.status]);

  const dispatch = useDispatch();

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    // Fetch pour mettre à jour le statut de l'étudiant dans la base de données à ajouter
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/students/changeStatus`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: props.id,
            status: newStatus,
          }),
        },
      );

      const data = await response.json();
      console.log("Status student updated:", data);
      // Version dès que backend ok
      data.result
        ? dispatch(updateStudentStatus({ id: props.id, status: newStatus }))
        : console.log(data.error);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className={styles.content}>
      <button className={styles.studentLink}>
        <span
          className={styles.name}
          onClick={() => router.push(`/fiche_student_teacher?id=${props.id}`)}
        >
          {props.firstname} {props.lastname}
        </span>
      </button>
      <p className={styles.discipline}>{props.discipline}</p>
      {/*{!props.invite && (
        <button className={styles.inviteBtn}>
          <span className={styles.inviteText}>Inviter</span>
        </button>
      )} 
       changement du bloc invite pour faire fonctionner l'envoi de mail */}
      {status === "Prospect" && (
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
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
      >
        <option value="" disabled hidden>
          Choisir une option
        </option>
        <option value="Actif">Actif</option>
        <option value="Inactif">Inactif</option>
        <option value="Prospect">Prospect</option>
      </select>
      <p className={styles.subscription}>{props.subscription || "A définir"}</p>
    </div>
  );
}

export default StudentCard;
