import styles from "../styles/ModalAddRessource.module.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function ModalAddRessource({ onClose, addRessourceFct }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [url, setUrl] = useState("");

  const handleAdd = () => {
    if (!title && !type && !url) {
      console.log("Data missing in form");
    } else {
      addRessourceFct({ title, type, url });
      onClose();
    }
  };

  const handleUploadRessource = () => {
    // Logique manquante pour uploader la ressource puis l'envoyer sur cloudinary via backend et récupérer url
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.top}>
          <h2 className={styles.title}>Ajouter une ressource</h2>
          <FontAwesomeIcon
            className={styles.close}
            icon={faXmark}
            onClick={onClose}
          />
        </div>
        <div className={styles.content}>
          <input
            className={styles.input}
            type="text"
            placeholder="Titre de la ressource"
            maxLength="35"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className={styles.input}
            type="text"
            placeholder="Type de la ressource"
            maxLength="20"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          <button
            className={styles.btnImport}
            onClick={() => handleUploadRessource()}
          >
            Importer une ressource
          </button>

          <button className={styles.btn} onClick={() => handleAdd()}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
