const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
    teacher: mongoose.Types.ObjectId, 
    student: mongoose.Types.ObjectId,
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

model.export = Invoice;