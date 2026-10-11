import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import TransactionTable from "./TransactionTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TransactionsPage = () => {
  const location = useLocation();
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (location.state?.openAdd) setAddOpen(true);
  }, [location.state]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[30px] font-bold tracking-tight md:text-[34px]">All Transactions</h1>
          <p className="mt-1 text-[15px] text-[#A7B1C5]">
            Manage and track every dollar you spend or earn.
          </p>
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      <Card className="p-4 md:p-6">
        <TransactionTable hideAddForm addOpen={addOpen} setAddOpen={setAddOpen} />
      </Card>
    </div>
  );
};

export default TransactionsPage;
