const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { route } = require("./auth");
const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
// get all user
router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//get user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    return res.status(200).json(other);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    return res.status(200).json(friendList);
  } catch (error) {
    return res.status(500).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("user has been followed");
      } else {
        return res.status(403).json("You already follow this user");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can not follow yourself");
  }
});
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("user has been unfollowed");
      } else {
        return res.status(403).json("You don't follow this user");
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can not unfollow yourself");
  }
});
router.post("/upload", async (req, res) => {
  try {
    const file = req.files.file;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    return res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    console.error(error);
  }
});
router.post("/uploadProfile", async (req, res) => {
  try {
    const file = req.files.file;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    return res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    console.error(error);
  }
});
router.post("/uploadCover", async (req, res) => {
  try {
    const file2 = req.files.file2;
    const result = await cloudinary.uploader.upload(file2.tempFilePath);
    return res.status(200).json({ secure_url: result.secure_url });
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
