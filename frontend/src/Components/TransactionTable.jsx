import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Trash2,
  Pencil,
  Check,
  X,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  DollarSign,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;

const TransactionTable = ({ hideAddForm = false, onTransactionChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    description: "",
    category: "Income",
    amount: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    date: "",
    description: "",
    category: "Income",
    amount: "",
  });

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString("default", { month: "long" }));
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const addTransaction = async () => {
    if (!newTransaction.date || !newTransaction.description || !newTransaction.amount) return;

    try {
      const { data } = await axios.post(API_URL, newTransaction, {
        headers: { Authorization: token },
      });
      setTransactions([...transactions, data]);
      setNewTransaction({ date: "", description: "", category: "Income", amount: "" });
      if (onTransactionChange) onTransactionChange();
    } catch (error) {
      console.error("Error adding transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: token },
      });
      setTransactions(transactions.filter((tx) => tx._id !== id));
      if (onTransactionChange) onTransactionChange();
    } catch (error) {
      console.error("Error deleting transaction", error);
    }
  };

  const handleEditClick = (tx) => {
    setEditingId(tx._id);
    setEditFormData({
      date: tx.date || "",
      description: tx.description || "",
      category: tx.category || "Income",
      amount: tx.amount || "",
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    if (!editFormData.date || !editFormData.description || !editFormData.amount) return;

    try {
      const { data } = await axios.put(`${API_URL}/${id}`, editFormData, {
        headers: { Authorization: token },
      });
      setTransactions(transactions.map((tx) => (tx._id === id ? data : tx)));
      setEditingId(null);
      if (onTransactionChange) onTransactionChange();
    } catch (error) {
      console.error("Error updating transaction", error);
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

  const filteredTransactions = transactions.filter((tx) => {
    if (!tx.date) return false;
    const parts = tx.date.split("-");
    const year = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // 0-based
    const monthName = months[monthIndex];

    const matchesPeriod = year === selectedYear && monthName === selectedMonth;
    const matchesSearch = !searchTerm ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPeriod && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters & Quick Add */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 flex-wrap gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 !pl-10 bg-background"
            />
          </div>

          <div className="w-[140px]">
            <Select
              value={selectedYear.toString()}
              onValueChange={(val) => setSelectedYear(Number(val))}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {getYears().map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select
              value={selectedMonth}
              onValueChange={(val) => setSelectedMonth(val)}
            >
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>{month}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!hideAddForm && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-muted/30 p-2 border border-dashed border-muted-foreground/20">
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                onClick={(e) => e.target.showPicker?.()}
                className="h-9 w-[180px] !pl-10 bg-background focus-visible:ring-1 cursor-pointer"
              />
            </div>
            <Input
              name="description"
              placeholder="Description..."
              value={newTransaction.description}
              onChange={handleInputChange}
              className="h-9 w-[200px] bg-background focus-visible:ring-1"
            />
            <div className="w-[120px]">
              <Select
                value={newTransaction.category}
                onValueChange={(val) => setNewTransaction({ ...newTransaction, category: val })}
              >
                <SelectTrigger className="h-9 bg-background focus-visible:ring-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                className="h-9 w-[100px] !pl-10 bg-background focus-visible:ring-1"
              />
            </div>
            <Button
              size="sm"
              onClick={addTransaction}
              className="h-9 px-4 shadow-md shadow-primary/10"
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px] text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ArrowDownCircle className="h-8 w-8 text-muted/30" />
                    <p>No transactions found for this period.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx._id} className="group transition-colors hover:bg-muted/30">
                  {editingId === tx._id ? (
                    <>
                      <TableCell className="p-2">
                        <Input
                          type="date"
                          name="date"
                          value={editFormData.date}
                          onChange={handleEditInputChange}
                          onClick={(e) => e.target.showPicker?.()}
                          className="h-9 w-full bg-background focus-visible:ring-1 cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          className="h-9 w-full bg-background focus-visible:ring-1"
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={editFormData.category}
                          onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
                        >
                          <SelectTrigger className="h-9 bg-background focus-visible:ring-1">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                          <Input
                            type="number"
                            name="amount"
                            value={editFormData.amount}
                            onChange={handleEditInputChange}
                            className="h-9 w-full !pl-8 bg-background focus-visible:ring-1"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center p-2">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveEdit(tx._id)}
                            className="h-8 w-8 rounded-full text-green-600 hover:bg-green-500/10"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelEdit}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">
                        {(() => {
                          if (!tx.date) return "";
                          const [year, month, day] = tx.date.split("-").map(Number);
                          const localDate = new Date(year, month - 1, day);
                          return localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        })()}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{tx.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {tx.category === "Income" ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className={cn(
                            "text-xs font-semibold",
                            tx.category === "Income" ? "text-green-600 dark:text-green-500" : "text-destructive"
                          )}>
                            {tx.category}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-bold tracking-tight",
                        tx.category === "Income" ? "text-green-600 dark:text-green-500" : "text-destructive"
                      )}>
                        {tx.category === "Expense" ? "-" : "+"}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(tx)}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTransaction(tx._id)}
                            className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
