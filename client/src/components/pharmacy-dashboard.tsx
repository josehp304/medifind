import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, AlertTriangle, Package, TrendingDown, Calendar, DollarSign } from "lucide-react";

interface Medicine {
  id: number;
  name: string;
  description: string;
  manufacturer: string | null;
  category: string | null;
  dosageForm: string | null;
  strength: string | null;
  requiresPrescription: number;
}

interface InventoryItem {
  id: number;
  medicineId: number;
  price: string;
  stockQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  batchNumber: string | null;
  expiryDate: string | null;
  supplierName: string | null;
  isActive: number;
  medicine: Medicine;
}

interface AddInventoryData {
  medicineId: string;
  price: string;
  stockQuantity: string;
  minStockLevel: string;
  maxStockLevel: string;
  batchNumber: string;
  expiryDate: string;
  supplierName: string;
}

interface PharmacyDashboardProps {
  pharmacyId: number;
}

export function PharmacyDashboard({ pharmacyId }: PharmacyDashboardProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [addFormData, setAddFormData] = useState<AddInventoryData>({
    medicineId: "",
    price: "",
    stockQuantity: "",
    minStockLevel: "10",
    maxStockLevel: "100",
    batchNumber: "",
    expiryDate: "",
    supplierName: ""
  });

  // Fetch data
  useEffect(() => {
    loadDashboardData();
  }, [pharmacyId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load inventory
      const inventoryResponse = await fetch(`/api/shops/${pharmacyId}/medicines`);
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json();
        setInventory(inventoryData.inventory || []);
      }

      // Load all medicines for dropdown
      const medicinesResponse = await fetch("/api/medicines");
      if (medicinesResponse.ok) {
        const medicinesData = await medicinesResponse.json();
        setMedicines(medicinesData || []);
      }

      // Load low stock items
      const lowStockResponse = await fetch(`/api/pharmacies/${pharmacyId}/low-stock`);
      if (lowStockResponse.ok) {
        const lowStockData = await lowStockResponse.json();
        setLowStockItems(lowStockData || []);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/pharmacies/${pharmacyId}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medicineId: parseInt(addFormData.medicineId),
          price: addFormData.price,
          stockQuantity: parseInt(addFormData.stockQuantity),
          minStockLevel: parseInt(addFormData.minStockLevel),
          maxStockLevel: parseInt(addFormData.maxStockLevel),
          batchNumber: addFormData.batchNumber || null,
          expiryDate: addFormData.expiryDate || null,
          supplierName: addFormData.supplierName || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      setIsAddDialogOpen(false);
      setAddFormData({
        medicineId: "",
        price: "",
        stockQuantity: "",
        minStockLevel: "10",
        maxStockLevel: "100",
        batchNumber: "",
        expiryDate: "",
        supplierName: ""
      });
      
      await loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add inventory item");
    }
  };

  const handleUpdateInventory = async (item: InventoryItem, updates: Partial<InventoryItem>) => {
    try {
      const response = await fetch(`/api/pharmacies/${pharmacyId}/inventory/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update inventory item");
    }
  };

  const handleDeleteInventory = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete ${item.medicine.name} from your inventory?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/pharmacies/${pharmacyId}/inventory/${item.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      await loadDashboardData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete inventory item");
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.stockQuantity === 0) return { status: "Out of Stock", variant: "destructive" as const };
    if (item.stockQuantity <= item.minStockLevel) return { status: "Low Stock", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Package className="h-12 w-12 animate-pulse mx-auto mb-4" />
          <p>Loading pharmacy dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and stock levels</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Medicine to Inventory</DialogTitle>
              <DialogDescription>
                Add a new medicine to your pharmacy inventory
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddInventory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicine">Medicine</Label>
                  <Select
                    value={addFormData.medicineId}
                    onValueChange={(value) => setAddFormData(prev => ({ ...prev, medicineId: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map((medicine) => (
                        <SelectItem key={medicine.id} value={medicine.id.toString()}>
                          {medicine.name} ({medicine.strength})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={addFormData.price}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="45.50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stockQuantity">Stock Quantity</Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={addFormData.stockQuantity}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, stockQuantity: e.target.value }))}
                    placeholder="100"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="minStockLevel">Min Stock Level</Label>
                  <Input
                    id="minStockLevel"
                    type="number"
                    min="0"
                    value={addFormData.minStockLevel}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, minStockLevel: e.target.value }))}
                    placeholder="10"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxStockLevel">Max Stock Level</Label>
                  <Input
                    id="maxStockLevel"
                    type="number"
                    min="0"
                    value={addFormData.maxStockLevel}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, maxStockLevel: e.target.value }))}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={addFormData.batchNumber}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="BT-2024-001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={addFormData.expiryDate}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  value={addFormData.supplierName}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, supplierName: e.target.value }))}
                  placeholder="ABC Pharmaceuticals"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Medicine
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {lowStockItems.length} item(s) with low stock levels that need attention.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Current Inventory
          </CardTitle>
          <CardDescription>
            Manage your medicine inventory, stock levels, and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.medicine.name}</p>
                          <p className="text-sm text-muted-foreground">{item.medicine.strength}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.medicine.category || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <p className="font-medium">{item.stockQuantity}</p>
                          <p className="text-xs text-muted-foreground">
                            Min: {item.minStockLevel}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ₹{item.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.batchNumber || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(item.expiryDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(item);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteInventory(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {inventory.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No medicines in inventory</p>
                <p className="text-sm text-muted-foreground">Click "Add Medicine" to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
