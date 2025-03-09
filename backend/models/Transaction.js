const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate with user
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["Income", "Expense"], required: true },
  amount: { type: Number, required: true },
});

module.exports = mongoose.model("Transaction", transactionSchema);
