const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({
    teacherId: mongoose.Types.ObjectId, 
    invitedEmail: String,
    tokenHash:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'accepted', 'expired', 'revoked']
    }, 
    studentId: mongoose.Types.ObjectId, 
    expiresAt: Date,
    createdAt: Date,
    acceptedAt: Date,
});

const Invitation = mongoose.model('invitations', invitationSchema);

model.export = Invitation;