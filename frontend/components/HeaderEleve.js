import Image from 'next/image';

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
            <a className={styles.link} href="">Messagerie</a>
            <a className={styles.profil} href="">Julien</a>
        </div>
    </div>
  );
}

export default HeaderEleve;
