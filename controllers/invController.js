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

module.exports = invCont;
