"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PaymentManagementModalProps {
  open: boolean;
  onClose: () => void;
  payment: {
    id: string;
    publisher: string;
    amount: number;
    status: string;
    method: string;
    date: string;
  };
  onSubmit: (data: any) => void;
}

export function PaymentManagementModal({
  open,
  onClose,
  payment,
  onSubmit,
}: PaymentManagementModalProps) {
  const [action, setAction] = useState<"process" | "deduct" | "">("");
  const [formData, setFormData] = useState({
    transactionId: "",
    amount: payment.amount,
    deductionAmount: 0,
    reason: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, action });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Payment - {payment.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Publisher</Label>
              <p className="text-sm font-medium">{payment.publisher}</p>
            </div>
            <div>
              <Label>Original Amount</Label>
              <p className="text-sm font-medium">${payment.amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Action</Label>
            <Select
              value={action}
              onValueChange={(value: "process" | "deduct" | "") => setAction(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="process">Process Payment</SelectItem>
                <SelectItem value="deduct">Deduct Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {action === "process" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) =>
                    setFormData({ ...formData, transactionId: e.target.value })
                  }
                  placeholder="Enter transaction ID"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Payment Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any notes about the payment"
                />
              </div>
            </>
          )}

          {action === "deduct" && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Specify the amount to deduct and provide a reason
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="deductionAmount">Deduction Amount</Label>
                <Input
                  id="deductionAmount"
                  type="number"
                  value={formData.deductionAmount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deductionAmount: parseFloat(e.target.value),
                    })
                  }
                  min={0}
                  max={payment.amount}
                  step={0.01}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Deduction</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Explain why the amount is being deducted"
                  required
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Original Amount:</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-destructive">
                  <span>Deduction:</span>
                  <span>-${formData.deductionAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold border-t pt-2">
                  <span>Final Amount:</span>
                  <span>
                    ${(payment.amount - formData.deductionAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!action || (action === "deduct" && !formData.reason)}
            variant={action === "deduct" ? "destructive" : "default"}
          >
            {action === "process"
              ? "Process Payment"
              : action === "deduct"
              ? "Confirm Deduction"
              : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}