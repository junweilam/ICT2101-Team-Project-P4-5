const express = require("express");

const instrumentRoutes = require("../controller/instrumentController.js");

const router = express.Router();

router.post("/allInstruments", instrumentRoutes.allInstruments);

router.post("/create", instrumentRoutes.create);

router.post("/delete", instrumentRoutes.delete);

router.post("/update", instrumentRoutes.update);

router.post("/settings", instrumentRoutes.settings);

router.post("/getInstrumentTypes", instrumentRoutes.getInstrumentTypes);

module.exports = router;