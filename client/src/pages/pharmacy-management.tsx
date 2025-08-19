import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PharmacyRegistrationForm } from "@/components/pharmacy-registration-form";
import { PharmacyDashboard } from "@/components/pharmacy-dashboard";
import { Store, Search, ArrowRight, Building2 } from "lucide-react";

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  licenseNumber: string;
  isActive: number;
  createdAt: string;
}

export function PharmacyManagement() {
  const [currentView, setCurrentView] = useState<"search" | "register" | "dashboard">("search");
  const [searchId, setSearchId] = useState("");
  const [foundPharmacy, setFoundPharmacy] = useState<Pharmacy | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchPharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    setFoundPharmacy(null);

    try {
      const response = await fetch(`/api/pharmacies/${searchId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setSearchError("Pharmacy not found. Please check the ID or register a new pharmacy.");
        } else {
          const errorData = await response.json();
          setSearchError(errorData.message || "Failed to search pharmacy");
        }
        return;
      }

      const pharmacy = await response.json();
      setFoundPharmacy(pharmacy);
    } catch (err) {
      setSearchError("Failed to search pharmacy. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAccessDashboard = (pharmacyId: number) => {
    setCurrentView("dashboard");
    // We'll pass the pharmacy ID to the dashboard
  };

  if (currentView === "register") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView("search")}
            className="mb-4"
          >
            ← Back to Search
          </Button>
        </div>
        <PharmacyRegistrationForm />
      </div>
    );
  }

  if (currentView === "dashboard" && foundPharmacy) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView("search")}
            className="mb-4"
          >
            ← Back to Search
          </Button>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex items-center gap-4">
              <Building2 className="h-12 w-12 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">{foundPharmacy.name}</h2>
                <p className="text-muted-foreground">{foundPharmacy.address}</p>
                <p className="text-sm text-muted-foreground">
                  Owner: {foundPharmacy.ownerName} | License: {foundPharmacy.licenseNumber}
                </p>
              </div>
              <Badge variant={foundPharmacy.isActive ? "default" : "secondary"}>
                {foundPharmacy.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
        <PharmacyDashboard pharmacyId={foundPharmacy.id} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Pharmacy Management</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Access your pharmacy dashboard or register a new pharmacy
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        {/* Search Existing Pharmacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Access Existing Pharmacy
            </CardTitle>
            <CardDescription>
              Enter your pharmacy ID to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearchPharmacy} className="space-y-4">
              <div>
                <Label htmlFor="searchId">Pharmacy ID</Label>
                <Input
                  id="searchId"
                  type="number"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter pharmacy ID (e.g., 1)"
                  required
                />
              </div>
              
              {searchError && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  {searchError}
                </div>
              )}

              <Button type="submit" disabled={searchLoading} className="w-full">
                {searchLoading ? "Searching..." : "Access Dashboard"}
              </Button>
            </form>

            {foundPharmacy && (
              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <Store className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">{foundPharmacy.name}</h3>
                    <p className="text-sm text-muted-foreground">{foundPharmacy.address}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="font-medium">Owner</p>
                    <p className="text-muted-foreground">{foundPharmacy.ownerName}</p>
                  </div>
                  <div>
                    <p className="font-medium">License</p>
                    <p className="text-muted-foreground">{foundPharmacy.licenseNumber}</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{foundPharmacy.ownerPhone}</p>
                  </div>
                  <div>
                    <p className="font-medium">Status</p>
                    <Badge variant={foundPharmacy.isActive ? "default" : "secondary"} className="text-xs">
                      {foundPharmacy.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={() => handleAccessDashboard(foundPharmacy.id)}
                  className="w-full"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Open Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Register New Pharmacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Register New Pharmacy
            </CardTitle>
            <CardDescription>
              Don't have a pharmacy registered? Create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setCurrentView("register")}
              className="w-full"
              variant="outline"
            >
              <Store className="h-4 w-4 mr-2" />
              Register New Pharmacy
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="text-center p-6 border rounded-lg">
          <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Pharmacy Registration</h3>
          <p className="text-sm text-muted-foreground">
            Register your pharmacy with complete details and license information
          </p>
        </div>
        
        <div className="text-center p-6 border rounded-lg">
          <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Inventory Management</h3>
          <p className="text-sm text-muted-foreground">
            Add, update, and track medicines with stock levels and pricing
          </p>
        </div>
        
        <div className="text-center p-6 border rounded-lg">
          <TrendingDown className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="font-semibold mb-2">Stock Monitoring</h3>
          <p className="text-sm text-muted-foreground">
            Get alerts for low stock levels and manage reorder points
          </p>
        </div>
      </div>
    </div>
  );
}

// Import the missing icons
import { Package, TrendingDown } from "lucide-react";
