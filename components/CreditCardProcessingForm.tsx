"use client"

import { useState } from "react"
import { useQuery, useMutation, useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Pagination } from "@/components/ui/pagination"
import { TransactionDetailsModal } from "@/components/settings/TransactionDetailsModal"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CreditCardProcessingForm() {
  const { toast } = useToast()
  const settings = useQuery(api.creditCardProcessing.getCreditCardProcessingSettings)
  const updateSettings = useMutation(api.creditCardProcessing.updateCreditCardProcessingSettings)
  const refundTransaction = useAction(api.creditCardProcessing.refundTransaction)

  const [page, setPage] = useState(1)
  const pageSize = 10
  const paginatedTransactions = useQuery(api.creditCardProcessing.getPaginatedTransactions, { page, pageSize })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleStripeConnect = async () => {
    setIsLoading(true)
    try {
      const clientId = process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID
      if (!clientId) {
        throw new Error("Stripe Client ID is not set")
      }
      const redirectUri = `${window.location.origin}/api/stripe/callback`
      const state = Math.random().toString(36).substring(7)
      sessionStorage.setItem("stripeState", state)
      window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while connecting to Stripe. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTogglePayments = async (enabled: boolean) => {
    setIsLoading(true)
    try {
      await updateSettings({ stripePaymentsEnabled: enabled })
      toast({
        title: "Settings Updated",
        description: `Stripe payments have been ${enabled ? "enabled" : "disabled"}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating settings. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async (transactionId: string) => {
    setIsLoading(true)
    try {
      await refundTransaction({ transactionId })
      toast({
        title: "Refund Processed",
        description: "The transaction has been successfully refunded.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the refund. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!settings) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credit Card Processing</CardTitle>
          <CardDescription>Configure your Stripe integration for credit card processing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Stripe Connection</h3>
              <p className="text-sm text-gray-500">
                {settings.stripeConnectedAccountId
                  ? "Your account is connected to Stripe"
                  : "Connect your account to Stripe to start accepting payments"}
              </p>
            </div>
            <Button onClick={handleStripeConnect} disabled={isLoading || !!settings.stripeConnectedAccountId}>
              {settings.stripeConnectedAccountId ? "Connected" : "Connect to Stripe"}
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Enable Payments</h3>
              <p className="text-sm text-gray-500">Allow customers to pay with credit cards</p>
            </div>
            <Switch
              checked={settings.stripePaymentsEnabled}
              onCheckedChange={handleTogglePayments}
              disabled={isLoading || !settings.stripeConnectedAccountId}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How To Accept Cards</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex-1 mb-4 md:mb-0">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Card Reader"
              width={200}
              height={200}
              className="mb-4"
            />
            <Button variant="outline">Order Card Reader</Button>
          </div>
          <div className="flex-1 md:border-l md:pl-6">
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">Thank you for your payment!</h3>
              <p className="text-sm text-gray-600 mb-4">You may return the device now.</p>
              <Button variant="outline" className="w-full">
                Back to Invoice
              </Button>
              <p className="text-xs text-center mt-2 text-gray-500">Powered by Mobile Tech RX</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {paginatedTransactions?.transactions.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No transactions found</AlertTitle>
              <AlertDescription>
                There are no recent transactions to display. Transactions will appear here once payments are processed.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Client</th>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Estimate #</th>
                    <th className="text-left p-2">Invoice #</th>
                    <th className="text-right p-2">Amount Paid</th>
                    <th className="text-center p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions?.transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="p-2">{transaction.clientName}</td>
                      <td className="p-2">{transaction.date}</td>
                      <td className="p-2">{transaction.estimateNumber}</td>
                      <td className="p-2">{transaction.invoiceNumber}</td>
                      <td className="p-2 text-right">${transaction.amountPaid.toFixed(2)}</td>
                      <td className="p-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="mr-2"
                        >
                          Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefund(transaction._id)}
                          disabled={transaction.refunded}
                        >
                          {transaction.refunded ? "Refunded" : "Refund"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {paginatedTransactions && paginatedTransactions.transactions.length > 0 && (
            <Pagination
              className="mt-4"
              currentPage={page}
              totalPages={Math.ceil(paginatedTransactions.totalCount / pageSize)}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {selectedTransaction && (
        <TransactionDetailsModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  )
}

