const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Build inventory by Id view
 * ************************** */
invCont.detail = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryDetailById(inv_id);
  const detail = {};
  detail.make = data.inv_make;
  detail.model = data.inv_model;
  detail.price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(data.inv_price);
  detail.year = data.inv_year;
  detail.miles = new Intl.NumberFormat().format(data.inv_miles);
  detail.color = data.inv_color;
  detail.description = data.inv_description;
  detail.thumbnail = data.inv_thumbnail;
  detail.image = data.inv_image;

  const nav = await utilities.getNav();
  res.render("./inventory/detail", {
    title: " vehicles",
    nav,
    detail,
  });
};

/* ***************************
 *  Manage inventory view
 * ************************** */
invCont.manage = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Inventory Managment",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Create inventory view
 * ************************** */
invCont.invCreate = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classifications = await utilities.buildClassificationList();
  console.log(classifications);
  res.render("./inventory/create", {
    title: "Add a vehicle",
    nav,
    errors: null,
    classifications,
  });
};

/* ***************************
 *  Create classification view
 * ************************** */
invCont.typeCreate = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/create-type", {
    title: "Add a vehicle type",
    nav,
    errors: null,
  });
};

/*****************************************
 *  Process Classification
 **************************************** */
invCont.storeClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.createClassification(classification_name);

  if (regResult) {
    nav = await utilities.getNav();
    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been created.`
    );
    res.status(201).render("inventory/management", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, creating the classification failed.");
    res.status(501).render("inventory/type-create", {
      title: "Create Classification",
      nav,
    });
  }
};

/* ****************************************
 *  Process Inventory
 * *************************************** */
invCont.storeInventory = async function (req, res) {
  let nav = await utilities.getNav();
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

  const regResult = await invModel.createInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    "/images/vehicles/no-image.png",
    "/images/vehicles/no-image-tn.png",
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (regResult) {
    nav = await utilities.getNav();
    req.flash("notice", `Congratulations, new inventory has been created.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Managment",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, creating the inventory failed.");
    res.status(501).render("inventory/create", {
      title: "Create Inventory",
      nav,
    });
  }
};

module.exports = invCont;
