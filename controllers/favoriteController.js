const favoriteModel = require("../models/favorite-model");
const utilities = require("../utilities");

/* ****************************************
 *  Deliver index view
 * *************************************** */
async function index(req, res) {
  let nav = await utilities.getNav();
  let favorites = await favoriteModel.getFavorite(
    res.locals.accountData.account_id
  );
  let grid;
  if (favorites.rows.length > 0) {
    grid = await utilities.buildClassificationGrid(favorites.rows);
  }

  res.render("./favorite/index", {
    title: "My Favorites",
    nav,
    errors: null,
    grid,
  });
}

// Set favorite
async function setFavorite(req, res) {
  const account_id = res.locals.accountData.account_id;
  const inventory_id = req.body.inventory_id;
  const previousRoute = req.get("Referrer");
  const result = await favoriteModel.setFavorite(account_id, inventory_id);
  console.log("result", result);
  if (result) {
    req.flash(
      "notice",
      `Congratulations, the vehicle has been added to your favorites.`
    );
  } else {
    req.flash(
      "error",
      "Sorry, the vehicle could not be added to your favorites."
    );
  }
  res.redirect(previousRoute);
}

// Remove favorite
async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id;
  const inventory_id = req.body.inventory_id;
  const previousRoute = req.get("Referrer");

  const result = await favoriteModel.removeFavorite(account_id, inventory_id);
  if (result) {
    req.flash(
      "notice",
      `Congratulations, the vehicle has been removed from your favorites.`
    );
  } else {
    req.flash(
      "error",
      "Sorry, the vehicle could not be removed from your favorites."
    );
  }
  res.redirect(previousRoute);
}

module.exports = {
  index,
  setFavorite,
  removeFavorite,
};
