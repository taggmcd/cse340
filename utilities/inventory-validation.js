const accountModel = require("../models/inventory-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classificaiton name."),
    body("classification_name")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Only letters and numbers are allowed"),
  ];
};

/* ******************************
 * Check data and return errors or continue to creation
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/create-type", {
      errors,
      title: "Create Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/***********************************
 *  Inventory Data Validation Rules
 ********************************** */
validate.inventoryRules = () => {
  return [
    // make is required and must be string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a make."), // on error this message is sent.

    // model is required and must be string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."), // on error this message is sent.

    // year is required and must be string
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4 })
      .withMessage("Please provide a year."), // on error this message is sent.

    // description is required and must be string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // price is required and must be string
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a price."), // on error this message is sent.

    // miles is required and must be string
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide miles."), // on error this message is sent.

    // color is required and must be string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a color."), // on error this message is sent.

    // classification_id is required and must be string
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification."), // on error this message is sent.
  ];
};

/* ******************************
 * Check data and return errors or continue to creation
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classifications = await utilities.buildClassificationList();

    res.render("inventory/create", {
      errors,
      title: "Create Inventory",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      classifications,
    });
    return;
  }
  next();
};
module.exports = validate;
