"use strict";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

//라우팅
const home = require("./src/routes/home");
const result = require("./src/routes/home/result");
const auth = require("./src/routes/auth/auth");
const kakao = require("./src/routes/auth/kakao");

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
  })
);

app.use("/", home);
app.use("/result", result);
app.use("/auth", auth);
app.use("/auth/kakao", kakao);

module.exports = app;
