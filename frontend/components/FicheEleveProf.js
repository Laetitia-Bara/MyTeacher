
import HeaderProf from "./HeaderProf"
import FooterProf from "./FooterProf"
import styles from '../styles/FicheEleveProf.module.css';

function FicheEleveProf () {
    return (
        <div className={styles.body}>
            <HeaderProf />
            <FooterProf />
        </div>
    );
}

export default FicheEleveProf;