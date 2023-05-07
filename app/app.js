"use strict";

const express = require("express");
const app = express(); // app은 express를 호출하는 함수
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
let session = require("express-session");

//라우팅
const home = require("./src/routes/home");

//앱세팅
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
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

module.exports = app;
