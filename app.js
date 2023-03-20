"use strict";

const express = require("express");
const app = express(); // app은 express를 호출하는 함수
const port = 3000; // 서버 포트 번호는 3000

//라우팅
const home = require("./routes/home");

//앱세팅
app.set("views", "./views");
app.set("view engine", "ejs");

//미들웨어
app.use("/", home);

module.exports = app;
