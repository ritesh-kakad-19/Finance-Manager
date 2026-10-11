import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import TransactionGraph from "./TransactionGraph";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  formatMoney,
  formatSignedMoney,
  formatShortDate,
  getDefaultTransactionYear,
  getAuthHeaders,
  inYearMonth,
  MONTHS,
  percentChange,
  sumByCategory,
} from "@/lib/finance";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
          headers: getAuthHeaders(token),
        });
        setTransactions(data);
        setSelectedYear(getDefaultTransactionYear(data));
      } catch (error) {
        console.error("Error fetching summary data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = MONTHS[previous.getMonth()];
  const previousYear = previous.getFullYear();

  const stats = useMemo(() => {
    const currentMonthTx = transactions.filter((tx) => inYearMonth(tx, now.getFullYear(), currentMonth));
    const previousMonthTx = transactions.filter((tx) => inYearMonth(tx, previousYear, previousMonth));

    const monthlyIncome = sumByCategory(currentMonthTx, "Income");
    const monthlyExpenses = sumByCategory(currentMonthTx, "Expense");
    const prevIncome = sumByCategory(previousMonthTx, "Income");
    const prevExpenses = sumByCategory(previousMonthTx, "Expense");
    const totalIncome = sumByCategory(transactions, "Income");
    const totalExpenses = sumByCategory(transactions, "Expense");
    const balance = totalIncome - totalExpenses;
    const prevBalance = prevIncome - prevExpenses;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : null;
    const prevSavingsRate = prevIncome > 0 ? ((prevIncome - prevExpenses) / prevIncome) * 100 : null;

    const expenseGroups = currentMonthTx
      .filter((tx) => tx.category === "Expense")
      .reduce((acc, tx) => {
        const key = tx.description?.trim() || "Untitled";
        acc[key] = (acc[key] || 0) + parseFloat(tx.amount || 0);
        return acc;
      }, {});

    const topSpending = Object.entries(expenseGroups)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const recent = [...transactions]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 6);

    return {
      balance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      balanceChange: percentChange(balance, prevBalance),
      incomeChange: percentChange(monthlyIncome, prevIncome),
      expenseChange: percentChange(monthlyExpenses, prevExpenses),
      savingsChange:
        savingsRate == null || prevSavingsRate == null ? null : savingsRate - prevSavingsRate,
      topSpending,
      recent,
      monthlyExpenseTotal: monthlyExpenses,
    };
  }, [transactions, currentMonth, previousMonth, previousYear, now]);

  const openAdd = () => navigate("/transactions", { state: { openAdd: true } });

  const ChangeHint = ({ value, suffix = "vs last month", invert = false }) => {
    if (value == null) {
      return <p className="mt-2 text-xs text-[#6F7B91]">No prior month to compare</p>;
    }
    const positive = invert ? value < 0 : value > 0;
    const Icon = value >= 0 ? ArrowUpRight : ArrowDownRight;
    return (
      <p className="mt-2 flex items-center gap-1 text-xs text-[#A7B1C5]">
        <Icon className={cn("h-3.5 w-3.5", positive ? "text-[#00D084]" : "text-[#FF4545]")} />
        <span className={cn("font-semibold", positive ? "text-[#00D084]" : "text-[#FF4545]")}>
          {value > 0 ? "+" : ""}
          {value.toFixed(1)}%
        </span>
        {suffix}
      </p>
    );
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-16 w-full" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight md:text-[34px]">Financial Overview</h1>
          <p className="mt-1 text-[15px] text-[#A7B1C5]">
            Welcome back! Here&apos;s a snapshot of your current financial health.
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Balance",
            value: formatMoney(stats.balance),
            icon: Wallet,
            tone: "text-[#16D9FF]",
            bg: "bg-[#1677FF]/10",
            change: <ChangeHint value={stats.balanceChange} />,
          },
          {
            label: "Monthly Income",
            value: formatSignedMoney(stats.monthlyIncome, "Income"),
            icon: TrendingUp,
            tone: "text-[#00D084]",
            bg: "bg-[#00D084]/10",
            change: <ChangeHint value={stats.incomeChange} />,
          },
          {
            label: "Monthly Expenses",
            value: formatSignedMoney(stats.monthlyExpenses, "Expense"),
            icon: TrendingDown,
            tone: "text-[#FF4545]",
            bg: "bg-[#FF4545]/10",
            change: <ChangeHint value={stats.expenseChange} invert />,
          },
          {
            label: "Savings Rate",
            value: stats.savingsRate == null ? "—" : `${stats.savingsRate.toFixed(1)}%`,
            icon: PiggyBank,
            tone: "text-[#c4b5ff]",
            bg: "bg-[#6C4DFF]/10",
            change:
              stats.savingsRate == null ? (
                <p className="mt-2 text-xs text-[#6F7B91]">Add income this month to calculate</p>
              ) : (
                <ChangeHint value={stats.savingsChange} suffix="pts vs last month" />
              ),
          },
        ].map((card) => (
          <Card key={card.label} hover className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-[#A7B1C5]">{card.label}</p>
              <div className={cn("rounded-xl p-2.5", card.bg, card.tone)}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className={cn("text-[30px] font-bold tracking-tight md:text-[32px]", card.tone)}>
              {card.value}
            </div>
            {card.change}
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Cash Flow Analytics</CardTitle>
                <CardDescription>Income and expenses from your actual transactions.</CardDescription>
              </div>
              <div className="flex rounded-xl border border-white/10 bg-[var(--bg-input)] p-1">
                {["weekly", "monthly"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setChartView(value)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                      chartView === value ? "bg-[#17243A] text-white" : "text-[#A7B1C5] hover:text-white"
                    )}
                  >
                    {value === "weekly" ? "Weekly" : "Monthly"}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <EmptyState
                  icon={TrendingUp}
                  title="No cash flow yet"
                  description="Add your first transaction to see income and expense trends."
                  actionLabel="+ Add Transaction"
                  onAction={openAdd}
                />
              ) : (
                <TransactionGraph
                  transactions={transactions}
                  view={chartView}
                  chartType="area"
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  height={320}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest activity from your account.</CardDescription>
              </div>
              <Button variant="ghost" className="text-[#16D9FF]" onClick={() => navigate("/transactions")}>
                View All →
              </Button>
            </CardHeader>
            <CardContent>
              {stats.recent.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  title="No transactions yet"
                  description="Start tracking your financial activity by adding your first transaction."
                  actionLabel="+ Add Transaction"
                  onAction={openAdd}
                />
              ) : (
                <div className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
                  {stats.recent.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between px-4 py-3.5">
                      <div>
                        <p className="font-medium text-white">{tx.description}</p>
                        <p className="text-xs text-[#6F7B91]">
                          {formatShortDate(tx.date)} · {tx.category}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          tx.category === "Income" ? "text-[#00D084]" : "text-[#FF4545]"
                        )}
                      >
                        {formatSignedMoney(tx.amount, tx.category)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Spending</CardTitle>
              <CardDescription>Largest expense descriptions this month.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.topSpending.length === 0 ? (
                <p className="text-sm text-[#6F7B91]">No expenses recorded this month.</p>
              ) : (
                stats.topSpending.map((item) => {
                  const pct =
                    stats.monthlyExpenseTotal > 0
                      ? (item.amount / stats.monthlyExpenseTotal) * 100
                      : 0;
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white">{item.name}</span>
                        <span className="text-[#A7B1C5]">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#1677FF] to-[#16D9FF]"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month Split</CardTitle>
              <CardDescription>Income vs expenses for {currentMonth}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Income", amount: stats.monthlyIncome, variant: "income" },
                { name: "Expense", amount: stats.monthlyExpenses, variant: "expense" },
              ].map((item) => {
                const total = stats.monthlyIncome + stats.monthlyExpenses;
                const pct = total > 0 ? (item.amount / total) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <Badge variant={item.variant}>{item.name}</Badge>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatMoney(item.amount)}</p>
                      <p className="text-xs text-[#6F7B91]">{pct.toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
