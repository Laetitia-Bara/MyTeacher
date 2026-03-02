import HeaderEleve from './HeaderEleve';
import FooterEleve from './FooterEleve';

import styles from '../styles/DashboardEleve.module.css';

function DashboardEleve() {
  return (
    <div className={styles.body}>
        <HeaderEleve />
        
        <FooterEleve />
    </div>
  );
}

export default DashboardEleve;
