import React, { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Form } from "react-bootstrap";

const API_URL = "https://finance-manager-91sp.onrender.com/api/transactions";

const TransactionGraph = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: { Authorization: token },
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };

  // Get unique years from transactions
  const getYears = () => {
    const years = [...new Set(transactions.map((tx) => new Date(tx.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  // Group transactions by month
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const transactionData = months.map((month) => {
    const monthTransactions = transactions.filter((tx) => {
      const dateObj = new Date(tx.date);
      return dateObj.getFullYear() === selectedYear && dateObj.toLocaleString("default", { month: "long" }) === month;
    });

    const totalIncome = monthTransactions
      .filter((tx) => tx.category === "Income")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = monthTransactions
      .filter((tx) => tx.category === "Expense")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    return {
      month,
      Income: totalIncome,
      Expense: totalExpense,
    };
  });

  return (
    <div className="mb-4">
      {/* Year Selection Dropdown */}
      <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="mb-3 w-25">
        {getYears().map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Form.Select>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={transactionData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#28a745" />
          <Bar dataKey="Expense" fill="#dc3545" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionGraph;
