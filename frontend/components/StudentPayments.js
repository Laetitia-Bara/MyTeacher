import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../lib/api";
import { setInvoices } from "../reducers/invoices";

export default function StudentPaymentsPage() {
  const dispatch = useDispatch();
  const invoices = useSelector((state) => state.invoices.value);

  useEffect(() => {
    (async () => {
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
          <div>Status: {inv.status}</div>
        </div>
      ))}
    </div>
  );
}
