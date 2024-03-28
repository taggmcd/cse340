const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

baseController.purposeError = async function (req, res, next) {
  const nav = await utilities.getNav();
  throw new Error(
    "We are cuasing errors on purpose to test the error handling middleware. This is a test of the emergency broadcast system. This is only a test. If this were a real emergency, you would be instructed to run for the hills and scream like a little"
  );
};

module.exports = baseController;
