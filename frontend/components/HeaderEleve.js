import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/HeaderEleve.module.css';

function HeaderEleve() {
  return (
    <div className={styles.container}>
        <div>
            <Image className={styles.logo} src="/LogoMT.ico" alt="Logo" width={65} height={50}/>
        </div>
        <div className={styles.right_side}>
            <a className={styles.link} href="">Dashboard</a>
            <a className={styles.link} href="">Mes ressources</a>
            <a className={styles.link} href="">Paiement</a>
            <a className={styles.link} href="">Planning</a>
            <a className={styles.mlink} href="">Messagerie</a>
            <a className={styles.profil} href="">Julien</a>
            <FontAwesomeIcon className={styles.exit} icon={faArrowRightFromBracket} />
        </div>
    </div>
  );
}

export default HeaderEleve;
