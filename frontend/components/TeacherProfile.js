import { useEffect, useState } from "react";
import HeaderTeacher from "../../components/HeaderTeacher";
import FooterTeacher from "../../components/FooterTeacher";
import styles from "../../styles/TeacherProfile.module.css";

function TeacherProfile() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: "",
    discipline: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [userRes, teacherRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/me`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const userData = await userRes.json();
        const teacherData = await teacherRes.json();

        if (userData.result && teacherData.result) {
          setFormData({
            firstName: userData.user.firstName || "",
            lastName: userData.user.lastName || "",
            email: userData.user.email || "",
            phone: teacherData.teacher.phone || "",
            address: teacherData.teacher.address || "",
            avatarUrl: teacherData.teacher.avatarUrl || "",
            discipline: (teacherData.teacher.discipline || []).join(", "),
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/teachers/me`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            avatarUrl: formData.avatarUrl,
            discipline: formData.discipline
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        },
      );

      const data = await response.json();

      if (data.result) {
        setMessage("Profil mis à jour avec succès");
      } else {
        setMessage(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setMessage("Erreur serveur");
    }
  };

  return (
    <>
      <HeaderTeacher />

      <main className={styles.container}>
        <h1 className={styles.title}>Mon profil</h1>

        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <img
              src="https://via.placeholder.com/110"
              alt="Avatar"
              className={styles.avatarPreview}
            />
          </div>

          <form className={styles.form}>
            <div className={styles.inlineRow}>
              <div className={styles.row}>
                <label>Prénom</label>
                <input type="text" />
              </div>

              <div className={styles.row}>
                <label>Nom</label>
                <input type="text" />
              </div>
            </div>

            <div className={styles.row}>
              <label>Email</label>
              <input type="text" disabled />
            </div>

            <div className={styles.row}>
              <label>Téléphone</label>
              <input type="text" />
            </div>

            <div className={styles.row}>
              <label>Adresse</label>
              <input type="text" />
            </div>

            <div className={styles.row}>
              <label>Disciplines</label>
              <input type="text" placeholder="Maths, Piano, Guitare..." />
            </div>

            <div className={styles.row}>
              <label>Avatar URL</label>
              <input type="text" />
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.saveButton}>
                Enregistrer
              </button>
            </div>

            {message && <p className={styles.message}>{message}</p>}
          </form>
        </div>
      </main>

      <FooterTeacher />
    </>
  );
}

export default TeacherProfile;
