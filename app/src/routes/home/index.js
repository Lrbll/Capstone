"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/logout", ctrl.output.logout);
router.get("/register", ctrl.output.register);
router.get("/diagnostics", ctrl.output.diagnostics);
router.get("/list", ctrl.output.list);
router.get("/info", ctrl.output.info);
router.get("/result", ctrl.output.result);
router.get("/test", ctrl.output.test);

router.post("/login", ctrl.process.login);
router.post("/logout", ctrl.process.logout);
router.post("/register", ctrl.process.register);
router.post("/diagnostics", ctrl.process.confirmLogin);
router.post("/diagnostics", ctrl.process.saveUrl);

module.exports = router;
