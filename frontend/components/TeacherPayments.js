import { useEffect, useMemo, useState } from "react";
import HeaderTeacher from "./HeaderTeacher";
import FooterTeacher from "./FooterTeacher";
import styles from "../styles/TeacherPayments.module.css";

function TeacherPayments() {
  const [invoices, setInvoices] = useState([]);
  const [message, setMessage] = useState("");

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/getInvoices`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (data.result) {
        setInvoices(data.invoices || []);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const upcomingTotal = useMemo(() => {
    return invoices
      .filter((inv) => inv.status === "pending")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices]);

  const totalAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices]);

  const handleMarkPaid = async (invoiceId) => {
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/${invoiceId}/mark-paid`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ method: "cash" }),
        },
      );

      const data = await response.json();

      if (data.result) {
        setMessage("Facture marquée comme payée");
        fetchInvoices();
      } else {
        setMessage(data.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Mark paid error:", error);
      setMessage("Erreur serveur");
    }
  };

  const handleExport = () => {
    const lines = [
      ["Élève", "Date", "Libellé", "Montant", "Statut"],
      ...invoices.map((inv) => [
        `${inv.firstName} ${inv.lastName}`,
        inv.createdAt
          ? new Date(inv.createdAt).toLocaleDateString("fr-FR")
          : "",
        inv.label || inv.period || "",
        `${inv.amount || 0} €`,
        inv.status || "",
      ]),
    ];

    const csvContent = lines.map((row) => row.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "factures_teacher.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <HeaderTeacher />

      <main className={styles.container}>
        <h1 className={styles.title}>PAIEMENTS</h1>

        <section className={styles.card}>
          <div className={styles.badgeTitle}>Mes factures</div>

          <div className={styles.topRow}>
            <div className={styles.infoBox}>
              Paiements à venir : <strong>{upcomingTotal}€</strong>
            </div>

            <div className={styles.infoBox}>
              Total des paiements : <strong>{totalAmount}€</strong>
            </div>

            <button className={styles.exportButton} onClick={handleExport}>
              Exporter les factures
            </button>
          </div>

          <div className={styles.tableWrapper}>
            {invoices.length === 0 ? (
              <p className={styles.empty}>Aucune facture trouvée</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv._id} className={styles.invoiceRow}>
                  <div className={styles.cellName}>
                    {inv.firstName} {inv.lastName}
                  </div>

                  <div className={styles.cellDate}>
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleDateString("fr-FR")
                      : "-"}
                  </div>

                  <div className={styles.cellStatus}>
                    {inv.status === "paid"
                      ? "Paiement : effectué"
                      : inv.status === "late"
                        ? "Paiement : en retard"
                        : "Paiement : à venir"}
                  </div>

                  <div className={styles.cellAmount}>{inv.amount}€</div>

                  <div className={styles.cellAction}>
                    {inv.status !== "paid" ? (
                      <button
                        className={styles.payButton}
                        onClick={() => handleMarkPaid(inv._id)}
                        title="Marquer comme payé"
                      >
                        ⬇
                      </button>
                    ) : (
                      <span className={styles.doneIcon}>✓</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {message && <p className={styles.message}>{message}</p>}
        </section>
      </main>

      <FooterTeacher />
    </>
  );
}

export default TeacherPayments;
