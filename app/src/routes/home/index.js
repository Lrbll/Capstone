"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/diagnostics", ctrl.output.diagnostics);
router.get("/list", ctrl.output.list);
router.get("/info", ctrl.output.info);
router.get("/mypage", ctrl.output.mypage);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);
module.exports = router;
