import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TransactionDetailsModalProps {
  transaction: any // Replace 'any' with your actual transaction type
  onClose: () => void
}

export function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Details for transaction {transaction.invoiceNumber}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Client</h4>
            <p>{transaction.clientName}</p>
          </div>
          <div>
            <h4 className="font-semibold">Date</h4>
            <p>{transaction.date}</p>
          </div>
          <div>
            <h4 className="font-semibold">Estimate Number</h4>
            <p>{transaction.estimateNumber}</p>
          </div>
          <div>
            <h4 className="font-semibold">Invoice Number</h4>
            <p>{transaction.invoiceNumber}</p>
          </div>
          <div>
            <h4 className="font-semibold">Amount Paid</h4>
            <p>${transaction.amountPaid.toFixed(2)}</p>
          </div>
          <div>
            <h4 className="font-semibold">Status</h4>
            <p>{transaction.refunded ? "Refunded" : "Paid"}</p>
          </div>
          {transaction.refundId && (
            <div>
              <h4 className="font-semibold">Refund ID</h4>
              <p>{transaction.refundId}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

