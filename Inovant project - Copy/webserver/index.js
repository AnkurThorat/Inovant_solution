const express = require("express");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", require("./route/auth"));
app.listen(3000, () => {
  console.log("Express server running on port 3000...");
});
