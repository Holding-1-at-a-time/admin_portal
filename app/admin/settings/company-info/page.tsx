import { Suspense } from "react"
import { CompanyInfoForm } from "@/components/settings/CompanyInfoForm"
import { Skeleton } from "@/components/ui/skeleton"

export default function CompanyInfoPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Company Info</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <CompanyInfoForm />
      </Suspense>
    </div>
  )
}

