import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

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

  const getYears = () => {
    const years = [...new Set(transactions.map((tx) => {
      if (!tx.date) return new Date().getFullYear();
      const year = parseInt(tx.date.split("-")[0], 10);
      return isNaN(year) ? new Date().getFullYear() : year;
    }))];
    if (!years.includes(new Date().getFullYear())) years.push(new Date().getFullYear());
    return years.sort((a, b) => b - a);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const transactionData = months.map((month) => {
    const monthTransactions = transactions.filter((tx) => {
      if (!tx.date) return false;
      const parts = tx.date.split("-");
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1; // 0-based
      const monthName = months[monthIndex];
      return year === selectedYear && monthName === month;
    });

    const totalIncome = monthTransactions
      .filter((tx) => tx.category === "Income")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpense = monthTransactions
      .filter((tx) => tx.category === "Expense")
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    return {
      month: month.substring(0, 3), // Short month names
      Income: totalIncome,
      Expense: totalExpense,
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="w-[120px]">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="h-8 bg-background">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {getYears().map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transactionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
            <Bar 
              dataKey="Income" 
              fill="hsl(var(--primary))" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="Expense" 
              fill="hsl(var(--destructive))" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionGraph;
