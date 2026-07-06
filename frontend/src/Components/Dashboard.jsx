import React, { useState, useEffect } from "react";
import TransactionTable from "./TransactionTable";
import TransactionGraph from "./TransactionGraph";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Download
} from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: { Authorization: token },
      });

      const income = data
        .filter((tx) => tx.category === "Income")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      const expenses = data
        .filter((tx) => tx.category === "Expense")
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

      setSummary({
        balance: income - expenses,
        income,
        expenses,
      });
    } catch (error) {
      console.error("Error fetching summary data", error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's a snapshot of your current financial health.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            size="sm"
            className="h-9 bg-primary shadow-lg shadow-primary/20"
            onClick={() => navigate("/transactions")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-80">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="mt-1 text-xs opacity-70">
              <span className="font-bold">+2.5%</span> from last month
            </p>
          </CardContent>
          {/* Subtle background pattern */}
          <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        </Card>

        <Card className="border-none bg-card shadow-md transition-all hover:shadow-xl dark:border dark:border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Income</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2 text-green-500 dark:bg-green-500/20">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-500">
              +${summary.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
              <span className="font-medium text-green-500">+12%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-card shadow-md transition-all hover:shadow-xl dark:border dark:border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
            <div className="rounded-full bg-destructive/10 p-2 text-destructive dark:bg-destructive/20">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              -${summary.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
              <span className="font-medium text-destructive">-4%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main Section: Chart & Activity */}
        <div className="space-y-6 lg:col-span-8">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cash Flow Analytics</CardTitle>
                <CardDescription>Visualize your income and expenditure patterns.</CardDescription>
              </div>
              <Tabs defaultValue="week" className="w-[200px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="week">Weekly</TabsTrigger>
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4">
                <TransactionGraph />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A detailed list of your latest transactions.</CardDescription>
              </div>
              <Button variant="link" className="text-primary hover:no-underline">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border bg-muted/20">
                <TransactionTable hideAddForm={true} onTransactionChange={fetchSummary} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section: Categorization or Goals */}
        <div className="space-y-6 lg:col-span-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
              <CardDescription>Spending breakdown by category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Food & Dining", amount: summary.expenses * 0.4, color: "bg-orange-500" },
                { name: "Transport", amount: summary.expenses * 0.2, color: "bg-blue-500" },
                { name: "Entertainment", amount: summary.expenses * 0.3, color: "bg-purple-500" },
                { name: "Others", amount: summary.expenses * 0.1, color: "bg-gray-500" },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">${cat.amount.toFixed(0)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color}`}
                      style={{ width: summary.expenses > 0 ? `${(cat.amount / summary.expenses) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white">Savings Goal</CardTitle>
              <CardDescription className="text-indigo-100">Vacation to Bali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">$1,250.00 / $3,000.00</div>
              <div className="h-3 w-full rounded-full bg-white/20">
                <div className="h-full w-[42%] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
              <p className="text-sm text-indigo-100 opacity-80">
                You're on track! Only $1,750 more to go.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
