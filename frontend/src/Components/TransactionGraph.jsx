import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAuthHeaders, MONTHS, parseTxDate } from "@/lib/finance";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

const chartTooltipStyle = {
  backgroundColor: "rgba(10, 20, 38, 0.95)",
  borderColor: "rgba(255, 255, 255, 0.10)",
  borderRadius: "12px",
  color: "#FFFFFF",
  fontSize: "12px",
};

const toChartAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const TransactionGraph = ({
  transactions: externalTransactions,
  selectedYear: controlledYear,
  onYearChange,
  view = "monthly",
  chartType = "area",
  height = 300,
  showYearSelect = true,
}) => {
  const [internalTransactions, setInternalTransactions] = useState([]);
  const [internalYear, setInternalYear] = useState(new Date().getFullYear());
  const transactions = Array.isArray(externalTransactions)
    ? externalTransactions
    : Array.isArray(internalTransactions)
      ? internalTransactions
      : [];
  const selectedYear = controlledYear ?? internalYear;

  useEffect(() => {
    if (externalTransactions) return undefined;
    const token = localStorage.getItem("userToken");
    axios
      .get(API_URL, { headers: getAuthHeaders(token) })
      .then(({ data }) => setInternalTransactions(data))
      .catch((error) => console.error("Error fetching transactions", error));
  }, [externalTransactions]);

  const years = useMemo(() => {
    const values = [
      ...new Set(
        transactions.map((tx) => {
          const date = parseTxDate(tx.date);
          return date ? date.getFullYear() : new Date().getFullYear();
        })
      ),
    ];
    if (!values.includes(new Date().getFullYear())) values.push(new Date().getFullYear());
    return values.sort((a, b) => b - a);
  }, [transactions]);

  const chartData = useMemo(() => {
    if (view === "weekly") {
      const today = new Date();
      return Array.from({ length: 7 }, (_, index) => {
        const day = new Date(today);
        day.setDate(today.getDate() - (6 - index));
        const dayTransactions = transactions.filter((tx) => {
          const date = parseTxDate(tx.date);
          if (!date) return false;
          return (
            date.getFullYear() === day.getFullYear() &&
            date.getMonth() === day.getMonth() &&
            date.getDate() === day.getDate()
          );
        });
        return {
          label: day.toLocaleDateString(undefined, { weekday: "short" }),
          Income: dayTransactions
            .filter((tx) => tx.category === "Income")
            .reduce((sum, tx) => sum + toChartAmount(tx.amount), 0),
          Expense: dayTransactions
            .filter((tx) => tx.category === "Expense")
            .reduce((sum, tx) => sum + toChartAmount(tx.amount), 0),
        };
      });
    }

    return MONTHS.map((month) => {
      const monthTransactions = transactions.filter((tx) => {
        const date = parseTxDate(tx.date);
        if (!date) return false;
        return date.getFullYear() === selectedYear && MONTHS[date.getMonth()] === month;
      });
      return {
        label: month.substring(0, 3),
        Income: monthTransactions
          .filter((tx) => tx.category === "Income")
          .reduce((sum, tx) => sum + toChartAmount(tx.amount), 0),
        Expense: monthTransactions
          .filter((tx) => tx.category === "Expense")
          .reduce((sum, tx) => sum + toChartAmount(tx.amount), 0),
      };
    });
  }, [transactions, selectedYear, view]);

  const hasChartData = chartData.some((item) => item.Income > 0 || item.Expense > 0);

  const setYear = (year) => {
    if (onYearChange) onYearChange(year);
    else setInternalYear(year);
  };

  const ChartComponent = chartType === "bar" ? BarChart : AreaChart;

  return (
    <div className="space-y-4">
      {showYearSelect && view === "monthly" ? (
        <div className="flex justify-end">
          <div className="w-[130px]">
            <Select value={selectedYear.toString()} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}

      <div className="w-full" style={{ minHeight: height }}>
        {hasChartData ? (
          <ResponsiveContainer width="100%" height={height} minWidth={0}>
            <ChartComponent data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16D9FF" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#16D9FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4545" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#FF4545" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#A7B1C5", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#A7B1C5", fontSize: 12 }} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} contentStyle={chartTooltipStyle} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "16px", fontSize: "12px", color: "#A7B1C5" }}
              />
              {chartType === "bar" ? (
                <>
                  <Bar dataKey="Income" fill="#16D9FF" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar dataKey="Expense" fill="#FF4545" radius={[4, 4, 0, 0]} barSize={16} />
                </>
              ) : (
                <>
                  <Area type="monotone" dataKey="Income" stroke="#16D9FF" fill="url(#incomeFill)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Expense" stroke="#FF4545" fill="url(#expenseFill)" strokeWidth={2} />
                </>
              )}
            </ChartComponent>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center text-sm text-[#6F7B91]">
            No income or expenses were recorded for {view === "weekly" ? "the past seven days" : selectedYear}.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionGraph;
