"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { generateUploadUrl, saveLogoUrl } from "@/services/upload"

export function CompanyInfoForm({ settings, onUpdate }) {
  const { toast } = useToast()
  const [formData, setFormData] = useState(settings)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (type: "mailingAddress" | "shopAddress", field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }))
  }

  const handleCCEmailChange = (index: number, value: string) => {
    const newCCEmails = [...formData.ccEmails]
    newCCEmails[index] = value
    setFormData((prev) => ({ ...prev, ccEmails: newCCEmails }))
  }

  const handleAddCCEmail = () => {
    setFormData((prev) => ({ ...prev, ccEmails: [...prev.ccEmails, ""] }))
  }

  const handleRemoveCCEmail = (index: number) => {
    const newCCEmails = formData.ccEmails.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, ccEmails: newCCEmails }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onUpdate(formData)
      toast({
        title: "Company Info Updated",
        description: "Your company information has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating company information.",
        variant: "destructive",
      })
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      //This section is unchanged from the original code
      const uploadUrl = await generateUploadUrl({ contentType: file.type })
      await fetch(uploadUrl, {
        method: "POST",
        body: file,
      })

      const storageId = uploadUrl.split("/").pop()
      const logoUrl = await saveLogoUrl({ storageId })

      setFormData((prev) => ({ ...prev, logoUrl }))
      toast({
        title: "Logo Uploaded",
        description: "Your company logo has been successfully uploaded.",
      })
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast({
        title: "Error",
        description: "An error occurred while uploading the logo.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            {formData.logoUrl && (
              <img
                src={formData.logoUrl || "/placeholder.svg"}
                alt="Company Logo"
                className="w-20 h-20 object-contain"
              />
            )}
            <div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} ref={fileInputRef} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Change Logo
              </Button>
              <Button
                type="button"
                variant="outline"
                className="ml-2"
                onClick={() => setFormData((prev) => ({ ...prev, logoUrl: "" }))}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName || ""}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website || ""}
              onChange={(e) => handleInputChange("website", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fax">Fax</Label>
            <Input id="fax" value={formData.fax || ""} onChange={(e) => handleInputChange("fax", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxIdentificationNumber">Tax Identification Number</Label>
            <Input
              id="taxIdentificationNumber"
              value={formData.taxIdentificationNumber || ""}
              onChange={(e) => handleInputChange("taxIdentificationNumber", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Company Mailing Address</h3>
            {Object.entries(formData.mailingAddress).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`mailing-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={`mailing-${key}`}
                  value={value || ""}
                  onChange={(e) => handleAddressChange("mailingAddress", key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Shop Address</h3>
            {Object.entries(formData.shopAddress).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`shop-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                <Input
                  id={`shop-${key}`}
                  value={value || ""}
                  onChange={(e) => handleAddressChange("shopAddress", key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Email Carbon Copy</CardTitle>
          <CardDescription>
            Emails you add here will receive a carbon copy of every emailed estimate and invoice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.ccEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={email || ""}
                onChange={(e) => handleCCEmailChange(index, e.target.value)}
                placeholder="Enter email"
              />
              <Button type="button" onClick={() => handleRemoveCCEmail(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button type="button" onClick={handleAddCCEmail}>
            Add
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSaveRetailVehicles">Auto-save retail vehicles to garage</Label>
            <Switch
              id="autoSaveRetailVehicles"
              checked={formData.autoSaveRetailVehicles}
              onCheckedChange={(checked) => handleInputChange("autoSaveRetailVehicles", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSaveWholesaleVehicles">Auto-save wholesale vehicles to garage</Label>
            <Switch
              id="autoSaveWholesaleVehicles"
              checked={formData.autoSaveWholesaleVehicles}
              onCheckedChange={(checked) => handleInputChange("autoSaveWholesaleVehicles", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="disableMultiCarEstimates">Disable multi-car estimates/invoices</Label>
            <Switch
              id="disableMultiCarEstimates"
              checked={formData.disableMultiCarEstimates}
              onCheckedChange={(checked) => handleInputChange("disableMultiCarEstimates", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="requireWorkOrdersFromEstimate">Require work orders to be created from an estimate</Label>
            <Switch
              id="requireWorkOrdersFromEstimate"
              checked={formData.requireWorkOrdersFromEstimate}
              onCheckedChange={(checked) => handleInputChange("requireWorkOrdersFromEstimate", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="convertEstimatesToInvoices">Convert estimates to invoices</Label>
            <Switch
              id="convertEstimatesToInvoices"
              checked={formData.convertEstimatesToInvoices}
              onCheckedChange={(checked) => handleInputChange("convertEstimatesToInvoices", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="activateTipsOnPayments">Activate tips on payments</Label>
            <Switch
              id="activateTipsOnPayments"
              checked={formData.activateTipsOnPayments}
              onCheckedChange={(checked) => handleInputChange("activateTipsOnPayments", checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

