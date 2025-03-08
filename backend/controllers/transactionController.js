const Transaction = require("../models/Transaction");

// Add a new transaction
const addTransaction = async (req, res) => {
  try {
    const { name, amount, type } = req.body;
    const newTransaction = new Transaction({
      userId: req.user.id,
      name,
      amount,
      type,
    });
    await newTransaction.save();
    res.json(newTransaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id });
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Delete a single transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not found" });
    }

    // Check if the transaction belongs to the user
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Transaction.deleteOne({ _id: req.params.id }); // Use deleteOne
    res.json({ msg: "Transaction removed" });
  } catch (error) {
    console.error("Error in deleteTransaction:", error.message);
    res.status(500).send("Server Error");
  }
};

// Delete multiple transactions
const deleteMultipleTransactions = async (req, res) => {
  const { transactionIds } = req.body;

  try {
    // Check if all transactions belong to the user
    const transactions = await Transaction.find({ _id: { $in: transactionIds } });
    const unauthorizedTransactions = transactions.filter(
      (t) => t.userId.toString() !== req.user.id
    );

    if (unauthorizedTransactions.length > 0) {
      return res.status(401).json({ msg: "Not authorized to delete some transactions" });
    }

    await Transaction.deleteMany({ _id: { $in: transactionIds } });
    res.json({ msg: "Transactions removed" });
  } catch (error) {
    console.error("Error in deleteMultipleTransactions:", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addTransaction,
  getTransactions,
  deleteTransaction,
  deleteMultipleTransactions,
};