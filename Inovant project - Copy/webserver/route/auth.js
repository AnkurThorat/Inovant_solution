const express = require("express");
const router = express.Router();
const {
  addUser,
  loginUser,
  getUserInfo,
  updateUserProfile,
} = require("../controller/user_detail");

router.post("/getInformation/createUser", addUser);
router.post("/getInformation/loginUser", loginUser);
router.post("/getInformation/getUserInfo", getUserInfo);

router.put("/getInformation/updateUserProfile", updateUserProfile);

module.exports = router;
