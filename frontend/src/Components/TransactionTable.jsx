import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Check,
  IndianRupee,
  Pencil,
  Plus,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
  formatSignedMoney,
  formatShortDate,
  getAuthHeaders,
  MONTHS,
  parseTxDate,
} from "@/lib/finance";

const API_URL = `${import.meta.env.VITE_API_URL}/transactions`;
const emptyForm = { date: "", description: "", category: "Expense", amount: "" };

const FormFields = ({ value, onChange }) => (
  <div className="grid gap-4">
    <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[var(--bg-input)] p-1">
      {["Income", "Expense"].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange({ ...value, category: type })}
          className={cn(
            "rounded-lg py-2 text-sm font-medium transition-colors",
            value.category === type
              ? type === "Income"
                ? "bg-[#00D084]/15 text-[#00D084]"
                : "bg-[#FF4545]/15 text-[#FF4545]"
              : "text-[#A7B1C5] hover:text-white"
          )}
        >
          {type}
        </button>
      ))}
    </div>

    <Input
      type="number"
      placeholder="Amount"
      value={value.amount}
      onChange={(e) =>
        onChange({ ...value, amount: e.target.value })
      }
    />

    <Input
      placeholder="Description"
      value={value.description}
      onChange={(e) =>
        onChange({ ...value, description: e.target.value })
      }
    />

    <Input
      type="date"
      value={value.date}
      onChange={(e) =>
        onChange({ ...value, date: e.target.value })
      }
      onClick={(e) => e.target.showPicker?.()}
    />
  </div>
);

const TransactionTable = ({
  hideAddForm = false,
  onTransactionChange,
  addOpen = false,
  setAddOpen,
  compact = false,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(emptyForm);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();
  const token = localStorage.getItem("userToken");

  const modalOpen = setAddOpen ? addOpen : internalAddOpen;
  const closeModal = () => {
    setForm({ ...emptyForm });

    if (setAddOpen) {
      setAddOpen(false);
    } else {
      setInternalAddOpen(false);
    }
  };
  const openModal = () => (setAddOpen ? setAddOpen(true) : setInternalAddOpen(true));

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(API_URL, { headers: getAuthHeaders(token) });
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async () => {
    if (!form.date || !form.description || !form.amount) return;
    try {
      const { data } = await axios.post(API_URL, form, { headers: getAuthHeaders(token) });
      setTransactions((prev) => [...prev, data]);
      setForm(emptyForm);
      closeModal();
      toast("Transaction added successfully");
      onTransactionChange?.();
    } catch (error) {
      console.error("Error adding transaction", error);
      toast("Failed to add transaction", "error");
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders(token) });
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      toast("Transaction deleted");
      onTransactionChange?.();
    } catch (error) {
      console.error("Error deleting transaction", error);
      toast("Failed to delete transaction", "error");
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

  const saveEdit = async (id) => {
    if (!editFormData.date || !editFormData.description || !editFormData.amount) return;
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, editFormData, {
        headers: getAuthHeaders(token),
      });
      setTransactions((prev) => prev.map((tx) => (tx._id === id ? data : tx)));
      setEditingId(null);
      toast("Transaction updated");
      onTransactionChange?.();
    } catch (error) {
      console.error("Error updating transaction", error);
      toast("Failed to update transaction", "error");
    }
  };

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

  const filteredTransactions = transactions.filter((tx) => {
    const date = parseTxDate(tx.date);
    if (!date) return false;
    const matchesPeriod = date.getFullYear() === selectedYear && MONTHS[date.getMonth()] === selectedMonth;
    const matchesSearch =
      !searchTerm ||
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tx.category === typeFilter;
    return matchesPeriod && matchesSearch && matchesType;
  });



  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-[#6F7B91]" />
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="!pl-9"
            />
          </div>
          <Select value={selectedYear.toString()} onValueChange={(val) => setSelectedYear(Number(val))}>
            <SelectTrigger className="w-[120px]">
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
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hideAddForm ? (
          <Button variant="primary" onClick={openModal}>
            <Plus className="h-4 w-4" />
            Add Transaction
          </Button>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border-primary)]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              {!compact ? <TableHead className="text-center">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={compact ? 5 : 6} className="h-40">
                  <EmptyState
                    icon={TrendingDown}
                    title="No transactions yet"
                    description="Start tracking your financial activity by adding your first transaction."
                    actionLabel={hideAddForm ? undefined : "+ Add Transaction"}
                    onAction={hideAddForm ? undefined : openModal}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => (
                <TableRow key={tx._id}>
                  {editingId === tx._id ? (
                    <>
                      <TableCell className="p-2">
                        <Input
                          type="date"
                          value={editFormData.date}
                          onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          value={editFormData.description}
                          onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                        />
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge variant="category">{editFormData.category}</Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <Select
                          value={editFormData.category}
                          onValueChange={(val) => setEditFormData({ ...editFormData, category: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Income">Income</SelectItem>
                            <SelectItem value="Expense">Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="p-2">
                        <Input
                          type="number"
                          value={editFormData.amount}
                          onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => saveEdit(tx._id)} aria-label="Save">
                            <Check className="h-4 w-4 text-[#00D084]" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingId(null)} aria-label="Cancel">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="text-[#A7B1C5]">{formatShortDate(tx.date)}</TableCell>
                      <TableCell className="font-medium">{tx.description}</TableCell>
                      <TableCell>
                        <Badge variant="category">{tx.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.category === "Income" ? "income" : "expense"}>
                          {tx.category === "Income" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {tx.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-bold",
                          tx.category === "Income" ? "text-[#00D084]" : "text-[#FF4545]"
                        )}
                      >
                        {formatSignedMoney(tx.amount, tx.category)}
                      </TableCell>
                      {!compact ? (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(tx)}
                              aria-label="Edit transaction"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTransaction(tx._id)}
                              aria-label="Delete transaction"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      ) : null}
                    </>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Add Transaction"
        description="Record income or an expense. This uses your existing transaction API."
      >
        <FormFields value={form} onChange={setForm} />
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addTransaction}>
            <IndianRupee className="h-4 w-4" />
            Save Transaction
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionTable;
