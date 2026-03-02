import Head from "next/head";
import HeaderProf from "./HeaderProf";
import FooterProf from "./FooterProf";
import StudentCard from "./StudentCard";
import styles from "../styles/HomeProf.module.css";

function HomeProf() {
  return (
    <div className={styles.content}>
      <Head>
        <title>MyTeacher - Dashboard </title>
      </Head>
      <HeaderProf />
      <main className={styles.main}>
        <div className={styles.titlePage}>
          <p className={styles.title}>MON DASHBOARD</p>
        </div>
        <div className={styles.section}>
          <div className={styles.leftSection}>
            <div className={styles.studentSection}>
              <div className={styles.studentList}>
                <p className={styles.subtitle}>Mes élèves</p>
                <StudentCard
                  name={"Bob"}
                  discipline={"Guitare"}
                  status={"Actif"}
                  abonnement={"Annuel"}
                />
                <StudentCard
                  name={"Bob"}
                  discipline={"Guitare"}
                  status={"Actif"}
                  abonnement={"Annuel"}
                />
              </div>
            </div>
            <div className={styles.paymentSection}>
              <div className={styles.paymentList}>
                <p className={styles.subtitle}>Suivi paiements</p>
                list
              </div>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.planningDetails}>
              <p className={styles.subtitle}>Planning</p>
              list
            </div>
          </div>
        </div>
      </main>
      <FooterProf />
    </div>
  );
}

export default HomeProf;
