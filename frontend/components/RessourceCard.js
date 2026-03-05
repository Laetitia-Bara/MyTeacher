import styles from "../styles/RessourceCard.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faDownload,
  faPlus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

function RessourceCard(props) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>{props.title}</div>
      <div className={styles.type}>{props.type}</div>
      {!props.share && (
        <>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faPlus}
            onClick={() => props.addToSharingFct(props)}
          />
          <FontAwesomeIcon
            className={styles.icon}
            icon={faDownload}
            onClick={() => props.downloadFct(props)}
          />
          <FontAwesomeIcon
            className={styles.icon}
            icon={faTrash}
            onClick={() => props.deleteFct(props)}
          />
        </>
      )}
      {props.share && (
        <>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faCircleXmark}
            onClick={() => props.removeFct(props)}
          />
        </>
      )}
    </div>
  );
}

export default RessourceCard;
