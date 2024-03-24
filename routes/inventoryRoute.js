const utilities = require("../utilities/");
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const inventoryValidate = require("../utilities/inventory-validation");

router.get("/manage", utilities.handleErrors(invController.manage));

router.get("/type/create", utilities.handleErrors(invController.typeCreate));
router.post(
  "/type/create",
  inventoryValidate.classificationRules(),
  inventoryValidate.checkClassificationData,
  utilities.handleErrors(invController.storeClassification)
);

router.get("/create", utilities.handleErrors(invController.invCreate));
router.post("/create", utilities.handleErrors(invController.invStore));

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get("/detail/:invId", utilities.handleErrors(invController.detail));

module.exports = router;
