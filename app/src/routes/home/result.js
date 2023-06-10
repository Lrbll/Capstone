"use strict";
const express = require("express");
const router = express.Router();
const fs = require("fs");
let db = require("../../config/db");

// url에 대한 페이지 처리 로직을 담당하는 핸들러 함수
const urlHandler = (req, res, url) => {
  const is_logined = req.session.is_logined;
  console.log(url);

  // url에 해당하는 페이지 처리 로직
  const query = `SELECT results FROM results_info WHERE id = '${req.session.nickname}' AND url = '${url}' ORDER BY num DESC LIMIT 1`;

  db.mysql.query(query, (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length === 0) {
      // 해당하는 결과가 없는 경우 처리
      res.status(404).send("Results not found");
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

      res.render("home/result2", {
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
};

router.get("/", (req, res) => {
  const is_logined = req.session.is_logined;
  const nickname = req.session.nickname;

  // 데이터베이스 쿼리를 실행하여 해당 세션의 nickname과 일치하는 행을 조회합니다.
  const query = `SELECT DISTINCT url FROM results_info WHERE id = '${nickname}'`;

  db.mysql.query(query, (error, results) => {
    if (error) {
      console.error("Failed to fetch data:", error);
      res
        .status(500)
        .json({ error: "서버 오류가 발생했습니다.", detail: error });
      return;
    }

    // 결과에서 고유한 url 값들을 추출합니다.
    const urls = results.map((row) => row.url);

    // 고유한 url 값들을 기반으로 페이지를 렌더링합니다.
    urls.forEach((url) => {
      router.get(`/${url}`, (req, res) => {
        urlHandler(req, res, url);
      });
    });

    res.render("home/result", {
      is_logined: is_logined,
      urls: urls,
    });
  });
});

module.exports = router;
