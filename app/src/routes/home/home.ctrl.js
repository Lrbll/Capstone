"use strict";

const { spawn } = require("child_process");
const fs = require("fs");
var authCheck = require("../../../src/public/js/home/authCheck.js");
let db = require("../../config/db");

const output = {
  home: (req, res) => {
    const is_logined = req.session.is_logined;
    fs.readFile("src/scripts_info/scripts.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading JSON file");
        return;
      }

      const scripts = JSON.parse(data);
      res.render("home/index", { scripts: scripts, is_logined: is_logined });
    });
  },

  diagnostics: (req, res) => {
    const is_logined = req.session.is_logined;
    res.render("home/diagnostics", { is_logined: is_logined });
  },

  list: (req, res) => {
    const is_logined = req.session.is_logined;
    fs.readFile("src/scripts_info/scripts.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading JSON file");
        return;
      }

      const scripts = JSON.parse(data);
      res.render("home/list", { scripts: scripts, is_logined: is_logined });
    });
    // res.render("home/list", { is_logined: is_logined });
  },

  info: (req, res) => {
    const is_logined = req.session.is_logined;
    res.render("home/info", { is_logined: is_logined });
  },

  result: (req, res) => {
    const is_logined = req.session.is_logined;

    // DB에서 진단도구 결과 가져오기
    const query = "SELECT results FROM results_info";
    db.mysql.query(query, (err, results) => {
      if (err) {
        console.error("Error querying the database:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const jsonData = JSON.parse(results[0].results);
      const {
        AE,
        BA,
        BF,
        BS,
        DL,
        SF,
        SM,
        DOR,
        RFA,
        XSS,
        Base,
        CSRF,
        LDAP,
        Cookie,
        PHP_CI,
        Redirect,
        SI_Login,
        SI_Search,
        XML_XPATH,
        XSS_Stored,
      } = jsonData;
      console.log(jsonData);

      // 파일에서 점검항목 info 가져오기
      fs.readFile("src/scripts_info/scripts.json", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error reading JSON file");
          return;
        }

        const scripts = JSON.parse(data);

        res.render("home/result", {
          is_logined: is_logined,
          scripts: scripts,
          AE,
          BA,
          BF,
          BS,
          DL,
          SF,
          SM,
          DOR,
          RFA,
          XSS,
          Base,
          CSRF,
          LDAP,
          Cookie,
          PHP_CI,
          Redirect,
          SI_Login,
          SI_Search,
          XML_XPATH,
          XSS_Stored,
        });
      });
    });
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

  runPython: (req, res) => {
    const url = req.body;

    const pythonProcess = spawn("C:\\Python310\\python", ["tools_p.py", url]);

    // pythonProcess.stdout.on("data", (data) => {
    //   // Python 스크립트에서 반환된 데이터를 처리합니다.
    // });

    // pythonProcess.stderr.on("data", (data) => {
    //   const error = data.toString();
    //   console.error("오류:", error);
    //   res
    //     .status(500)
    //     .json({ error: "서버 오류가 발생했습니다.", detail: error });
    // });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        // Python 스크립트 실행 성공
        res.json({ success: true });
      } else {
        // Python 스크립트 실행 실패
        res.json({ success: false });
      }
    });
  },

  confirmLogin: (req, res, next) => {
    if (!authCheck.isOwner(req, res)) {
      // 로그인 안되어있으면 로그인 페이지로 이동시킴
      res.send(`<script type="text/javascript">alert("로그인 후, 이용할 수 있습니다."); 
                document.location.href="/auth/login";</script>`);
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
