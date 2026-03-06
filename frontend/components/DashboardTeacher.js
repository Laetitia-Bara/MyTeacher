import Head from "next/head";
import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import StudentCard from "./StudentCard";
import PaymentCard from "./PaymentCard";
import BigCalendar from "./BigCalendar";
import ModalAddStudent from "./ModalAddStudent";
import ModalCreateStudent from "./ModalCreateStudent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents, addEventToStore } from "../reducers/planning";
import { getStudents, addStudentToStore } from "../reducers/students";
import { getPayments } from "../reducers/payments";

import styles from "../styles/DashboardTeacher.module.css";

const dataStudent = [
  {
    _id: "67c9f1f1a2b3c4d4e6f7a8b9",
    firstName: "Bob",
    lastName: "Smith",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "Trimestre",
  },
  {
    _id: "67c9f2f1a2b3c4d4e6f7a8b9",
    firstName: "Jo",
    lastName: "Doe",
    email: "bob@example.com",
    discipline: "Trompette",
    invite: true,
    status: "Actif",
    subscription: "Annuel",
  },
  {
    _id: 3,
    firstName: "Stephanie",
    lastName: "Johnson",
    email: "bob@example.com",
    discipline: "Guitare",
    invite: false,
    status: "Prospect",
    subscription: "Annuel",
  },
  {
    _id: 4,
    firstName: "Lily",
    lastName: "Doe",
    email: "bob@example.com",
    discipline: "Guitare",
    invite: true,
    status: "Actif",
    subscription: "A l'unité",
  },
  {
    _id: 5,
    firstName: "Lulu",
    lastName: "Smith",
    email: "bob@example.com",
    discipline: "Trompette",
    invite: true,
    status: "Inactif",
    subscription: "Trimestre",
  },
];

const dataPayment = [
  {
    id: 1,
    firstName: "Bob",
    lastName: "Smith",
    paymentTerm: "Paiement 3x",
    status: "A suivre",
  },
  {
    id: 2,
    firstName: "Lily",
    lastName: "Doe",
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
  const [modalCreateStudent, setModalCreateStudent] = useState(false);
  const studentsData = useSelector((state) => state.students.value);
  const paymentsData = useSelector((state) => state.payments.value);
  const dispatch = useDispatch();

  // connexion modal invite student dans la liste des students
  const [selectedStudent, setSelectedStudent] = useState(null);
  const openInviteModal = (student) => {
    setSelectedStudent(student);
    setModalAddStudent(true);
  };

  useEffect(() => {
    (async () => {
      // Fetch students
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/students/getStudents`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log("Data students fetched:", data);
        // Version dès que backend ok
        data.result
          ? dispatch(getStudents(data.students))
          : console.log(data.error);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      // Fetch payments
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/getInvoices`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log("Data invoices fetched:", data);
        // Version dès que backend ok
        data.result
          ? dispatch(getPayments(data.invoices))
          : console.log(data.error);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      //fetch events
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/lessons/getLessons`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();
        console.log("Data lessonsfetched:", data);
        // Version dès que backend ok
        data.result
          ? dispatch(getEvents(data.lessons))
          : console.log(data.error);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();

    // En attendant données backend, dispatch de données statiques
    dispatch(getStudents(dataStudent));
    dispatch(getPayments(dataPayment));
    dispatch(getEvents(events));
  }, []);

  const students = studentsData.map((data, i) => (
    <StudentCard
      key={i}
      id={data.id}
      firstname={data.firstName}
      lastname={data.lastName}
      discipline={data.discipline}
      invite={(data.status || "Prospect") === "Prospect"}
      status={data.status || "Prospect"}
      subscription={
        typeof data.subscription === "string"
          ? data.subscription
          : data.subscription?.type || ""
      }
      email={data.email}
      onInviteClick={() => openInviteModal(data)}
    />
  ));

  const payments = paymentsData.map((data, i) => (
    <PaymentCard
      key={i}
      // id={data.id}
      firstname={data.firstName}
      lastname={data.lastName}
      paymentTerm={data.modalite}
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
                  onClick={() => setModalCreateStudent(true)}
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
      {modalCreateStudent && (
        <ModalCreateStudent
          onClose={() => setModalCreateStudent(false)}
          onCreated={(data) => {
            setModalCreateStudent(false);

            if (data?.student) {
              dispatch(addStudentToStore(data.student));
              setSelectedStudent(data.student);
              setModalAddStudent(true);
            }
          }}
        />
      )}
      {modalAddStudent && (
        <ModalAddStudent
          student={selectedStudent}
          onClose={() => setModalAddStudent(false)}
          onInvited={() => setModalAddStudent(false)}
        />
      )}
    </div>
  );
}

export default DashboardTeacher;
