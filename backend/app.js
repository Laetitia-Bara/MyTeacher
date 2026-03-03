require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var invitationsRouter = require("./routes/invitations");
var teachersRouter = require('./routes/teachers');
var studentsRouter = require('./routes/students');
var lessonsRouter = require('./routes/lessons');

var app = express();

const cors = require("cors");
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use('/teachers', teachersRouter);
app.use('/students', studentsRouter);
app.use('/lessons', lessonsRouter);
app.use("/invitations", invitationsRouter);

module.exports = app;
