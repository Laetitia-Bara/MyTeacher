require("dotenv").config();
require("./models/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var invitationsRouter = require("./routes/invitations");
var teachersRouter = require("./routes/teachers");
var studentsRouter = require("./routes/students");
var lessonsRouter = require("./routes/lessons");
var invoicesRouter = require("./routes/invoices");

var app = express();

const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3001",
  "https://myteacher-inky.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.set("trust proxy", 1);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/teachers", teachersRouter);
app.use("/students", studentsRouter);
app.use("/lessons", lessonsRouter);
app.use("/invitations", invitationsRouter);
app.use("/invoices", invoicesRouter);

module.exports = app;
