"use strict";

const output = {
  home: (req, res) => {
    res.render("home/index");
  },

  login: (req, res) => {
    res.render("home/login");
  },

  register: (req, res) => {
    res.render("home/register");
  },

  diagnostics: (req, res) => {
    res.render("home/diagnostics");
  },

  list: (req, res) => {
    res.render("home/list");
  },

  info: (req, res) => {
    res.render("home/info");
  },

  result: (req, res) => {
    res.render("home/result");
  },

  test: (req, res) => {
    res.render("home/test");
  },
};

const process = {
  login: (req, res) => {
    let db = require("../../config/db");
    //    let bcrypt = require("bcrypt");
    let { id, pw } = req.body;
    // db에서 사용자가 입력한 아이디를 조회한다.
    db.mysql.query("SELECT * FROM users WHERE id=?", id, (err, users) => {
      // 만약 사용자 정보가 입력한 아이디가 존재하지 않은 경우 에러메세지를 보여준다.
      if (err || !users[0]) {
        res.send(
          "<script>alert('존재하지 않는 아이디 입니다.'); window.location.replace('/login');</script>"
        );
      }
      /* 사용자가 입력한 비밀번호와 db에 암호화 되어있는 비밀번호를 비교해서 참이면 로그인
         아니면 에러메세지를 띄어준다. */
      bcrypt.compare(pw, users[0].pw, (err, tf) => {
        if (tf !== true) {
          res.send(
            "<script>alert('일치하지 않는 비밀번호 입니다.'); window.location.replace('/login');</script>"
          );
        } else {
          /* 로그인 성공시 session에 is_logined라는 변수에 true값을 저장한다.
             true 값을 저장하는 이유는 만약 로그인 상태가 아닐경우 로그인 페이지로 이동되게하게끔 하기위해 만든 변수다. */
          req.session.is_logined = true;
          return res.redirect("/");
        }
      });
    });
  },

  /* /logout으로 post요청이 오면 로그인 상태를 해제한다.  */
  // router.post("/logout", (req, res, next) => {
  //   req.session.destroy((err) => {
  //     return res.redirect("/");
  //   });
  // });

  register: (req, res, next) => {
    let db = require("../../config/db");
    //    let bcrypt = require("bcrypt");
    // 사용자가 웹 페이지에서 입력한 id, pw를 id, pw 라는 변수로 저장한다.
    let { id, pw } = req.body;
    // 비밀번호를 암호화 한다.(bcrypt에서 지원하는 hashSync라는 함수로 암호화)
    //    pw = bcrypt.hashSync(pw);
    // db에 저장하는 기능
    let sql = { id, pw };
    db.mysql.query("INSERT INTO users set ?", sql, (err) => {
      // err에서는 입력한 아이디가 이미 db상에서 존재하는 경우에 발생한다.
      if (err) {
        console.log(err);
        res.send(
          "<script>alert('이미 존재하는 아이디 입니다.'); window.location.replace('/register');</script>"
        );
      } else {
        // 아이디가 db에 저장되어 있지 않는 경우라면 회원가입을 완료한뒤에 로그인페이지로 이동한다.
        return res.redirect("/login");
      }
    });
  },
};

module.exports = {
  output,
  process,
};
