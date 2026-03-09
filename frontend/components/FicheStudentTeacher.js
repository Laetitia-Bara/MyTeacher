import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/FicheStudentTeacher.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useRef, useMemo, useEffect } from "react";
import { api } from "../lib/api";
import { getStudents } from "../reducers/students";
import { getPayments } from "../reducers/payments";
const { checkIsSignin } = require("../modules/checkRole");
import { useRouter } from "next/router";

function FicheStudentTeacher({ studentId }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const typeRef = useRef(null);
  const priceRef = useRef(null);
  const modaliteRef = useRef(null);

  const students = useSelector((state) => state.students.value);
  const payments = useSelector((state) => state.payments.value);
  const lessons = useSelector((state) => state.planning.value);

  const student = students.find((student) => student.id == studentId);

  const prenom = student?.firstName || "";
  const nom = student?.lastName || "";
  const email = student?.email || "";
  const tel = student?.phone || "";
  const structures = ["Maths", "Chant", "Vélo"];

  const type_abonnement = student?.subscription?.type || "";
  const price = student?.subscription?.price ?? "";
  const modalite = student?.subscription?.modalite || "";

  useEffect(() => {
    checkIsSignin(router); //Check if user is still authenticated, if not send them back to signin
  }, []);

  const studentPayments = useMemo(() => {
    if (!student) return [];

    return payments.filter(
      (payment) =>
        payment.firstName === student.firstName &&
        payment.lastName === student.lastName,
    );
  }, [payments, student]);

  const cours = useMemo(() => {
    return lessons.map((lesson) => {
      const date = new Date(lesson.start);

      const dateString = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const hourString = date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        date: `${dateString} ${hourString}`,
        status: "Ok",
      };
    });
  }, [lessons]);

  function refreshStudents() {
    api("/students/getStudents").then(({ ok, data }) => {
      if (!ok || !data.result) {
        console.log(data.error || "Erreur refresh students");
        return;
      }

      dispatch(getStudents(data.students));
    });
  }

  function handleUpdateIdentity() {
    const body = {
      studentId,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
    };

    api("/students/updateIdentity", {
      method: "PUT",
      body,
    }).then(({ ok, data }) => {
      if (!ok || !data.result) {
        console.log(data.error || "Erreur update identité");
        return;
      }

      refreshStudents();

      api("/invoices/getInvoices").then(({ ok, data }) => {
        if (!ok || !data.result) {
          console.log(data.error || "Erreur refresh payments");
          return;
        }

        dispatch(getPayments(data.invoices));
      });
    });
  }

  function handleUpdateFormula() {
    const body = {
      studentId,
      type: typeRef.current.value,
      price: Number(priceRef.current.value),
      modalite: modaliteRef.current.value,
    };

    api("/students/updateSubscription", {
      method: "PUT",
      body,
    }).then(({ ok, data }) => {
      if (!ok || !data.result) {
        console.log(data.error || "Erreur update formule");
        return;
      }

      refreshStudents();
    });
  }

  if (!student) {
    return (
      <div className={styles.body}>
        <HeaderTeacher />
        <p style={{ padding: "20px" }}>Élève introuvable</p>
        <FooterTeacher />
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <HeaderTeacher />

      <h1 className={styles.titre}>
        {prenom} {nom}
      </h1>

      <div className={styles.container}>
        <div className={styles.left}>
          <fieldset className={styles.content}>
            <legend className={styles.title}>Identité</legend>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Prénom
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={firstNameRef}
                className={styles.input}
                type="text"
                defaultValue={prenom}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Nom
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={lastNameRef}
                className={styles.input}
                type="text"
                defaultValue={nom}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Email
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={emailRef}
                className={styles.input}
                type="email"
                defaultValue={email}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Contact
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={phoneRef}
                className={styles.input}
                type="tel"
                defaultValue={tel}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Structure
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <select className={styles.select} defaultValue={student.structure}>
                {structures.map((structure) => (
                  <option key={structure} value={structure}>
                    {structure}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.bouton}
                type="button"
                onClick={handleUpdateIdentity}
              >
                Modifier
              </button>
            </div>
          </fieldset>

          <fieldset className={styles.content}>
            <legend className={styles.title}>Formule</legend>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Type d'abonnement
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={typeRef}
                className={styles.input}
                type="text"
                defaultValue={type_abonnement}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Prix
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={priceRef}
                className={styles.input}
                type="number"
                defaultValue={price}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Modalité
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
                ref={modaliteRef}
                className={styles.input}
                type="text"
                defaultValue={modalite}
              />
            </div>

            <div className={styles.buttonContainer}>
              <button
                className={styles.bouton}
                type="button"
                onClick={handleUpdateFormula}
              >
                Modifier
              </button>
            </div>
          </fieldset>
        </div>

        <fieldset className={styles.center}>
          <legend className={styles.title}>Historique de paiement</legend>

          {studentPayments.length === 0 ? (
            <p style={{ padding: "10px" }}>Aucun paiement enregistré</p>
          ) : (
            studentPayments.map((paiement, index) => (
              <div key={paiement.id ?? index} className={styles.field_paiement}>
                <p style={{ width: "6em" }}>Paiement {index + 1}</p>
                <p style={{ width: "12em" }}>
                  {paiement.period ?? "Pas de date entrée en bdd"}
                </p>

                {paiement.status === "Annulé" ? (
                  <p className={styles.rouge}>Annulé</p>
                ) : paiement.status === "En attente" ||
                  paiement.status === "pending" ? (
                  <p className={styles.orange}>En attente</p>
                ) : paiement.status === "Retard" ? (
                  <p className={styles.rouge}>Retard</p>
                ) : (
                  <p className={styles.vert}>Ok</p>
                )}
              </div>
            ))
          )}
        </fieldset>

        <fieldset className={styles.right}>
          <legend className={styles.title}>Suivi des cours</legend>

          {cours.length === 0 ? (
            <p style={{ padding: "10px" }}>Aucun cours enregistré</p>
          ) : (
            cours.map((cour, index) => (
              <div key={index} className={styles.field_cours}>
                <p style={{ width: "4em" }}>Cours {index + 1}</p>
                <p style={{ width: "12em" }}>{cour.date}</p>

                {cour.status === "Annulé" ? (
                  <p className={styles.rouge}>Annulé</p>
                ) : (
                  <p className={styles.vert}>Ok</p>
                )}
              </div>
            ))
          )}
        </fieldset>
      </div>

      <FooterTeacher />
    </div>
  );
}

export default FicheStudentTeacher;