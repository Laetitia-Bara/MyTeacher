import Head from "next/head";
import HeaderProf from "./HeaderProf";
import FooterProf from "./FooterProf";
import StudentCard from "./StudentCard";
import PaymentCard from "./PaymentCard";
import BigCalendar from "./BigCalendar";
import ModalPlanning from "./ModalAddEvent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEventToStore } from "../reducers/planning";

import styles from "../styles/HomeProf.module.css";

const dataStudent = [
  {
    name: "Bob",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "Trimestre",
  },
  {
    name: "Jo",
    discipline: "Trompette",
    invite: true,
    status: "Actif",
    subscription: "Annuel",
  },
  {
    name: "Stephanie",
    discipline: "Guitare",
    invite: false,
    status: "Prospect",
    subscription: "Annuel",
  },
  {
    name: "Lily",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "A l'unité",
  },
  {
    name: "Lulu",
    discipline: "Trompette",
    invite: true,
    status: "Inactif",
    subscription: "Trimestre",
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

const events = [
  {
    id: 1,
    title: "SUPERTEST",
    start: new Date("Wed Mar 04 2026 00:00:00 GMT+0100"),
    end: new Date("Wed Mar 04 2026 02:00:00 GMT+0100"),
  },

  {
    id: 2,
    title: "TEST ENCORE",
    start: new Date("Wed Mar 04 2026 12:00:00 GMT+0100"),
    end: new Date("Wed Mar 04 2026 14:00:00 GMT+0100"),
  },

  {
    id: 3,
    title: "TEST OUI",
    allDay: true,
    start: new Date("Wed Mar 06 2026 00:00:00 GMT+0100"),
    end: new Date("Wed Mar 06 2026 00:00:00 GMT+0100"),
  },
  {
    id: 4,
    title: "ET OUI",
    start: new Date("Wed Mar 05 2026 10:00:00 GMT+0100"),
    end: new Date("Wed Mar 05 2026 12:00:00 GMT+0100"),
    desc: "Cours Lily",
  },
];

function HomeProf() {
  // const [modal, setModal] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    for (const event of events) {
      dispatch(addEventToStore(event));
    }
  }, []);

  const students = dataStudent.map((data, i) => (
    <StudentCard
      key={i}
      name={data.name}
      discipline={data.discipline}
      invite={data.invite}
      status={data.status}
      subscription={data.subscription}
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
                <BigCalendar />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterProf />
      {/* {modal && <ModalPlanning onClose={() => setModal(false)} />} */}
    </div>
  );
}

export default HomeProf;
