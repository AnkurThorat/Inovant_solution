const {
  registerUser,
  loginUser,
  getUserInfo: fetchUser,
  updateUserProfile,
} = require("../model/user_detail");

exports.addUser = (req, res, next) => {
  let data = req.body;
  registerUser(data, (result) => {
    return res.status(200).json(result);
  });
};

exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: false,

      msg: "Email and password are required",
    });
  }

  loginUser(email, password, (result) => {
    if (result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
  });
};
exports.getDonorInfo = (req, res) => {
  getDonorInfo(req.body, (response) => {
    if (response.status) {
      res.status(200).json(response.data);
    } else {
      console.error("Error fetching Donor Inforation:", response.msg);
      res.status(500).json({ error: response.msg });
    }
  });
};

exports.getUserInfo = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  fetchUser(email, (err, user) => {
    if (err) {
      console.error("DB error in getUserInfo:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });
};

exports.updateUserProfile = (req, res) => {
  const { email, first_name, last_name, phone_number } = req.body;
  if (!email || !first_name || !last_name || !phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  updateUserProfile(
    { email, first_name, last_name, phone_number },
    (err, result) => {
      if (err) {
        console.error("DB error in updateUserProfile:", err);
        return res.status(500).json({ error: "Failed to update profile" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ success: true, message: "Profile updated" });
    }
  );
};
