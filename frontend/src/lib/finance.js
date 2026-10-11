export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseTxDate(dateStr) {
  if (!dateStr) return null;
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const date = new Date(year, month - 1, day);

  // Constructing a Date will otherwise silently roll invalid values (for
  // example, 2026-02-31) into the following month.
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

export function getDefaultTransactionYear(transactions, currentYear = new Date().getFullYear()) {
  const years = transactions
    .map((tx) => parseTxDate(tx.date)?.getFullYear())
    .filter((year) => year != null);

  if (years.includes(currentYear)) return currentYear;
  return years.length > 0 ? Math.max(...years) : currentYear;
}

export function formatMoney(amount) {
  const value = Math.abs(Number(amount) || 0);
  return `₹${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatSignedMoney(amount, category) {
  const isExpense = category === "Expense";
  return `${isExpense ? "-" : "+"}${formatMoney(amount)}`;
}

export function formatShortDate(dateStr) {
  const date = parseTxDate(dateStr);
  if (!date) return "";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function getAuthHeaders(token) {
  if (!token) return {};
  const value = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  return { Authorization: value };
}

export function percentChange(current, previous) {
  if (previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function isIncome(tx) {
  return tx?.category === "Income";
}

export function sumByCategory(transactions, category) {
  return transactions
    .filter((tx) => tx.category === category)
    .reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);
}

export function inYearMonth(tx, year, monthName) {
  const date = parseTxDate(tx.date);
  if (!date) return false;
  return date.getFullYear() === year && MONTHS[date.getMonth()] === monthName;
}

export function exportTransactionsCsv(transactions) {
  const header = ["Date", "Description", "Type", "Amount"];
  const rows = transactions.map((tx) => [
    tx.date || "",
    `"${String(tx.description || "").replace(/"/g, '""')}"`,
    tx.category || "",
    tx.amount ?? "",
  ]);
  const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `financely-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
