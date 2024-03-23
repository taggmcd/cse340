const utilities = require("../utilities/");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post("/login", utilities.handleErrors(accountController.login));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerStore)
);

module.exports = router;
