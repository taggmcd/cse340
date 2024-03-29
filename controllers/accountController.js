const accountModel = require("../models/account-model");
const utilities = require("../utilities");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver index view
 * *************************************** */
async function index(req, res) {
  let nav = await utilities.getNav();
  let accountData = await accountModel.getAccountById(
    res.locals.accountData.account_id
  );

  res.render("./account/index", {
    title: "Account Home",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_type: accountData.account_type,
  });
}

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Login
 * *************************************** */
async function login(req, res) {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Deliver Update view
 * *************************************** */
async function edit(req, res, next) {
  let nav = await utilities.getNav();
  let account_id = res.locals.accountData.account_id;
  let accountData = await accountModel.getAccountById(account_id);
  res.render("./account/edit", {
    title: "Account Information",
    nav,
    errors: null,
    accountData,
  });
}

/* ****************************************
 *  Process Update
 * *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations ${account_firstname}, your account has been updated.`
    );
    res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/edit", {
      title: "Account Information",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process Password Update
 * *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;
  let hashedPassword;
  hashedPassword = await bcrypt.hashSync(account_password, 10);
  const regResult = await accountModel.updatePassword(
    account_id,
    hashedPassword
  );

  if (regResult) {
    req.flash("notice", `Congratulations, your password has been updated.`);
    res.redirect("/account");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/edit", {
      title: "Account Information",
      nav,
      errors: null,
      account_id,
    });
  }
}

async function logout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/account/login");
}

module.exports = {
  buildLogin,
  login,
  buildRegister,
  registerAccount,
  index,
  edit,
  updateAccount,
  updatePassword,
  logout,
};
