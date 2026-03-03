
import HeaderProf from "./HeaderProf"
import FooterProf from "./FooterProf"
import styles from '../styles/FicheEleveProf.module.css';

function FicheEleveProf () {
    return (
        <div className={styles.body}>
            <HeaderProf />

            <h1 className={styles.titre}>
                Patrick Richard
            </h1>

            <div className={styles.container}>
                <div className={styles.left}>
                    <fieldset className={styles.content}>
                        <legend className={styles.title}>Identité</legend>
                        
                    </fieldset>

                    <fieldset className={styles.content}>
                        <legend className={styles.title}>Suivi des cours</legend>
                        Contenu de la div
                    </fieldset>
                </div>

                <fieldset className={styles.right}>
                    <legend className={styles.title}>Historique de paiement</legend>
                    Contenu de la div
                </fieldset>
            </div>

            <FooterProf />
        </div>
    );
}

export default FicheEleveProf;