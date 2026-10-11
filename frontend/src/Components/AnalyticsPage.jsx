import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartNoAxesCombined, PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import TransactionGraph from "./TransactionGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatMoney,
  getAuthHeaders,
  getDefaultTransactionYear,
  MONTHS,
  parseTxDate,
  sumByCategory,
} from "@/lib/finance";

const AnalyticsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    axios
      .get(`${import.meta.env.VITE_API_URL}/transactions`, { headers: getAuthHeaders(token) })
      .then(({ data }) => {
        setTransactions(data);
        setSelectedYear(getDefaultTransactionYear(data));
      })
      .catch((error) => console.error("Error fetching analytics", error))
      .finally(() => setLoading(false));
  }, []);

  const income = sumByCategory(transactions, "Income");
  const expenses = sumByCategory(transactions, "Expense");
  const split = [
    { name: "Income", value: income, color: "#00D084" },
    { name: "Expense", value: expenses, color: "#FF4545" },
  ].filter((item) => item.value > 0);

  const savingsTrend = useMemo(
    () =>
      MONTHS.map((month) => {
        const monthTx = transactions.filter((tx) => {
          const date = parseTxDate(tx.date);
          return date && date.getFullYear() === selectedYear && MONTHS[date.getMonth()] === month;
        });
        const monthIncome = sumByCategory(monthTx, "Income");
        const monthExpense = sumByCategory(monthTx, "Expense");
        return {
          label: month.substring(0, 3),
          Income: monthIncome,
          Expense: monthExpense,
          Savings: monthIncome - monthExpense,
        };
      }),
    [transactions, selectedYear]
  );

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[30px] font-bold tracking-tight md:text-[34px]">Visual Analytics</h1>
        <p className="mt-1 text-[15px] text-[#A7B1C5]">
          Track your financial growth and spending habits visually.
        </p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <EmptyState
            icon={ChartNoAxesCombined}
            title="No analytics yet"
            description="Add transactions to see income, expense, and savings trends."
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-[#00D084]">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm text-[#A7B1C5]">Total Income</span>
              </div>
              <p className="text-3xl font-bold text-[#00D084]">{formatMoney(income)}</p>
            </Card>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-[#FF4545]">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm text-[#A7B1C5]">Total Expenses</span>
              </div>
              <p className="text-3xl font-bold text-[#FF4545]">{formatMoney(expenses)}</p>
            </Card>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-[#16D9FF]">
                <PiggyBank className="h-4 w-4" />
                <span className="text-sm text-[#A7B1C5]">Net Savings</span>
              </div>
              <p className="text-3xl font-bold text-white">{formatMoney(income - expenses)}</p>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-8">
              <CardHeader>
                <CardTitle>Monthly trend</CardTitle>
                <CardDescription>Income vs expenses across the selected year.</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionGraph
                  transactions={transactions}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  view="monthly"
                  chartType="area"
                  height={340}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Share of your recorded totals.</CardDescription>
              </CardHeader>
              <CardContent>
                {split.length === 0 ? (
                  <p className="text-sm text-[#6F7B91]">No amounts to visualize.</p>
                ) : (
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={split} dataKey="value" innerRadius={68} outerRadius={96} paddingAngle={3}>
                          {split.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatMoney(value)}
                          contentStyle={{
                            backgroundColor: "rgba(207, 214, 223, 0.95)",
                            borderColor: "rgba(207, 186, 186, 0.91)",
                            borderRadius: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-12">
              <CardHeader>
                <CardTitle>Savings trend</CardTitle>
                <CardDescription>Monthly net (income minus expenses) for {selectedYear}.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                  {savingsTrend.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs text-[#6F7B91]">{item.label}</p>
                      <p className={`mt-1 text-sm font-semibold ${item.Savings >= 0 ? "text-[#00D084]" : "text-[#FF4545]"}`}>
                        {item.Savings >= 0 ? "+" : "-"}
                        {formatMoney(item.Savings)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
