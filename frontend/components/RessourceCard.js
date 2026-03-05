import styles from "../styles/RessourceCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload, faPlus } from "@fortawesome/free-solid-svg-icons";

function RessourceCard(props) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.type}>{props.type}</div>
      <FontAwesomeIcon
        className={styles.icon}
        icon={faPlus}
        onClick={() => props.onClick(props.id)}
      />
      <FontAwesomeIcon
        className={styles.icon}
        icon={faDownload}
        onClick={() => props.download(props.id)}
      />
      <FontAwesomeIcon
        className={styles.icon}
        icon={faTrash}
        onClick={() => props.delete(props.id)}
      />
    </div>
  );
}

export default RessourceCard;
