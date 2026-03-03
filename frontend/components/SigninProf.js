import Image from 'next/image';
import FooterProf from './FooterProf';
import styles from '../styles/SignupProf.module.css';

function SignupProf() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <Image className={styles.logo} src="/LogoMT.ico" alt="Logo" width={65} height={50}/>
            </div>

            <h1 className={styles.titre}>Bienvenue sur MyTeacher</h1>

            <div className={styles.container}>
                <input className={styles.input} type="text" placeholder='Email'/>
                <input className={styles.input} type="password" placeholder='Mot de passe'/>
                <button className={styles.boutonBleu}>Se connecter</button>
            </div>

            <button className={styles.boutonVert}>Pas encore de compte ? Par ici !</button>

            <FooterProf />
        </div>
    );
}

export default SignupProf;
