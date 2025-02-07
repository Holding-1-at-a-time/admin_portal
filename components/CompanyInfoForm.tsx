"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { JSX } from "react/jsx-runtime"



/**
 * @typedef {Object} CompanyInfoFormSettings
 * @property {string} companyName
 * @property {string} website
 * @property {string} email
 * @property {string} phone
 * @property {string} fax
 * @property {string} taxIdentificationNumber
 * @property {string} logoUrl
 * @property {{ country: string; address: string; city: string; state: string; zipCode: string }} mailingAddress
 * @property {{ country: string; address: string; city: string; state: string; zipCode: string }} shopAddress
 * @property {string[]} ccEmails
 * @property {boolean} autoSaveRetailVehicles
 * @property {boolean} autoSaveWholesaleVehicles
 * @property {boolean} disableMultiCarEstimates
 * @property {boolean} requireWorkOrdersFromEstimate
 * @property {boolean} convertEstimatesToInvoices
 * @property {boolean} activateTipsOnPayments
 */

/**
 * @param {CompanyInfoFormSettings} settings
 * @param {() => Promise<void>} onUpdate
 * @returns {JSX.Element}
 */
type CompanyInfoFormSettings = {
  companyName: string
  website: string
  email: string
  phone: string
  fax: string
  taxIdentificationNumber: string
  logoUrl: string
  mailingAddress: {
    country: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  shopAddress: {
    country: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  ccEmails: string[]
  autoSaveRetailVehicles: boolean
  autoSaveWholesaleVehicles: boolean
  disableMultiCarEstimates: boolean
  requireWorkOrdersFromEstimate: boolean
  convertEstimatesToInvoices: boolean
  activateTipsOnPayments: boolean
}
export function CompanyInfoForm({
  settings,
  onUpdateAction: onUpdate,
}: {
  settings: CompanyInfoFormSettings
  onUpdateAction: () => Promise<void>
}): JSX.Element {

  const { toast } = useToast()
  const [formData, setFormData] = useState<CompanyInfoFormSettings>(settings)

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  const handleAddressChange = (
    type: "mailingAddress" | "shopAddress",
    field: keyof CompanyInfoFormSettings["mailingAddress"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
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
      await onUpdate()
      toast({
        title: "Company Info Updated",
        description: "Your company information has been successfully updated.",
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const uploadUrl = await convexClient.query("generateUploadUrl", { contentType: file.type });
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      }),
        data = await response.json()
      setFormData((prev) => {
        return {
          ...prev,
          logoUrl: data.url,
        }
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
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company&lsquo;s basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {formData.logoUrl && (
                  <Image
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, companyName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  value={formData.fax || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fax: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxIdentificationNumber">Tax Identification Number</Label>
                <Input
                  id="taxIdentificationNumber"
                  value={formData.taxIdentificationNumber || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, taxIdentificationNumber: e.target.value }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </form >
      </div>


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
                  onChange={(e) => handleAddressChange("mailingAddress", key as keyof CompanyInfoFormSettings["mailingAddress"], e.target.value)}
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
                  onChange={(e) =>
                    handleAddressChange("shopAddress", key as keyof CompanyInfoFormSettings["shopAddress"], e.target.value)
                  }
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
    </>
  )
}