"use strict";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const axios = require("axios");
const qs = require("qs");
const session = require("express-session");
// const FileStore = require("session-file-store")(session);
// const logger = require("morgan");

//라우팅
const home = require("./src/routes/home");
const auth = require("./src/routes/auth/auth");
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
  })
);

app.post("/diagnostics", (req, res, next) => {
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.send(`<script type="text/javascript">alert("로그인 후, 이용할 수 있습니다."); 
              document.location.href="/auth/login";</script>`);
    return false;
  } else {
    next();
  }
});

app.get("/auth/login", (req, res, next) => {
  if (authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/auth/logout");
    return false;
  } else {
    next();
  }
});

const kakao = {
  clientID: "10e161ee589ebfb98cc9d69c8de7a96b",
  clientSecret: "ffSHboCrf1NJLyNkx5rVtHSq6GuOEFd2",
  redirectUri: "http://localhost:3000/auth/kakao/callback",
};
//profile account_email
app.get("/auth/kakao", (req, res) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao.clientID}&redirect_uri=${kakao.redirectUri}&response_type=code&scope=profile_nickname`;
  res.redirect(kakaoAuthURL);
});

app.get("/auth/kakao/callback", async (req, res) => {
  //axios>>promise object
  let token;
  try {
    //access토큰을 받기 위한 코드
    token = await axios({
      //token
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify({
        grant_type: "authorization_code", //특정 스트링
        client_id: kakao.clientID,
        client_secret: kakao.clientSecret,
        redirectUri: kakao.redirectUri,
        code: req.query.code, //결과값을 반환했다. 안됐다.
      }), //객체를 string 으로 변환
    });
  } catch (err) {
    res.json(err.data);
  }
  //access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
  let user;
  try {
    console.log(token); //access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
    user = await axios({
      method: "get",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      }, //헤더에 내용을 보고 보내주겠다.
    });
  } catch (e) {
    res.json(e.data);
  }
  console.log(user);

  req.session.kakao = user.data;
  //req.session = {['kakao'] : user.data};

  res.send("success");
});

app.use("/", home);
app.use("/auth", auth);
app.get(kakao.redirectUri);

module.exports = app;
