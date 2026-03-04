const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "teachers",
          required: true,
    },
    student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "students",
          required: true,
    },
    period: String,
    label: String,
    amount: Number,
    status: {
        type: String,
        enum: ['pending', 'paid', 'late']
    },
    pdfURL: String,
    createdAt: Date,
    paidAt: Date,
});

const Invoice = mongoose.model('invoices', invoiceSchema);

module.exports = Invoice;