const express = require("express");

const studioRoutes = require("../controller/studioController.js");

const router = express.Router();

router.post("/allStudio", studioRoutes.allStudio);

router.post("/getAllInstrumentsInStudios", studioRoutes.getAllInstrumentsInStudios);

router.post("/create", studioRoutes.create);

router.post("/delete", studioRoutes.delete);

router.post("/update", studioRoutes.update);

router.post("/settings", studioRoutes.settings);

module.exports = router;
