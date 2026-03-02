import HeaderEleve from './HeaderEleve';
import FooterEleve from './FooterEleve';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

import styles from '../styles/DashboardEleve.module.css';

function DashboardEleve() {
  return (
    <div className={styles.body}>
        <HeaderEleve />
        <h1 className={styles.title}>Mon dashboard</h1>
        <div className={styles.content}>
          <fieldset className={styles.leftside}>
            <legend className={styles.titre}>Planning</legend>
            Contenu de la div
          </fieldset>
          <fieldset className={styles.rightside}>
            <legend className={styles.titre}>Alertes</legend>

            <div className={styles.contenue}>
              <p>
                <span style={{color:"#BF99A0"}}><FontAwesomeIcon icon={faEuroSign} /></span> Status paiement :
              </p>
              <p className={styles.status}>
                En retard
              </p>
            </div>

            <div className={styles.contenue}>
              <p>
                <span style={{color:"#84DCCF"}}><FontAwesomeIcon icon={faEnvelope} /></span> Messages non lus :
              </p>
              <p className={styles.nb}>
                5
              </p>
            </div>

            <div className={styles.contenuebot}>
              <p>
                <span style={{color:"#bccbe0"}}><FontAwesomeIcon icon={faInbox} /></span> Document mis à disposition :
              </p>
              <p className={styles.doc}>
                5
              </p>
            </div>
          </fieldset>
        </div>
        <FooterEleve />
    </div>
  );
}

export default DashboardEleve;
