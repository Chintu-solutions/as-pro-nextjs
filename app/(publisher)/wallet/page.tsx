"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PayoutModal } from "@/components/publisher/modals/payout-modal";
import { DollarSign, CreditCard, ArrowUpRight, Clock } from "lucide-react";

export default function WalletPage() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const transactions = [
    {
      id: 1,
      type: "Payout",
      amount: 1250.0,
      status: "completed",
      date: "2024-03-25",
    },
    {
      id: 2,
      type: "Earnings",
      amount: 345.67,
      status: "completed",
      date: "2024-03-24",
    },
    {
      id: 3,
      type: "Payout",
      status: "pending",
      amount: 890.0,
      date: "2024-03-23",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Wallet</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,456.78</div>
            <Button
              className="w-full mt-4"
              onClick={() => setShowPayoutModal(true)}
            >
              Request Payout
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Balance
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$890.00</div>
            <p className="text-xs text-muted-foreground mt-2">
              Available in 2 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$890.00</div>
            <p className="text-xs text-muted-foreground mt-2">Processing</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.type === "Payout" ? "-" : "+"}$
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      transaction.status === "completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <PayoutModal
        open={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSubmit={(data) => {
          console.log("Payout requested:", data);
          setShowPayoutModal(false);
        }}
        availableBalance={3456.78}
      />
    </div>
  );
}
