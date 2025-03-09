const Transaction = require("../models/Transaction");

// Get transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new transaction for the logged-in user
exports.addTransaction = async (req, res) => {
  try {
    const { date, description, category, amount } = req.body;
    const transaction = new Transaction({
      userId: req.user.id, // Associate with the logged-in user
      date,
      description,
      category,
      amount,
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete transaction (only if it belongs to the user)
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
    if (!transaction) return res.status(404).json({ message: "Transaction not found" });

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
