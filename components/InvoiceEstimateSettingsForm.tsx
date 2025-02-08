"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

// Define a type for the form data
type FormData = {
  invoicePrefix: string
  nextInvoiceNumber: number
  requiredFields: {
    customerName: boolean
    customerPhone: boolean
    customerEmail: boolean
    vehicleYear: boolean
    vehicleMake: boolean
    vehicleModel: boolean
    vehicleColor: boolean
    vehicleMiles: boolean
    vehicleVin: boolean
    vehicleLicensePlate: boolean
  }
  pdfOptions: {
    showVehicleImages: boolean
    showVehicleDiagram: boolean
  }
  signatureDisclosures: {
    invoiceDisclosure: string
    estimateDisclosure: string
  }
  textTemplate: {
    language: string
    defaultMessage: string
  }
}

// Define default values for the form
const defaultFormData: FormData = {
  invoicePrefix: "",
  nextInvoiceNumber: 1,
  requiredFields: {
    customerName: false,
    customerPhone: false,
    customerEmail: false,
    vehicleYear: false,
    vehicleMake: false,
    vehicleModel: false,
    vehicleColor: false,
    vehicleMiles: false,
    vehicleVin: false,
    vehicleLicensePlate: false,
  },
  pdfOptions: {
    showVehicleImages: false,
    showVehicleDiagram: false,
  },
  signatureDisclosures: {
    invoiceDisclosure: "",
    estimateDisclosure: "",
  },
  textTemplate: {
    language: "en-US",
    defaultMessage: "",
  },
}

export function InvoiceEstimateSettingsForm() {
  const { toast } = useToast()
  const settings = useQuery(api.invoiceEstimateSettings.getInvoiceEstimateSettings)
  const updateSettings = useMutation(api.invoiceEstimateSettings.updateInvoiceEstimateSettings)

  const [formData, setFormData] = useState<FormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData((prevData) => ({
        ...prevData,
        ...settings,
      }))
    }
  }, [settings])

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRequiredFieldChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      requiredFields: { ...prev.requiredFields, [name]: value },
    }))
  }

  const handlePdfOptionChange = (name: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      pdfOptions: { ...prev.pdfOptions, [name]: value },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await updateSettings(formData)
      toast({
        title: "Settings Updated",
        description: "Your invoice and estimate settings have been successfully updated.",
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
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
          <CardDescription>Configure your invoice numbering and required fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
              <Input
                id="invoicePrefix"
                value={formData.invoicePrefix}
                onChange={(e) => handleInputChange("invoicePrefix", e.target.value)}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
              <Input
                id="nextInvoiceNumber"
                type="number"
                value={formData.nextInvoiceNumber}
                onChange={(e) => handleInputChange("nextInvoiceNumber", Number.parseInt(e.target.value))}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Required Fields</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.requiredFields).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => handleRequiredFieldChange(key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PDF Options</CardTitle>
          <CardDescription>Configure options for PDF generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="showVehicleImages">Show Vehicle Images</Label>
            <Switch
              id="showVehicleImages"
              checked={formData.pdfOptions.showVehicleImages}
              onCheckedChange={(checked) => handlePdfOptionChange("showVehicleImages", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showVehicleDiagram">Show Vehicle Diagram</Label>
            <Switch
              id="showVehicleDiagram"
              checked={formData.pdfOptions.showVehicleDiagram}
              onCheckedChange={(checked) => handlePdfOptionChange("showVehicleDiagram", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Signature Disclosures</CardTitle>
          <CardDescription>Customize your company's signature disclosures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceDisclosure">Invoice Disclosure</Label>
            <Textarea
              id="invoiceDisclosure"
              value={formData.signatureDisclosures.invoiceDisclosure}
              onChange={(e) =>
                handleInputChange("signatureDisclosures", {
                  ...formData.signatureDisclosures,
                  invoiceDisclosure: e.target.value,
                })
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimateDisclosure">Estimate Disclosure</Label>
            <Textarea
              id="estimateDisclosure"
              value={formData.signatureDisclosures.estimateDisclosure}
              onChange={(e) =>
                handleInputChange("signatureDisclosures", {
                  ...formData.signatureDisclosures,
                  estimateDisclosure: e.target.value,
                })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Text Template</CardTitle>
          <CardDescription>Configure default text message template</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.textTemplate.language}
              onValueChange={(value) =>
                handleInputChange("textTemplate", { ...formData.textTemplate, language: value })
              }
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es-ES">Spanish (Spain)</SelectItem>
                <SelectItem value="fr-FR">French (France)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultMessage">Default Message</Label>
            <Textarea
              id="defaultMessage"
              value={formData.textTemplate.defaultMessage}
              onChange={(e) =>
                handleInputChange("textTemplate", { ...formData.textTemplate, defaultMessage: e.target.value })
              }
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
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
      </div>
    </form>
  )
}

