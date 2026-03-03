import styles from "../styles/ModalAddEvent.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addEventToStore } from "../reducers/planning";

import moment from "moment";

export default function ModalAddEvent({ onClose, start, end }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (title !== "") {
      dispatch(
        addEventToStore({
          id: Date.now(),
          title,
          desc,
          start,
          end,
        }),
      );
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h2 className={styles.title}>Ajouter un évènement</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.date}>
            Début : {moment(start).format("Do MMM YYYY")}
          </div>
          <div className={styles.date}>
            Fin : {moment(end).format("Do MMM YYYY")}
          </div>
          <input
            className={styles.input}
            type="text"
            placeholder="Titre de l'évènement"
            maxLength="25"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Description"
            maxLength="40"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className={styles.btnAddEvent} onClick={() => handleAdd()}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
