const express = require("express");

const routes = require("../controller/jobRejectionRequestController.js");

const router = express.Router();

router.post("/allRequest", routes.allRequests);

router.post("/allRequestAndJobs", routes.allRequestsAndJobs);

router.post("/getRequestsByJobIDandStaffID", routes.getRequestsByJobIDandStaffID);

router.post("/create", routes.create);

router.post("/delete", routes.delete);

router.post("/update", routes.update);

router.post("/settings", routes.settings);

module.exports = router;