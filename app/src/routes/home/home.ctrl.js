"use strict";

//

const User = require("../../models/User");

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
  login: async (req, res) => {
    const user = new User(req.body);
    const response = await user.login();
    console.log(response);
    return res.json(response);
  },

  register: async (req, res) => {
    const user = new User(req.body);
    const response = await user.register();
    console.log(response);
    return res.json(response);
  },
};

module.exports = {
  output,
  process,
};
