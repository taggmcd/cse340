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
  const classifications = await utilities.buildClassificationList();

  res.render("./inventory/management", {
    title: "Inventory Managment",
    nav,
    errors: null,
    classifications,
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
    const classificationSelect = await utilities.buildClassificationList();
    req.flash("notice", `Congratulations, new inventory has been created.`);
    res.status(201).render("inventory/management", {
      title: "Inventory Managment",
      nav,
      classifications: classificationSelect,
    });
  } else {
    req.flash("notice", "Sorry, creating the inventory failed.");
    res.status(501).render("inventory/create", {
      title: "Create Inventory",
      nav,
      classifications: classificationSelect,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDetailById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    "/images/vehicles/no-image.png",
    "/images/vehicles/no-image-tn.png",
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/manage");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classifications: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build Delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryDetailById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_year} ${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/delete", {
    title: "Delete " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
};

/* ***************************
 *  Delete Inventory Item
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id } = req.body;
  const deleteResult = await invModel.deleteInventoryById(inv_id);
  if (deleteResult) {
    req.flash("notice", `The item was successfully deleted.`);
    res.redirect("/inv/manage");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/delete", {
      title: "Delete ",
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invCont;
