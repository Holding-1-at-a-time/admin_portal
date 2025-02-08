"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Define the shape of our form data
interface InvoiceSettingsFormData {
  invoicePrefix: string
  nextInvoiceNumber: number
  autoIncrementInvoice: boolean
}

export default function InvoiceSettingsForm() {
  const { toast } = useToast()
  const invoiceSettings = useQuery(api.invoiceEstimateSettings.getInvoiceEstimateSettings)
  const updateInvoiceSettings = useMutation(api.invoiceEstimateSettings.updateInvoiceEstimateSettings)

  // Initialize form data with default values
  const [formData, setFormData] = useState<InvoiceSettingsFormData>({
    invoicePrefix: "",
    nextInvoiceNumber: 1,
    autoIncrementInvoice: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  // Update form data when invoiceSettings are fetched
  useEffect(() => {
    if (invoiceSettings) {
      setFormData({
        invoicePrefix: invoiceSettings.invoicePrefix || "",
        nextInvoiceNumber: invoiceSettings.nextInvoiceNumber || 1,
        autoIncrementInvoice: invoiceSettings.autoIncrementInvoice || false,
      })
    }
  }, [invoiceSettings])

  const handleInputChange = (name: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateInvoiceSettings(formData)
      toast({
        title: "Settings Updated",
        description: "Your invoice settings have been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (invoiceSettings === undefined) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
        <Input
          id="invoicePrefix"
          value={formData.invoicePrefix}
          onChange={(e) => handleInputChange("invoicePrefix", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
        <Input
          id="nextInvoiceNumber"
          type="number"
          value={formData.nextInvoiceNumber}
          onChange={(e) => handleInputChange("nextInvoiceNumber", Number.parseInt(e.target.value, 10))}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="autoIncrementInvoice"
          checked={formData.autoIncrementInvoice}
          onCheckedChange={(checked) => handleInputChange("autoIncrementInvoice", checked)}
        />
        <Label htmlFor="autoIncrementInvoice">Auto-increment Invoice Numbers</Label>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}

