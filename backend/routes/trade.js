const express = require("express");
const TradeController = require("../controllers/trade");

const router = express.Router();

router.post("/new", TradeController.newOffer);
router.delete("/cancel", TradeController.cancelOffer);
router.get("/:id", TradeController.getMyOffers);
router.put("/:id", TradeController.acceptOffer);

module.exports = router;
