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
    if (inv.status === "scheduled" && inv.dueAt && new Date(inv.dueAt) <= now) {
      inv.status = "pending";
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
          period: obj.period || "",
          label: obj.label || "",
          amount: obj.amount || 0,
          status: obj.status || "pending",
          createdAt: obj.createdAt || null,
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

    const invoices = await Invoice.find({ student: student._id })
      .sort({ createdAt: -1 })
      .lean();
    await refreshInvoiceStatuses(data);

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
