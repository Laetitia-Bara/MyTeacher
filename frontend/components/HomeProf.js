import Head from "next/head";
import HeaderProf from "./HeaderProf";
import FooterProf from "./FooterProf";
import StudentCard from "./StudentCard";
import PaymentCard from "./PaymentCard";
import CalendarProf from "./CalendarProf";

import styles from "../styles/HomeProf.module.css";

const dataStudent = [
  {
    name: "Bob",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    abonnement: "Trimestre",
  },
  {
    name: "Jo",
    discipline: "Trompette",
    invite: true,
    status: "Actif",
    abonnement: "Annuel",
  },
  {
    name: "Stephanie",
    discipline: "Guitare",
    invite: false,
    status: "Prospect",
    abonnement: "Annuel",
  },
  {
    name: "Lily",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    abonnement: "A l'unité",
  },
  {
    name: "Lulu",
    discipline: "Trompette",
    invite: true,
    status: "Inactif",
    abonnement: "Trimestre",
  },
];

const dataPayment = [
  {
    name: "Bob",
    paymentTerm: "Paiement 3x",
    status: "A suivre",
  },
  {
    name: "Lily",
    paymentTerm: "Paiement 1x",
    status: "Retard",
  },
];

function HomeProf() {
  const students = dataStudent.map((data, i) => (
    <StudentCard
      key={i}
      name={data.name}
      discipline={data.discipline}
      invite={data.invite}
      status={data.status}
      abonnement={data.abonnement}
    />
  ));

  const payments = dataPayment.map((data, i) => (
    <PaymentCard
      key={i}
      name={data.name}
      paymentTerm={data.paymentTerm}
      status={data.status}
    />
  ));

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
                <button className={styles.addStudentBtn}>
                  <span className={styles.addText}>+ Ajouter un élève</span>
                </button>
                {students}
              </div>
            </div>
            <div className={styles.paymentSection}>
              <div className={styles.paymentList}>
                <p className={styles.subtitle}>Suivi paiements</p>
                {payments}
              </div>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.planningSection}>
              <div className={styles.planningDetails}>
                <p className={styles.subtitle}>Planning</p>
                <button className={styles.addEventBtn}>
                  <span className={styles.addText}>+ Ajouter un évènement</span>
                </button>
                <CalendarProf />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterProf />
    </div>
  );
}

export default HomeProf;
