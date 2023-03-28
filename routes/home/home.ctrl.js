"use strict";

const main = (req, res) => {
  res.render("home/index");
};

const login = (req, res) => {
  res.render("home/signin");
};

const register = (req, res) => {
  res.render("home/signup");
};

module.exports = {
  main,
  login,
  register,
};
