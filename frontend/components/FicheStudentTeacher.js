import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/FicheStudentTeacher.module.css";
import { useSelector } from "react-redux";


function FicheStudentTeacher( {studentId} ) {
  const students = useSelector((state) => state.students.value);
  const student = students.find((student) => student.id == studentId);


  const prenom = student?.firstName || "";
  const nom = student?.lastName || "";
  const email = student?.email || "";
  const tel = student?.phone || "";
  let structures = ["Maths", "Chant", "Vélo"];

  const type_abonnement = student?.subscription?.type || "";
  const price = student?.subscription?.price ?? "";
  const modalite = student?.subscription?.modalite || "";


  const payments = useSelector((state) => state.payments.value);
  const studentPayments = student
  ? payments.filter(
      (payment) =>
        payment.firstName === student.firstName &&
        payment.lastName === student.lastName
    )
  : [];

  const lessons = useSelector((state) => state.planning.value);
  const cours = lessons.map((lesson) => {
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
      status: "Ok", // pour l'instant car pas de status dans lesson OU mettre annulé
    };
  });
  console.log(lessons);

  return (
    <div className={styles.body}>
      <HeaderTeacher />

      <h1 className={styles.titre}>{prenom} {nom}</h1>

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
              <input className={styles.input} type="text" defaultValue={nom} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Email
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input
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
              <input className={styles.input} type="tel" defaultValue={tel} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Structure
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <select className={styles.select}>
                {structures.map((structure) => <option value={structure}>{structure}</option>)}
              </select>
            </div>

            <div className={styles.buttonContainer}>
              <button className={styles.bouton}>Modifier</button>
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
              <input className={styles.input} type="text" defaultValue={type_abonnement} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Prix
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input className={styles.input} type="number" defaultValue={price} />
            </div>

            <div className={styles.field}>
              <label className={styles.label} style={{ textAlign: "left" }}>
                Modalité
              </label>
              <label className={styles.label} style={{ textAlign: "center" }}>
                :
              </label>
              <input className={styles.input} type="text" defaultValue={modalite} />
            </div>

            <div className={styles.buttonContainer}>
              <button className={styles.bouton}>Modifier</button>
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
                <p style={{ width: "12em" }}>{paiement.paymentTerm ?? "Pas de date entrée en bdd"}</p>

                {paiement.status === "Annulé" ? (
                  <p className={styles.rouge}>Annulé</p>
                ) : paiement.status === "En attente" ? (
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
            {cours.map((cour, index) => (
              <div key={index} className={styles.field_cours}>
                <p style={{ width: "4em" }}>Cours {index + 1}</p>
                <p style={{ width: "12em" }}>{cour.date}</p>
                {cour.status === "Annulé" ? (
                  <p className={styles.rouge}>Annulé</p>
                ) : (
                  <p className={styles.vert}>Ok</p>
                )}
              </div>
            ))}
        </fieldset>
      </div>

      <FooterTeacher />
    </div>
  );
}

export default FicheStudentTeacher;
