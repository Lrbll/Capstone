"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/diagnostics", ctrl.output.diagnostics);
router.get("/list", ctrl.output.list);
router.get("/info", ctrl.output.info);
router.get("/result", ctrl.output.result);

router.post("/diagnostics", ctrl.process.confirmLogin);
// router.post("/diagnostics", ctrl.process.runPython);

module.exports = router;
