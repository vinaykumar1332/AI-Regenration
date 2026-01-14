import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table/table";
import { Progress } from "@/app/components/ui/Progress/progress";
import { Check, Download, CreditCard } from "lucide-react";
import { toast } from "sonner";
import mockData from "./mockData.json";

const { plans, invoices } = mockData;

export function BillingPage() {
  const currentUsage = 9260;
  const planLimit = 15000;
  const usagePercentage = (currentUsage / planLimit) * 100;

  const handleDownloadInvoice = (invoiceId) => {
    toast.success(`Downloading ${invoiceId}`);
  };

  const handleUpgrade = (planName) => {
    toast.info(`Upgrade to ${planName} plan`);
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Billing & Plans</h1>
        <p className="text-muted-foreground">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-1">Current Plan: Professional</h3>
            <p className="text-muted-foreground">Next billing date: February 1, 2026</p>
          </div>
          <Badge className="bg-primary">Active</Badge>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Monthly Usage</span>
            <span className="text-sm text-muted-foreground">
              {currentUsage.toLocaleString()} / {planLimit.toLocaleString()} generations
            </span>
          </div>
          <Progress value={usagePercentage} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {(100 - usagePercentage).toFixed(1)}% remaining this month
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
          <Button variant="outline">Cancel Subscription</Button>
        </div>
      </Card>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 ${plan.current ? "border-primary border-2" : ""}`}
            >
              {plan.current && (
                <Badge className="mb-4 bg-primary">Current Plan</Badge>
              )}
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-semibold">{plan.price}</span>
                <span className="text-muted-foreground ml-2">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.current ? "outline" : "default"}
                disabled={plan.current}
                onClick={() => handleUpgrade(plan.name)}
              >
                {plan.current ? "Current Plan" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Invoice History */}
      <Card>
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Invoice History</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownloadInvoice(invoice.id)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}













