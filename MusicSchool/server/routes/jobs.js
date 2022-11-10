const express = require("express");

const routes = require("../controller/jobsController.js");

const router = express.Router();

router.post("/allJobs", routes.allJobs);

router.post("/allJobsForStaff", routes.allJobsForStaff);

router.post("/create", routes.create);

router.post("/delete", routes.delete);

router.post("/update", routes.update);

router.post("/settings", routes.settings);

module.exports = router;