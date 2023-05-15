"use strict";

const output = {
  home: (req, res) => {
    res.render("home/index");
  },

  login: (req, res) => {
    res.render("home/login");
  },

  logout: (req, res) => {
    res.render("home/logout");
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

let db = require("../../config/db");

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
              document.location.href="/login";</script>`);
          }
        }
      );
    } else {
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
      document.location.href="/login";</script>`);
    }
  },

  /* /logout으로 post요청이 오면 로그인 상태를 해제한다.  */
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
                document.location.href="/register";</script>`);
          } else {
            // DB에 같은 이름의 회원아이디가 있는 경우
            res.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/register";</script>`);
          }
        }
      );
    } else {
      // 입력되지 않은 정보가 있는 경우
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/register";</script>`);
    }
  },

  saveUrl: (req, res) => {
    var url = req.body.url;

    if (url) {
      db.mysql.query(
        "INSERT INTO service (url) VALUES (?)",
        [url],
        function (error, data) {
          if (error) {
            // 데이터베이스 쿼리 에러 처리
            throw error;
          }
          res.send(`<script type="text/javascript">alert("URL이 저장되었습니다.");
          document.location.href="/diagnostics";</script>`);
        }
      );
    } else {
      res.send(`<script type="text/javascript">alert("URL을 입력해주세요."); 
      document.location.href="/diagnostics";</script>`);
    }
  },
};

module.exports = {
  output,
  process,
};
