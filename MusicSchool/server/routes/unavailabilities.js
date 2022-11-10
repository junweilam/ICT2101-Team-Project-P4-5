const express = require("express");

const routes = require("../controller/unavailabilitiesController.js");

const router = express.Router();

router.post("/allUnavailabilities", routes.allUnavailabilities);

router.post("/allUnavailabilitiesForUser", routes.allUnavailabilitiesForUser);

router.post("/create", routes.create);

router.post("/toggle", routes.toggle);

router.post("/delete", routes.delete);

router.post("/update", routes.update);

router.post("/settings", routes.settings);

module.exports = router;