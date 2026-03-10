var express = require("express");
var router = express.Router();

require("../models/connection");
const Invoice = require("../models/invoices");
const Student = require("../models/students");
const Teacher = require("../models/teachers");
const { checkBody } = require("../modules/checkBody");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

//---------------------Helpers------------------

async function refreshInvoiceStatuses(invoices) {
  const now = new Date();
  const updates = [];

  for (const inv of invoices) {
    if (!inv.dueAt || inv.status === "paid") continue;

    const dueDate = new Date(inv.dueAt);

    if (inv.status === "scheduled" && dueDate <= now) {
      inv.status = "pending";
      updates.push(inv.save());
      continue;
    }

    if (inv.status === "pending" && dueDate < now) {
      inv.status = "late";
      updates.push(inv.save());
    }
  }

  if (updates.length) {
    await Promise.all(updates);
  }
}

//---------------------Routes-------------------

// GET /invoices/getInvoices
router.get(
  "/getInvoices",
  authMiddleware,
  requireRole("teacher"),
  async function (req, res) {
    try {
      const teacher = await Teacher.findOne({ user: req.user.userId });

      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher not found" });
      }

      const data = await Invoice.find({ teacher: teacher._id })
        .populate({
          path: "student",
          populate: "user",
        })
        .sort({ createdAt: -1 });
      await refreshInvoiceStatuses(data);

      if (!data.length) {
        return res.json({ result: true, invoices: [] });
      }

      const studentInfo = await Student.find({ teacher: teacher._id });

      const invoices = data.map((obj) => {
        const matchedStudent = studentInfo.find(
          (element) => String(element._id) === String(obj.student?._id),
        );

        return {
          _id: obj._id,
          firstName:
            obj.student?.user?.firstName || obj.student?.firstName || "",
          lastName: obj.student?.user?.lastName || obj.student?.lastName || "",
          discipline: matchedStudent?.discipline || "",
          period: obj.period || "",
          label: obj.label || "",
          amount: obj.amount || 0,
          status: obj.status || "pending",
          createdAt: obj.createdAt || null,
          dueAt: obj.dueAt || null,
          modalite: matchedStudent?.subscription?.modalite || "",
          pdfURL: obj.pdfURL || "",
          provider: obj.provider || "manual",
          paymentMethod: obj.paymentMethod || "cash",
        };
      });

      res.json({ result: true, invoices });
    } catch (e) {
      console.error(e);
      res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

// GET /invoices/my  (student only) -> list my invoices
router.get("/my", authMiddleware, requireRole("student"), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.userId });
    if (!student) {
      return res
        .status(404)
        .json({ result: false, error: "Student not found" });
    }

    const invoices = await Invoice.find({ student: student._id }).sort({
      createdAt: -1,
    });

    await refreshInvoiceStatuses(invoices);

    return res.json({ result: true, invoices });
  } catch (e) {
    return res.status(500).json({ result: false, error: "Server error" });
  }
});

// POST /invoices/:id/mark-paid  (teacher only)
router.post(
  "/:id/mark-paid",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const { method = "cash" } = req.body;
      const invoiceId = req.params.id;

      const teacher = await Teacher.findOne({ user: req.user.userId });

      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher not found" });
      }

      const invoice = await Invoice.findOne({
        _id: invoiceId,
        teacher: teacher._id,
      });

      if (!invoice) {
        return res
          .status(404)
          .json({ result: false, error: "Invoice not found" });
      }

      invoice.status = "paid";
      invoice.paidAt = new Date();
      invoice.provider = "manual";
      invoice.paymentMethod = method;

      await invoice.save();

      return res.json({ result: true, invoice });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

// DELETE /invoices/:id  (teacher only)
router.delete(
  "/:id",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.user.userId });

      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher not found" });
      }

      const invoice = await Invoice.findOne({
        _id: req.params.id,
        teacher: teacher._id,
      });

      if (!invoice) {
        return res
          .status(404)
          .json({ result: false, error: "Invoice not found" });
      }

      // facture déjà payée
      if (invoice.status === "paid") {
        return res.status(400).json({
          result: false,
          error: "Impossible de supprimer une facture déjà payée",
        });
      }

      // cours déjà passé
      if (invoice.dueAt && new Date(invoice.dueAt) <= new Date()) {
        return res.status(400).json({
          result: false,
          error:
            "Impossible de supprimer une facture liée à un cours déjà passé",
        });
      }

      await Invoice.deleteOne({ _id: invoice._id });

      return res.json({ result: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

// --------------------------MOCK -------------------------
// POST seed-mock
router.post(
  "/seed-mock",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ user: req.user.userId });

      if (!teacher) {
        return res
          .status(404)
          .json({ result: false, error: "Teacher not found" });
      }

      const students = await Student.find({ teacher: teacher._id }).limit(3);

      if (!students.length) {
        return res.status(400).json({
          result: false,
          error: "No students found for this teacher",
        });
      }

      const docs = [];

      if (students[0]) {
        docs.push({
          teacher: teacher._id,
          student: students[0]._id,
          period: "Mars 2026",
          label: "Cours hebdomadaire",
          amount: 45,
          status: "pending",
          provider: "manual",
          paymentMethod: "cash",
        });
      }

      if (students[1]) {
        docs.push({
          teacher: teacher._id,
          student: students[1]._id,
          period: "Février 2026",
          label: "Abonnement mensuel",
          amount: 60,
          status: "paid",
          provider: "manual",
          paymentMethod: "transfer",
          paidAt: new Date(),
        });
      }

      if (students[2]) {
        docs.push({
          teacher: teacher._id,
          student: students[2]._id,
          period: "Janvier 2026",
          label: "Cours individuel",
          amount: 50,
          status: "late",
          provider: "manual",
          paymentMethod: "check",
        });
      }

      const created = await Invoice.insertMany(docs);

      return res.json({ result: true, invoices: created });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

module.exports = router;
