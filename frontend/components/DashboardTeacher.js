import Head from "next/head";
import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import StudentCard from "./StudentCard";
import PaymentCard from "./PaymentCard";
import BigCalendar from "./BigCalendar";
import ModalAddStudent from "./ModalAddStudent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, addEventToStore } from "../reducers/planning";
import { getStudents, addStudentToStore } from "../reducers/students";
import { getPayments } from "../reducers/payments";

import styles from "../styles/DashboardTeacher.module.css";

const dataStudent = [
  {
    id: 1,
    firstname: "Bob",
    lastname: "Smith",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "Trimestre",
  },
  {
    id: 2,
    firstname: "Jo",
    lastname: "Doe",
    discipline: "Trompette",
    invite: true,
    status: "Actif",
    subscription: "Annuel",
  },
  {
    id: 3,
    firstname: "Stephanie",
    lastname: "Johnson",
    discipline: "Guitare",
    invite: false,
    status: "Prospect",
    subscription: "Annuel",
  },
  {
    id: 4,
    firstname: "Lily",
    lastname: "Doe",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "A l'unité",
  },
  {
    id: 5,
    firstname: "Lulu",
    lastname: "Smith",
    discipline: "Trompette",
    invite: true,
    status: "Inactif",
    subscription: "Trimestre",
  },
];

const dataPayment = [
  {
    id: 1,
    firstname: "Bob",
    lastname: "Smith",
    paymentTerm: "Paiement 3x",
    status: "A suivre",
  },
  {
    id: 2,
    firstname: "Lily",
    lastname: "Doe",
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
    start: new Date("Wed Mar 06 2026 00:00:00 GMT+0100"),
    end: new Date("Thu Mar 06 2026 00:00:00 GMT+0100"),
  },
  {
    id: 4,
    title: "ET OUI",
    start: new Date("Wed Mar 05 2026 10:00:00 GMT+0100"),
    end: new Date("Wed Mar 05 2026 12:00:00 GMT+0100"),
    desc: "Cours Lily",
  },
];

function DashboardTeacher() {
  const [modalAddStudent, setModalAddStudent] = useState(false);
  const studentsData = useSelector((state) => state.students.value);
  const paymentsData = useSelector((state) => state.payments.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudents(dataStudent));
    dispatch(getPayments(dataPayment));
    dispatch(getEvents(events));
  }, []);

  const students = studentsData.map((data, i) => (
    <StudentCard
      key={i}
      id={data.id}
      firstname={data.firstname}
      lastname={data.lastname}
      discipline={data.discipline}
      invite={data.invite}
      status={data.status}
      subscription={data.subscription}
    />
  ));

  const payments = paymentsData.map((data, i) => (
    <PaymentCard
      key={i}
      id={data.id}
      firstname={data.firstname}
      lastname={data.lastname}
      paymentTerm={data.paymentTerm}
      status={data.status}
    />
  ));

  return (
    <div className={styles.content}>
      <Head>
        <title>MyTeacher - Dashboard </title>
      </Head>
      <HeaderTeacher />
      <main className={styles.main}>
        <div className={styles.titlePage}>
          <p className={styles.title}>MON DASHBOARD</p>
        </div>
        <div className={styles.section}>
          <div className={styles.leftSection}>
            <div className={styles.studentSection}>
              <div className={styles.studentList}>
                <p className={styles.subtitle}>Mes élèves</p>
                <button
                  className={styles.addStudentBtn}
                  onClick={() => setModalAddStudent(true)}
                >
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
      <FooterTeacher />
      {modalAddStudent && (
        <ModalAddStudent onClose={() => setModalAddStudent(false)} />
      )}
    </div>
  );
}

export default DashboardTeacher;
