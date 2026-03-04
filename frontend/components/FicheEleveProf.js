import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/FicheEleveTeacher.module.css";

function FicheEleveTeacher() {
  let prenom = "Patrick";
  let nom = "Pichard";
  let email = "pat.pich@gmail.com";
  let tel = "0660274387";

  let cours = [
    { date: "10 septembre 2025 14-15h", status: "Ok" },
    { date: "25 septembre 2025 9-10h", status: "Annulé" },
  ];
  let paiements = [
    { date: "Septembre 2025", status: "Ok" },
    { date: "Janvier 2026", status: "OK" },
    { date: "Mai 2026", status: "En attente" },
  ];

  return (
    <div className={styles.body}>
      <HeaderTeacher />

      <h1 className={styles.titre}>Patrick Richard</h1>

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
            <div className={styles.buttonContainer}>
              <button className={styles.bouton}>Modifier</button>
            </div>
          </fieldset>

          <fieldset className={styles.content}>
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

        <fieldset className={styles.right}>
          <legend className={styles.title}>Historique de paiement</legend>
          {paiements.map((paiement, index) => (
            <div key={index} className={styles.field_paiement}>
              <p style={{ width: "6em" }}>Paiement {index + 1}</p>
              <p style={{ width: "12em" }}>{paiement.date}</p>
              {paiement.status === "Annulé" ? (
                <p className={styles.rouge}>Annulé</p>
              ) : paiement.status === "En attente" ? (
                <p className={styles.orange}>En attente</p>
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

export default FicheEleveTeacher;
