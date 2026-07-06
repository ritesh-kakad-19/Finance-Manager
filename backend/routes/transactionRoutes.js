const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getTransactions);
router.post("/", authMiddleware, addTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
router.put("/:id", authMiddleware, updateTransaction);

module.exports = router;
