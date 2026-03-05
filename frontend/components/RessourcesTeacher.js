import Head from "next/head";
import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import RessourceCard from "./RessourceCard";
import { useEffect, useState } from "react";

import styles from "../styles/RessourcesTeacher.module.css";

const dataRessources = [
  {
    id: 1,
    title: "Fly me to the moon",
    type: "Partition",
  },
  {
    id: 2,
    title: "Pouette",
    type: "Partition",
  },
  {
    id: 3,
    title: "Sous le vent",
    type: "Partition",
  },
];

function RessourcesTeacher() {
  const [ressourcesData, setRessourcesData] = useState(null);

  useEffect(() => {
    // (async () => {
    //   // Fetch ressources
    //   try {
    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/ressources/getRessources`,
    //       {
    //         method: "GET",
    //         credentials: "include",
    //       },
    //     );
    //     if (!response.ok) {
    //       console.error("backend error", await response.text());
    //       return;
    //     }
    //     const data = await response.json();
    //     console.log("Data ressources fetched:", data);
    //     // Version dès que backend ok
    //     data.result
    //       ? setRessourcesData(data.ressources)
    //       : console.log(data.error);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // })();

    // En attendant données backend, maj état avec données statiques
    setRessourcesData(dataRessources);
  }, []);

  const addToSharingList = (id) => {
    console.log("Ajouter ressource à la liste de partage", id);
  };

  const deleteRessource = (id) => {
    console.log("Supprimer ressource", id);
  };

  const downloadRessource = (id) => {
    console.log("Télécharger ressource", id);
  };

  const ressources = ressourcesData?.map((data, i) => (
    <RessourceCard
      key={i}
      id={data.id}
      title={data.title}
      type={data.type}
      onClick={addToSharingList}
      delete={deleteRessource}
      download={downloadRessource}
    />
  ));

  return (
    <div className={styles.content}>
      <Head>
        <title>MyTeacher - Ressources </title>
      </Head>
      <HeaderTeacher />
      <main className={styles.main}>
        <div className={styles.titlePage}>
          <p className={styles.title}>MES RESSOURCES</p>
        </div>
        <div className={styles.section}>
          <div className={styles.leftSection}>
            <div className={styles.ressourcesSection}>
              <div className={styles.ressourcesList}>
                <p className={styles.subtitle}>Mes ressources</p>
                <button
                  className={styles.addRessourcesBtn}
                  //   onClick={() => setModalAddStudent(true)}
                >
                  <span className={styles.addText}>+ Ajouter</span>
                </button>
                {ressources}
              </div>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.sharingSection}>
              <div className={styles.sharingList}>
                <p className={styles.subtitle}>Ressources à partager</p>
              </div>
            </div>
            <div className={styles.studentsSection}>
              <div className={styles.studentsList}>
                <p className={styles.subtitle}>Partager à...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterTeacher />
      {/* {modalAddStudent && (
        <ModalAddStudent
          onClose={() => setModalAddStudent(false)}
          onInvited={() => setModalAddStudent(false)}
        />
      )} */}
    </div>
  );
}

export default RessourcesTeacher;
