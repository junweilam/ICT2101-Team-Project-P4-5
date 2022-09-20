const express = require("express");

const authRoutes = require("../controller/authController.js");

const router = express.Router();

router.post("/allUsers", authRoutes.allUsers);

router.post("/allUsersOfRole", authRoutes.allUsersOfRole);

router.post("/create", authRoutes.create);

router.post("/delete", authRoutes.delete);

router.post("/update", authRoutes.update);

router.post("/login", authRoutes.login);

router.post("/settings", authRoutes.settings);

router.post("/managerSettings", authRoutes.managerSettings);

module.exports = router;
