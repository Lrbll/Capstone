"use strict";

let db = require("../../config/db");
let authCheck = require("../../../src/public/js/home/authCheck.js");

const output = {
  login: (req, res) => {
    res.render("home/login");
  },

  register: (req, res) => {
    res.render("home/register");
  },

  mypage: (req, res) => {
    const is_logined = req.session.is_logined;
    res.render("home/mypage", { is_logined: is_logined });
  },
};

const process = {
  confirmLogin: (req, res, next) => {
    if (!authCheck.isOwner(req, res)) {
      res.send(`<script type="text/javascript">alert("로그인이 필요한 항목입니다."); 
      document.location.href="/auth/login";</script>`);
      return false;
    } else {
      next();
    }
  },

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

  newPassword: (req, res) => {
    var id = req.session.nickname;
    var pw = req.body.pw;
    var new_pw = req.body.new_pw;
    var confirm_pw = req.body.confirm_pw;

    if (id && pw && new_pw && confirm_pw) {
      db.mysql.query(
        "SELECT * FROM users WHERE id = ?",
        [id],
        function (error, results, fields) {
          if (error) throw error;

          // Check if the user exists
          if (results.length > 0) {
            var user = results[0];

            // Check if the  password is correct
            if (user.pw === pw) {
              // Check if the new password matches the confirmation
              if (new_pw === confirm_pw) {
                // Update the password in the database
                db.mysql.query(
                  "UPDATE users SET pw = ? WHERE id = ?",
                  [new_pw, id],
                  function (error, data) {
                    if (error) throw error;
                    res.send(`<script type="text/javascript">alert("비밀번호가 변경되었습니다.");
                      document.location.href="/";</script>`);
                  }
                );
              } else {
                // New password and confirmation do not match
                res.send(`<script type="text/javascript">alert("새로운 비밀번호와 확인이 일치하지 않습니다."); 
                  document.location.href="/auth/mypage";</script>`);
              }
            } else {
              //  password is incorrect
              res.send(`<script type="text/javascript">alert("현재 비밀번호가 일치하지 않습니다."); 
                document.location.href="/auth/mypage";</script>`);
            }
          } else {
            // User does not exist
            res.send(`<script type="text/javascript">alert("사용자가 존재하지 않습니다."); 
              document.location.href="/auth/mypage";</script>`);
          }
        }
      );
    } else {
      // Missing information
      res.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/mypage";</script>`);
    }
  },

  deleteAccont: (req, res) => {
    // 현재 로그인한 사용자의 세션 정보 가져오기
    var id = req.session.nickname;

    if (id) {
      // 사용자에게 확인 메시지 보내기
      res.send(`
        <script type="text/javascript">
          var confirmDelete = confirm("정말로 탈퇴하시겠습니까?");
          if (confirmDelete) {
            // 회원 데이터 삭제 로직
            db.mysql.query(
              'DELETE FROM users WHERE id = ?',
              [id],
              function (error, result) {
                if (error) throw error;

                // 로그인 데이터 파기 (세션 삭제)
                req.session.destroy(function (err) {
                  if (err) throw err;
                  
                  alert("회원 탈퇴가 완료되었습니다.");
                  window.location.href = "/";
                });
              }
            );
          } else {
            // 회원 탈퇴 취소
            window.location.href = "/";
          }
        </script>
      `);
    }
  },
};

module.exports = {
  output,
  process,
};
