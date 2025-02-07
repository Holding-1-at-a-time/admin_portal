"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { CompanyInfoForm } from "./CompanyInfoForm"
import { InvoiceEstimateSettingsForm } from "./InvoiceEstimateSettingsForm"
import { CreditCardProcessingForm } from "./CreditCardProcessingForm"
import { QuickBooksSettingsForm } from "./QuickBooksSettingsForm"
import { SubscriptionForm } from "./SubscriptionForm"
import { Loader2 } from "lucide-react"

export default function SettingsContent({ activePage }: { activePage: string }) {
  const { toast } = useToast()
  const settings = useQuery(api.settings.getSettings)
  const updateSettings = useMutation(api.settings.updateSettings)

  const [isLoading, setIsLoading] = useState(false)

  const handleSettingsUpdate = async (updatedSettings: any) => {
    setIsLoading(true)
    try {
      await updateSettings(updatedSettings)
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating settings.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!settings) {
    return <Loader2 className="h-8 w-8 animate-spin" />
  }

  const renderForm = () => {
    switch (activePage) {
      case "company-info":
        return <CompanyInfoForm settings={settings} onUpdate={handleSettingsUpdate} />
      case "invoices-estimates":
        return <InvoiceEstimateSettingsForm settings={settings} onUpdate={handleSettingsUpdate} />
      case "credit-card-processing":
        return <CreditCardProcessingForm settings={settings} onUpdate={handleSettingsUpdate} />
      case "quickbooks":
        return <QuickBooksSettingsForm settings={settings} onUpdate={handleSettingsUpdate} />
      case "subscription":
        return <SubscriptionForm settings={settings} onUpdate={handleSettingsUpdate} />
      default:
        return <div>Select a settings page from the sidebar</div>
    }
  }

  return (
    <div className="w-full">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      {renderForm()}
    </div>
  )
}

