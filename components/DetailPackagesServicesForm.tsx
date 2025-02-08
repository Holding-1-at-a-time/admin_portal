"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash2, Edit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function DetailPackagesServicesForm() {
  const { toast } = useToast()
  const packages = useQuery(api.detailPackagesServices.getDetailPackages)
  const services = useQuery(api.detailPackagesServices.getDetailServices)
  const createPackage = useMutation(api.detailPackagesServices.createDetailPackage)
  const createService = useMutation(api.detailPackagesServices.createDetailService)
  const updatePackage = useMutation(api.detailPackagesServices.updateDetailPackage)
  const updateService = useMutation(api.detailPackagesServices.updateDetailService)
  const deletePackage = useMutation(api.detailPackagesServices.deleteDetailPackage)
  const deleteService = useMutation(api.detailPackagesServices.deleteDetailService)

  const [activeTab, setActiveTab] = useState("packages")
  const [searchTerm, setSearchTerm] = useState("")
  const [pricingMethodFilter, setPricingMethodFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    pricingMethod: "Flat Fee",
    price: 0,
    duration: 0,
    description: "",
  })

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const submitData = {
        ...formData,
        price: Math.round(formData.price * 100), // Convert to cents
      }
      if (currentItem) {
        if (activeTab === "packages") {
          await updatePackage({ ...submitData, id: currentItem._id, isActive: currentItem.isActive })
        } else {
          await updateService({ ...submitData, id: currentItem._id, isActive: currentItem.isActive })
        }
        toast({
          title: `${activeTab === "packages" ? "Package" : "Service"} Updated`,
          description: `Your ${activeTab === "packages" ? "package" : "service"} has been successfully updated.`,
        })
      } else {
        if (activeTab === "packages") {
          await createPackage(submitData)
        } else {
          await createService(submitData)
        }
        toast({
          title: `${activeTab === "packages" ? "Package" : "Service"} Created`,
          description: `Your new ${activeTab === "packages" ? "package" : "service"} has been successfully created.`,
        })
      }
      setIsDialogOpen(false)
      setCurrentItem(null)
      setFormData({
        name: "",
        pricingMethod: "Flat Fee",
        price: 0,
        duration: 0,
        description: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while ${currentItem ? "updating" : "creating"} the ${activeTab === "packages" ? "package" : "service"}.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    try {
      if (activeTab === "packages") {
        await deletePackage({ id })
      } else {
        await deleteService({ id })
      }
      toast({
        title: `${activeTab === "packages" ? "Package" : "Service"} Deleted`,
        description: `Your ${activeTab === "packages" ? "package" : "service"} has been successfully deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `An error occurred while deleting the ${activeTab === "packages" ? "package" : "service"}.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = (activeTab === "packages" ? packages.data : services.data)?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPricingMethod = pricingMethodFilter === "All" || item.pricingMethod === pricingMethodFilter
    return matchesSearch && matchesPricingMethod
  })

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle>Detail Packages</CardTitle>
              <CardDescription>Manage your detail packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search packages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={pricingMethodFilter} onValueChange={setPricingMethodFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Pricing Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Flat Fee">Flat Fee</SelectItem>
                      <SelectItem value="Per Vehicle">Per Vehicle</SelectItem>
                      <SelectItem value="By The Hour">By The Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setCurrentItem(null)
                        setFormData({
                          name: "",
                          pricingMethod: "Flat Fee",
                          price: 0,
                          duration: 0,
                          description: "",
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create New Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{currentItem ? "Edit Package" : "Create New Package"}</DialogTitle>
                      <DialogDescription>
                        {currentItem ? "Edit the details of your package." : "Enter the details of your new package."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pricingMethod" className="text-right">
                            Pricing Method
                          </Label>
                          <Select
                            value={formData.pricingMethod}
                            onValueChange={(value) => handleInputChange("pricingMethod", value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select pricing method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flat Fee">Flat Fee</SelectItem>
                              <SelectItem value="Per Vehicle">Per Vehicle</SelectItem>
                              <SelectItem value="By The Hour">By The Hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Price
                          </Label>
                          <Input
                            id="price"
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            value={formData.price.toFixed(2)}
                            onChange={(e) => {
                              const value = e.target.value
                              // Only allow numbers and decimal points
                              if (!/^\d*\.?\d{0,2}$/.test(value) && value !== "") return

                              // Convert to cents to maintain precision
                              const cents = Math.round(Number.parseFloat(value || "0") * 100)
                              handleInputChange("price", cents / 100)
                            }}
                            placeholder="0.00"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Package"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pricing Method</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.pricingMethod}</TableCell>
                      <TableCell>
                        {item.pricingMethod === "By The Hour"
                          ? `${(item.price / 100).toFixed(2)} hrs`
                          : `$${(item.price / 100).toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentItem(item)
                              setFormData({
                                name: item.name,
                                pricingMethod: item.pricingMethod,
                                price: item.price / 100, // Convert from cents to dollars
                                duration: item.duration || 0,
                                description: item.description || "",
                              })
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Detail Services</CardTitle>
              <CardDescription>Manage your detail services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={pricingMethodFilter} onValueChange={setPricingMethodFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Pricing Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Flat Fee">Flat Fee</SelectItem>
                      <SelectItem value="Per Vehicle">Per Vehicle</SelectItem>
                      <SelectItem value="By The Hour">By The Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setCurrentItem(null)
                        setFormData({
                          name: "",
                          pricingMethod: "Flat Fee",
                          price: 0,
                          duration: 0,
                          description: "",
                        })
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Create New Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{currentItem ? "Edit Service" : "Create New Service"}</DialogTitle>
                      <DialogDescription>
                        {currentItem ? "Edit the details of your service." : "Enter the details of your new service."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="pricingMethod" className="text-right">
                            Pricing Method
                          </Label>
                          <Select
                            value={formData.pricingMethod}
                            onValueChange={(value) => handleInputChange("pricingMethod", value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select pricing method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flat Fee">Flat Fee</SelectItem>
                              <SelectItem value="Per Vehicle">Per Vehicle</SelectItem>
                              <SelectItem value="By The Hour">By The Hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="price" className="text-right">
                            Price
                          </Label>
                          <Input
                            id="price"
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            value={formData.price.toFixed(2)}
                            onChange={(e) => {
                              const value = e.target.value
                              // Only allow numbers and decimal points
                              if (!/^\d*\.?\d{0,2}$/.test(value) && value !== "") return

                              // Convert to cents to maintain precision
                              const cents = Math.round(Number.parseFloat(value || "0") * 100)
                              handleInputChange("price", cents / 100)
                            }}
                            placeholder="0.00"
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="duration" className="text-right">
                            Duration (hours)
                          </Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => handleInputChange("duration", Number.parseFloat(e.target.value))}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Service"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Pricing Method</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems?.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.pricingMethod}</TableCell>
                      <TableCell>
                        {item.pricingMethod === "By The Hour"
                          ? `${(item.price / 100).toFixed(2)} hrs`
                          : `$${(item.price / 100).toFixed(2)}`}
                      </TableCell>
                      <TableCell>{item.duration} hrs</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentItem(item)
                              setFormData({
                                name: item.name,
                                pricingMethod: item.pricingMethod,
                                price: item.price / 100, // Convert from cents to dollars
                                duration: item.duration || 0,
                                description: item.description || "",
                              })
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(item._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

