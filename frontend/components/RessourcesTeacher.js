import Head from "next/head";
import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import RessourceCard from "./RessourceCard";
import ModalAddRessource from "./ModalAddRessource";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  const [ressourcesData, setRessourcesData] = useState([]);
  const [sharingRessources, setSharingRessources] = useState([]);
  const studentsData = useSelector((state) => state.students.value);
  const [students, setStudents] = useState([]);
  const [modalAddRessource, setModalAddRessource] = useState(false);
  const [addFlag, setAddFlag] = useState(false);

  useEffect(() => {
    (async () => {
      // Fetch ressources
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ressources/getRessources`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        console.log("Data ressources fetched:", data);
        // Version dès que backend ok
        data.result
          ? setRessourcesData(data.ressources)
          : console.log(data.error);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();

    // En attendant données backend, maj état avec données statiques
    setRessourcesData(dataRessources);
  }, [addFlag]);

  const addToSharingList = (comingProps) => {
    if (!sharingRessources.some((ress) => ress.id === comingProps.id)) {
      setSharingRessources((ress) => [
        ...ress,
        { ...comingProps, share: true },
      ]);
    }
  };

  const deleteRessource = async (comingProps) => {
    console.log("Supprimer ressource", comingProps.id);
    // Fetch delete ressource
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ressources/deleteRessource/${comingProps.id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();
      console.log("Data ressources fetched:", data);
      // Version dès que backend ok
      data.result
        ? setRessourcesData((ress) =>
            ress.filter((r) => r.id !== comingProps.id),
          )
        : console.log(data.error);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    // En attendant données backend, maj état en supprimant la ressource
    setRessourcesData((ress) => ress.filter((r) => r.id !== comingProps.id));
  };

  const downloadRessource = (comingProps) => {
    console.log("Télécharger ressource", comingProps);
  };

  const removeFromSharingList = (comingProps) => {
    setSharingRessources((ress) => ress.filter((r) => r.id !== comingProps.id));
  };

  const shareRessources = async () => {
    // Fetch vers backend pour partager les ressources
    if (students.length > 0 && sharingRessources.length > 0) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ressources/share`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ressources: sharingRessources,
              students,
            }),
          },
        );
        const data = await response.json();
        console.log("Data ressources fetched:", data);
        // Version dès que backend ok
        data.result ? setSharingRessources([]) : console.log(data.error);
      } catch (error) {
        console.error("Error adding event:", error);
      }

      // En attendant que le backend soit ok
      setSharingRessources([]);
      setStudents([]);
      alert("Partage effectué !");
      console.log(
        "Partager ressources",
        sharingRessources,
        "à l'élève",
        students[0],
      );
    }
  };

  const handleAddRessource = async (newRessource) => {
    if (
      newRessource.title !== "" &&
      newRessource.type !== "" &&
      newRessource.url !== ""
    ) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/ressources/add`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: newRessource.title,
              type: newRessource.type,
              url: newRessource.url,
            }),
          },
        );

        const data = await response.json();
        console.log("Data ressources fetched:", data);

        if (data.result) {
          alert("Ressource ajoutée !");
          setAddFlag(!addFlag);
        } else {
          alert(`Erreur : ${data.error}`);
        }
      } catch (error) {
        console.error("Error adding ressource :", error);
      }
    } else {
      console.log("Input data missing");
    }
  };

  const ressources = ressourcesData?.map((data, i) => (
    <RessourceCard
      key={i}
      id={data.id}
      title={data.title}
      type={data.type}
      addToSharingFct={addToSharingList}
      deleteFct={deleteRessource}
      downloadFct={downloadRessource}
      removeFct={removeFromSharingList}
      share={false}
    />
  ));

  const ressourcesToShare = sharingRessources?.map((data, i) => (
    <RessourceCard
      key={i}
      id={data.id}
      title={data.title}
      type={data.type}
      onClick={addToSharingList}
      delete={deleteRessource}
      download={downloadRessource}
      removeFct={removeFromSharingList}
      share={true}
    />
  ));

  const studentsChoice = studentsData.map((data, i) => {
    return (
      <option key={i} value={data.id}>
        {data.firstname} {data.lastname}
      </option>
    );
  });

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
                  className={styles.btn}
                  onClick={() => setModalAddRessource(true)}
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
                {ressourcesToShare}
              </div>
            </div>
            <div className={styles.studentsSection}>
              <div className={styles.studentsList}>
                <select
                  className={styles.selectList}
                  type="text"
                  value={students}
                  onChange={(e) => setStudents([e.target.value])}
                >
                  <option value="">Choisir un élève</option>
                  {studentsChoice}
                </select>
                <button
                  className={styles.shareBtn}
                  onClick={() => shareRessources()}
                >
                  <span className={styles.addText}>Partager</span>
                </button>
                <p className={styles.subtitle}>Partager à...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterTeacher />
      {modalAddRessource && (
        <ModalAddRessource
          onClose={() => setModalAddRessource(false)}
          addRessourceFct={handleAddRessource}
        />
      )}
    </div>
  );
}

export default RessourcesTeacher;
