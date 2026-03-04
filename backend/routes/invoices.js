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
router.get('/getInvoices',
    authMiddleware,
    requireRole("teacher"),
    function (req, res) {
    let invoices = []
    Invoice.find({teacher: req.user.userId})
    .populate({
         path    : 'student',
         populate: 'user'
    })
    .then(data => {
        if(data.length > 0)
        {
            Student.find({ teacher: req.user.userId }).then((studentInfo) => {
                for(let obj of data)
                {
                    let modalite = studentInfo.find((element) => String(element._id) === String(obj.student._id)).subscription.modalite
                    invoices.push({
                        firstName: obj.student.user.firstName,
                        lastName: obj.student.user.lastName,
                        period: obj.period,
                        label: obj.label,
                        amount: obj.amount,
                        status: obj.status,
                        createdAt : obj.createdAt,
                        modalite: modalite //modalite de paiement dans student
                    })
                }
            }).then(() => {res.json({result: true, invoices: invoices})})
        }else{res.json({result: false, error : "No invoices found"})}
    })
})

module.exports = router;