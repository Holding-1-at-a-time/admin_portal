import { Suspense } from "react"
import { CreditCardProcessingForm } from "@/components/settings/CreditCardProcessingForm"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreditCardProcessingPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Credit Card Processing</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CreditCardProcessingForm />
      </Suspense>
    </div>
  )
}

