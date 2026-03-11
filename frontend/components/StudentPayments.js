import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../lib/api";
import { setInvoices } from "../reducers/invoices";
const { checkIsSignin } = require("../modules/checkRole");
import { useRouter } from "next/router";

export default function StudentPaymentsPage() {
  const router = useRouter()
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.invoices.value);

  useEffect(() => {
    (async () => {
      checkIsSignin(router); //Check if user is still authenticated, if not send them back to signin
      const { ok, data } = await api("/invoices/my");
      if (ok && data.result) dispatch(setInvoices(data.invoices));
    })();
  }, [dispatch]);

  return (
    <div>
      <h1>Mes paiements</h1>

      {invoices.map((inv) => (
        <div key={inv._id}>
          <div>
            {inv.period} — {inv.label}
          </div>
          <div>{inv.amount} €</div>
          <div>
            Statut :{" "}
            {inv.status === "paid"
              ? "payé"
              : inv.status === "late"
                ? "en retard"
                : "en attente"}
          </div>
        </div>
      ))}
    </div>
  );
}
