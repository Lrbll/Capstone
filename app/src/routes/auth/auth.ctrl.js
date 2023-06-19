"use strict";

let db = require("../../config/db");
let authCheck = require("../../../src/public/js/home/authCheck.js");

const output = {
  login: (req, res) => {
    res.render("home/login");
  },

  logout: (req, res) => {
    const nickname = req.session.nickname; // 세션에서 name 값 가져오기
    res.render("home/logout", { nickname: nickname }); // EJS 템플릿에 name 값을 변수로 전달
  },

  register: (req, res) => {
    res.render("home/register");
  },
};

const process = {
  login: (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    // db에서 사용자가 입력한 아이디를 조회한다.
    if (id && pw) {
      // id와 pw가 입력되었는지 확인
      db.mysql.query(
        "SELECT * FROM users WHERE id = ? AND pw = ?",
        [id, pw],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            // db에서의 반환값이 있으면 로그인 성공
            req.session.is_logined = true; // 세션 정보 갱신
            req.session.nickname = id;
            req.session.save(function () {
              res.redirect(`/`);
            });
          } else {
            res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
              document.location.href="/auth/login";</script>`);
          }
        }
      );
    } else {
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
      document.location.href="/auth/login";</script>`);
    }
  },

  /* /auth/logout으로 post요청이 오면 로그인 상태를 해제한다.  */
  logout: (req, res) => {
    req.session.destroy(function (err) {
      res.redirect("/");
    });
  },

  register: (req, res) => {
    var id = req.body.id;
    var pw = req.body.pw;
    var confirm_pw = req.body.confirm_pw;

    if (id && pw && confirm_pw) {
      db.mysql.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        function (error, results, fields) {
          // DB에 같은 이름의 회원아이디가 있는지 확인
          if (error) throw error;
          if (results.length <= 0 && pw == confirm_pw) {
            // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
            db.mysql.query(
              "INSERT INTO users (id, pw) VALUES(?,?)",
              [id, pw],
              function (error, data) {
                if (error) throw error2;
                res.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다.");
                    document.location.href="/";</script>`);
              }
            );
          } else if (pw != confirm_pw) {
            // 비밀번호가 올바르게 입력되지 않은 경우
            res.send(`<script type="text/javascript">alert("비밀번호가 일치하지 않습니다."); 
                document.location.href="/auth/register";</script>`);
          } else {
            // DB에 같은 이름의 회원아이디가 있는 경우
            res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);
          }
        }
      );
    } else {
      // 입력되지 않은 정보가 있는 경우
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
  },

  confirmLogin: (req, res, next) => {
    if (authCheck.isOwner(req, res)) {
      // 로그인 되어있으면 로그아웃 페이지로 이동시킴
      res.redirect("/auth/logout");
      return false;
    } else {
      next();
    }
  },
};

module.exports = {
  output,
  process,
};
