const pool = require("../database/");

// Get favorites for a specific account
async function getFavorite(account_id) {
  try {
    const sql =
      "SELECT inventory.* AS favorites FROM inventory LEFT OUTER JOIN favorite ON inventory.inv_id = favorite.inventory_id LEFT OUTER JOIN account ON favorite.account_id = account.account_id WHERE favorite.account_id = $1";
    return await pool.query(sql, [account_id]);
  } catch (error) {
    return error.message;
  }
}

// Set favorite for a specific account
async function setFavorite(account_id, inventory_id) {
  try {
    const sql =
      "INSERT INTO favorite (account_id, inventory_id) VALUES ($1, $2) RETURNING *";
    return await pool.query(sql, [account_id, inventory_id]);
  } catch (error) {
    return error.message;
  }
}

// Remove favorite for a specific account

async function removeFavorite(account_id, inventory_id) {
  try {
    const sql =
      "DELETE FROM favorite WHERE account_id = $1 AND inventory_id = $2";
    return await pool.query(sql, [account_id, inventory_id]);
  } catch (error) {
    return error.message;
  }
}

// Get favorite count for a specific inventory_id
async function getFavoriteCount(inventory_id) {
  try {
    const sql = "SELECT COUNT(*) FROM favorite WHERE inventory_id = $1";
    return await pool.query(sql, [inventory_id]);
  } catch (error) {
    return error.message;
  }
}

// Check if a favorite exists for a specific account_id and inventory_id
async function checkFavorite(account_id, inventory_id) {
  try {
    const sql =
      "SELECT * FROM favorite WHERE account_id = $1 AND inventory_id = $2";
    return await pool.query(sql, [account_id, inventory_id]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getFavorite,
  setFavorite,
  removeFavorite,
  getFavoriteCount,
  checkFavorite,
};
