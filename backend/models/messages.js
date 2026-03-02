const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    teacherId: mongoose.Types.ObjectId, 
    studentId: mongoose.Types.ObjectId,
    senderId: mongoose.Types.ObjectId,
    text: String,
    messageId: mongoose.Types.ObjectId,
    indexation: Number,
    createdAt: Date,
    readAt: Date,
});

const Message = mongoose.model('messages', messageSchema);

model.export = Message;