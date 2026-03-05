var express = require("express");
var router = express.Router();

require("../models/connection");
const Invoice = require("../models/invoices");
const Student = require("../models/students");
const { checkBody } = require("../modules/checkBody");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

//Get Invoices
// ne plus accepter teacherId dans le body (sécurité)
router.get(
  "/getInvoices",
  authMiddleware,
  requireRole("teacher"),
  function (req, res) {
    let invoices = [];
    Invoice.find({ teacher: req.user.userId })
      .populate({
        path: "student",
        populate: "user",
      })
      .then((data) => {
        if (data.length > 0) {
          Student.find({ teacher: req.user.userId })
            .then((studentInfo) => {
              for (let obj of data) {
                let modalite = studentInfo.find(
                  (element) => String(element._id) === String(obj.student._id),
                ).subscription.modalite;
                invoices.push({
                  firstName: obj.student.user.firstName,
                  lastName: obj.student.user.lastName,
                  period: obj.period,
                  label: obj.label,
                  amount: obj.amount,
                  status: obj.status,
                  createdAt: obj.createdAt,
                  modalite: modalite, //modalite de paiement dans student
                });
              }
            })
            .then(() => {
              res.json({ result: true, invoices: invoices });
            });
        } else {
          res.json({ result: false, error: "No invoices found" });
        }
      });
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
      const { method = "cash" } = req.body; // "cash" | "check" | "transfer"
      const invoiceId = req.params.id;

      const invoice = await Invoice.findOne({
        _id: invoiceId,
        teacher: req.user.userId, // sécurité : le prof ne peut modifier que SES factures
      });

      if (!invoice) {
        return res
          .status(404)
          .json({ result: false, error: "Invoice not found" });
      }

      invoice.status = "paid";
      invoice.paidAt = new Date();

      invoice.label = invoice.label || "Invoice";
      invoice.label = `${invoice.label} (paid: ${method})`;

      await invoice.save();

      return res.json({ result: true, invoice });
    } catch (e) {
      return res.status(500).json({ result: false, error: "Server error" });
    }
  },
);

module.exports = router;
