const express = require("express");

const routes = require("../controller/jobPreferencesController.js");

const router = express.Router();

router.post("/allPreferences", routes.allPreferences);

router.post("/allPreferencesForUser", routes.allPreferencesForUser);

router.post("/create", routes.create);

router.post("/delete", routes.delete);

router.post("/update", routes.update);

module.exports = router;