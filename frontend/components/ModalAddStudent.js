import styles from "../styles/ModalAddStudent.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addStudentToStore } from "../reducers/students";

import moment from "moment";

export default function ModalAddStudent({ onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [status, setStatus] = useState("");
  const [subscription, setSubscription] = useState("");
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      discipline !== "" &&
      status !== "" &&
      subscription !== ""
    ) {
      dispatch(
        addStudentToStore({
          id: Date.now(),
          name: firstName,
          lastName,
          email,
          discipline,
          status,
          subscription,
        }),
      );
    }
    onClose();
  };

  // Temporaire, logique d'inviation ici à déplacer ensuite
  const handleInvite = async () => {
    if (email !== "") {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invitations`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email.toLocaleLowerCase().trim(),
          }),
        },
      );

      const data = await response.json();
      console.log(data);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h2 className={styles.title}>Ajouter un élève</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        {/* Temporaire, logique d'inviation ici à déplacer ensuite */}
        <div className={styles.content}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email de l'élève"
            maxLength="25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className={styles.btnInvite} onClick={() => handleInvite()}>
            Inviter élève
          </button>
        </div>

        {/* Reactiver quand logique d'ajout claire */}
        {/* <div className={styles.content}>
          <input
            className={styles.input}
            type="text"
            placeholder="Prénom de l'élève"
            maxLength="15"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Nom de l'élève"
            maxLength="15"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Email de l'élève"
            maxLength="25"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Discipline"
            maxLength="15"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
          />
          <select
            className={styles.selectList}
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Choisir une option</option>
            <option value="Actif">Actif</option>
            <option value="Inactif">Inactif</option>
            <option value="Prospect">Prospect</option>
          </select>
          <select
            className={styles.selectList}
            type="text"
            value={subscription}
            onChange={(e) => setSubscription(e.target.value)}
          >
            <option value="">Choisir une option</option>
            <option value="Trimestre">Trimestre</option>
            <option value="Annuel">Annuel</option>
            <option value="A l'unité">A l'unité</option>
          </select>
          <button className={styles.btnAddEvent} onClick={() => handleAdd()}>
            Ajouter
          </button> */}
        {/* </div> */}
      </div>
    </div>
  );
}
