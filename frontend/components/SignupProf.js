import Image from 'next/image';

import FooterProf from './FooterProf';
import styles from '../styles/SignupProf.module.css';

function SignupProf() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <Image className={styles.logo} src="/LogoMT.ico" alt="Logo" width={65} height={50}/>
            </div>

            <h1>Bienvenue sur MyTeacher</h1>

            <FooterProf />
        </div>
    );
}

export default SignupProf;
