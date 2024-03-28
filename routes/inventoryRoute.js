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
router.post(
  "/create",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.storeInventory)
);
router.get(
  "/edit/:invId",
  utilities.handleErrors(invController.editInventoryView)
);
router.post(
  "/edit",
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  invController.updateInventory
);

router.get(
  "/delete/:invId",
  utilities.handleErrors(invController.deleteInventoryView)
);
router.post("/delete", invController.deleteInventory);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);
router.get("/detail/:invId", utilities.handleErrors(invController.detail));

module.exports = router;
