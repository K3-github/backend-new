const router = require("express").Router();
const Messege = require("../models/Messege");

//add
router.post("/", async (req, res) => {
  const newMessege = new Messege(req.body);
  try {
    const savedMessege = await newMessege.save();
    return res.status(200).json(savedMessege);
  } catch (error) {
    res.status(500).json(error);
  }
});
//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messeges = await Messege.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json(messeges);
  } catch (error) {
    return res.status(500).json(error);
  }
});
module.exports = router;
