import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionName, setTransactionName] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("income");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransactions, setSelectedTransactions] = useState([]); // For multi-delete
  const navigate = useNavigate();

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/transactions", {
          headers: {
            "x-auth-token": token,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError("Failed to fetch transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Add a new transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (parseFloat(transactionAmount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/transactions",
        {
          name: transactionName,
          amount: parseFloat(transactionAmount),
          type: transactionType,
        },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setTransactions([...transactions, response.data]);
      setTransactionName("");
      setTransactionAmount("");
      setError(null);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    }
  };

  // Delete a single transaction
  const handleDeleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: {
          "x-auth-token": token,
        },
      });

      // Remove the transaction from the local state
      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction._id !== id)
      );
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again.");
    }
  };

  // Handle selection of transactions for multi-delete
  const handleSelectTransaction = (id) => {
    if (selectedTransactions.includes(id)) {
      setSelectedTransactions(selectedTransactions.filter((t) => t !== id));
    } else {
      setSelectedTransactions([...selectedTransactions, id]);
    }
  };

  // Delete multiple transactions
  const handleDeleteMultipleTransactions = async () => {
    if (selectedTransactions.length === 0) {
      setError("No transactions selected.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/transactions/delete-multiple", {
        headers: {
          "x-auth-token": token,
        },
        data: { transactionIds: selectedTransactions },
      });

      // Remove the deleted transactions from the local state
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => !selectedTransactions.includes(t._id))
      );
      setSelectedTransactions([]); // Clear selection
    } catch (error) {
      console.error("Error deleting transactions:", error);
      setError("Failed to delete transactions. Please try again.");
    }
  };

  return (
    <div className="dashboard-page">
      <Header />
      <main className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h2>Dashboard</h2>
        </div>

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Income</h3>
            <p>₹{transactions
              .filter((t) => t.type === "income")
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p>₹{transactions
              .filter((t) => t.type === "expense")
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}</p>
          </div>
          <div className="summary-card">
            <h3>Balance</h3>
            <p>₹{(
              transactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0) -
              transactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
            ).toFixed(2)}</p>
          </div>
        </div>

        {/* Add Transaction Section */}
        <div className="add-transaction-section">
          <h3>Add New Transaction</h3>
          <form onSubmit={handleAddTransaction} className="transaction-form">
            <div className="form-group">
              <label>Transaction Name:</label>
              <input
                type="text"
                value={transactionName}
                onChange={(e) => setTransactionName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button type="submit" className="add-button">
              Add Transaction
            </button>
          </form>
        </div>

        {/* Transactions List */}
        <div className="transactions-list">
          <h3>Transactions</h3>
          {loading ? (
            <p>Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p>No transactions added yet.</p>
          ) : (
            <>
              <button
                onClick={handleDeleteMultipleTransactions}
                className="delete-button"
                disabled={selectedTransactions.length === 0}
              >
                Delete Selected
              </button>
              <ul>
                {transactions.map((transaction) => (
                  <li key={transaction._id}>
                    <input
                      type="checkbox"
                      checked={selectedTransactions.includes(transaction._id)}
                      onChange={() => handleSelectTransaction(transaction._id)}
                    />
                    <span>{transaction.name}</span>
                    <span className={transaction.type === "income" ? "income-amount" : "expense-amount"}>
                      {transaction.type === "income" ? "+" : "-"}₹
                      {transaction.amount.toFixed(2)}
                    </span>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteTransaction(transaction._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;