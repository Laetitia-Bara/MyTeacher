const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
  teacher: mongoose.Types.ObjectId, 
  student: [mongoose.Types.ObjectId],
  structure: String,
  title: String,
  startAt: Date,
  endAt: Date,
  locationType: String, //Fixed Answer
  locationDetails: String,
  status: String,
  teacherNotes: String,
  createdAt: Date,
  updatedAt: Date,
});

const Lesson = mongoose.model('lessons', lessonSchema);

module.exports = Lesson;