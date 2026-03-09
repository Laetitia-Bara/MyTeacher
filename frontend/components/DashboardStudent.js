import HeaderStudent from "./HeaderStudent";
import FooterStudent from "./FooterStudent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEuroSign } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import BigCalendarStudent from "./BigCalendarStudent";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../lib/api";
import { getEvents } from "../reducers/planning";

import styles from "../styles/DashboardStudent.module.css";

function DashboardStudent() {
  const dispatch = useDispatch();

  const [paymentStatus, setPaymentStatus] = useState("Aucun paiement");

  useEffect(() => {
    api("/users/me").then(({ ok, data }) => {
      if (!ok || !data?.result) {
        console.log(data?.error || "Erreur récupération utilisateur");
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        console.log("Aucun userId trouvé");
        return;
      }

      // Charger les cours
      api(`/lessons/getLessonsStudentById/${userId}`).then(({ ok, data }) => {
        if (!ok || !data?.result) {
          console.log(data?.error || "Erreur chargement cours élève");
          return;
        }

        dispatch(getEvents(data.lessons));
      });

      // Charger les paiements
      api(`/invoices/getInvoicesStudentById/${userId}`).then(({ ok, data }) => {
        if (!ok || !data?.result) {
          console.log(data?.error || "Erreur chargement paiements");
          return;
        }

        const invoices = data.invoices || [];

        if (invoices.some((i) => i.status === "late")) {
          setPaymentStatus("En retard");
        } else if (invoices.some((i) => i.status === "pending")) {
          setPaymentStatus("En attente");
        } else if (invoices.some((i) => i.status === "paid")) {
          setPaymentStatus("À jour");
        } else {
          setPaymentStatus("Aucun paiement");
        }
      });
    });
  }, [dispatch]);

  return (
    <div className={styles.body}>
      <HeaderStudent />

      <h1 className={styles.title}>Mon dashboard</h1>

      <div className={styles.content}>
        <fieldset className={styles.leftside}>
          <legend className={styles.titre}>Planning</legend>
          <BigCalendarStudent />
        </fieldset>

        <fieldset className={styles.rightside}>
          <legend className={styles.titre}>Alertes</legend>

          <div className={styles.contenue}>
            <p>
              <span style={{ color: "#BF99A0" }}>
                <FontAwesomeIcon icon={faEuroSign} />
              </span>{" "}
              Status paiement :
            </p>
            <p className={styles.status}>{paymentStatus}</p>
          </div>

          <div className={styles.contenue}>
            <p>
              <span style={{ color: "#84DCCF" }}>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>{" "}
              Messages non lus :
            </p>
            <p className={styles.nb}>0</p>
          </div>

          <div className={styles.contenuebot}>
            <p>
              <span style={{ color: "#bccbe0" }}>
                <FontAwesomeIcon icon={faInbox} />
              </span>{" "}
              Document mis à disposition :
            </p>
            <p className={styles.doc}>0</p>
          </div>
        </fieldset>
      </div>

      <FooterStudent />
    </div>
  );
}

export default DashboardStudent;