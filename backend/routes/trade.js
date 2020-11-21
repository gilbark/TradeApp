const express = require("express");
const TradeController = require("../controllers/trade");

const router = express.Router();

router.post("/new", TradeController.newOffer);
router.patch("/accept/:id", TradeController.acceptOffer);

module.exports = router;
