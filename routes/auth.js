const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt"); //asynn function
//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      profilePicture: req.body.profilePicture,
    });
    const user = await newUser.save();
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json("user not found");
      return;
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(400).json("wrong password");
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
