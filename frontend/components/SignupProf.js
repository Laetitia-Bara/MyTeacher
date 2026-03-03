import Image from 'next/image';
import FooterProf from './FooterProf';
import styles from '../styles/SigninProf.module.css';

function SigninProf() {
    return(
        <div className={styles.body}>
            <div className={styles.header}>
                <Image className={styles.logo} src="/LogoMT.ico" alt="Logo" width={65} height={50}/>
            </div>

            <h1 className={styles.titre}>Bienvenue sur MyTeacher</h1>

            <div className={styles.container}>
                <input className={styles.input} type="text" placeholder='Email'/>
                <input className={styles.input} type="password" placeholder='Mot de passe'/>
                <input className={styles.input} type="password" placeholder='Confirmation de mot de passe'/>
                <button className={styles.boutonBleu}>S'inscrire</button>
            </div>

            <button className={styles.boutonVert}>Déjà un compte ? Se connecter !</button>

            <FooterProf />
        </div>
    );
}

export default SigninProf;
