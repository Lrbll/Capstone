"use strict";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
// const logger = require("morgan");

//라우팅
const home = require("./src/routes/home");
var authCheck = require("./src/public/js/home/authCheck.js");

//앱세팅
app.set("views", "./src/views");
app.set("view engine", "ejs");

//url을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우, 제대로 인식되지 않는 문제 해결
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/src/public`));
app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.get("/", (req, res, next) => {
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/login");
    return false;
  } else {
    next();
  }
});

app.get("/login", (req, res, next) => {
  if (authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/logout");
    return false;
  } else {
    next();
  }
});

app.use("/", home);

module.exports = app;
