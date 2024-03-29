const utilities = require("../utilities/");
const express = require("express");
const router = new express.Router();
const favoriteController = require("../controllers/favoriteController");

// Show all favorites
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.index)
);

// Set favorite
router.post(
  "/set",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.setFavorite)
);

// Remove favorite
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favoriteController.removeFavorite)
);

module.exports = router;
