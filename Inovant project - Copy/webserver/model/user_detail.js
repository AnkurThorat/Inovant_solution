const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const secretKey = process.env.JWT_SECRET;

exports.registerUser = (data, callback) => {
  const saltRounds = 10;

  bcrypt.hash(data.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return callback({ status: false, msg: "Error encrypting password" });
    }

    data.password = hashedPassword;

    let createQuery = "INSERT INTO user_details SET ?";

    db.query(createQuery, data, function (err) {
      if (err) {
        return callback({ status: false, msg: err });
      }
      callback({ status: true, data: "user information added successfully" });
    });
  });
};
exports.loginUser = (email, password, callback) => {
  let query = "SELECT * FROM user_details WHERE email = ?";

  db.query(query, [email], function (err, results) {
    if (err) {
      return callback({ status: false, msg: "Database error" });
    }
    if (results.length === 0) {
      return callback({
        status: false,
        msg: "User not found",
        statusCode: 401,
      });
    }
    const user = results[0];
    if (password === user.password) {
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey, {
        expiresIn: "1h",
      });
      callback({
        status: true,
        email: email,
        msg: "Login successful",
        token: token,
      });
    } else {
      callback({ status: false, msg: "Invalid password", statusCode: 401 });
    }
  });
};

exports.getUserInfo = (email, callback) => {
  const sql = `SELECT id, first_name, last_name, email, phone_number
               FROM user_details
               WHERE email = ?`;
  db.query(sql, [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0] || null);
  });
};

exports.updateUserProfile = (user, callback) => {
  // if you also allow password changes, include `password = ?` here
  const sql = `UPDATE user_details
               SET first_name    = ?,
                   last_name     = ?,
                   phone_number  = ?
               WHERE email = ?`;
  const params = [
    user.first_name,
    user.last_name,
    user.phone_number,
    user.email,
  ];
  db.query(sql, params, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
