"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./auth.ctrl");

router.get("/login", ctrl.process.confirmLogin);
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);

router.post("/login", ctrl.process.login);
router.post("/logout", ctrl.process.logout);
router.post("/register", ctrl.process.register);

module.exports = router;
