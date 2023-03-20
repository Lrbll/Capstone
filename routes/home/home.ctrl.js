"use strict";

const main = (req, res) => {
  res.render("home/index");
};

const login = (req, res) => {
  res.render("home/signin");
};

module.exports = {
  main,
  login,
};
