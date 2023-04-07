"use strict";

const UserStorge = require("../../models/UserStorage");

const output = {
  home: (req, res) => {
    res.render("home/index");
  },

  login: (req, res) => {
    res.render("home/signin");
  },

  register: (req, res) => {
    res.render("home/signup");
  },
};

const process = {
  login: (req, res) => {
    const id = req.body.id,
      password = req.body.password;

    console.log(UserStorge.getUsers());

    const response = {};
    // if (users.id.includes(id)) {
    //   const idx = users.id.indexOf(id);
    //   if (users.password[idx] === password) {
    //     response.success = true;
    //     return res.json(response);
    //   }
    // }

    response.success = false;
    response.msg = "로그인에 실패하였습니다.";
    return res.json(response);
  },
};

module.exports = {
  output,
  process,
};
