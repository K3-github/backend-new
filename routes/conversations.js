const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new con
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json(savedConversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});
//get con of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    if (!conversation) {
      const newConversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      });
      try {
        const savedConversation = await newConversation.save();
        return res.status(200).json(savedConversation);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
