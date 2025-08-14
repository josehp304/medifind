import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertReservationSchema } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Clock, Package } from "lucide-react";

// Extend the schema for form validation
const reservationFormSchema = insertReservationSchema.extend({
  customerName: z.string().min(1, "Name is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type ReservationFormData = z.infer<typeof reservationFormSchema>;

interface ReservationFormProps {
  shopId: number;
  medicineId: number;
  medicineName: string;
  shopName: string;
  price: string;
  availableStock: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationForm({
  shopId,
  medicineId,
  medicineName,
  shopName,
  price,
  availableStock,
  isOpen,
  onClose,
}: ReservationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reservationId, setReservationId] = useState<number | null>(null);

  const form = useForm<ReservationFormData>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      shopId,
      medicineId,
      quantity: 1,
      totalPrice: price,
      notes: "",
    },
  });

  const reservation = useMutation({
    mutationFn: async (data: ReservationFormData) => {
      const response = await apiRequest("POST", "/api/reservations", data);
      return response.json();
    },
    onSuccess: (data) => {
      setReservationId(data.id);
      toast({
        title: "Reservation Created",
        description: `Your reservation for ${medicineName} has been successfully created.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reservations"] });
      form.reset();
    },
    onError: (error) => {
      console.error("Reservation error:", error);
      toast({
        title: "Reservation Failed",
        description: error.message || "Failed to create reservation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (quantity: number) => {
    const totalPrice = (parseFloat(price) * quantity).toFixed(2);
    form.setValue("totalPrice", totalPrice);
    form.setValue("quantity", quantity);
  };

  const onSubmit = (data: ReservationFormData) => {
    reservation.mutate(data);
  };

  const handleClose = () => {
    setReservationId(null);
    form.reset();
    onClose();
  };

  if (reservationId) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" data-testid="reservation-success-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Reservation Confirmed
            </DialogTitle>
            <DialogDescription>
              Your medicine reservation has been successfully created.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Reservation ID:</span>
                    <span className="font-mono" data-testid="reservation-id">#{reservationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medicine:</span>
                    <span data-testid="reserved-medicine">{medicineName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pharmacy:</span>
                    <span data-testid="reserved-shop">{shopName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span data-testid="reserved-quantity">{form.getValues("quantity")}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span data-testid="reserved-total">₹{form.getValues("totalPrice")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Next Steps</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    The pharmacy will confirm your reservation within 2 hours. You'll receive a call when your medicine is ready for pickup.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">Your item is reserved</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleClose} variant="outline" className="flex-1" data-testid="button-close-success">
                Close
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" data-testid="button-submit-reservation-success">
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg" data-testid="reservation-form-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Reserve Medicine
          </DialogTitle>
          <DialogDescription>
            Reserve {medicineName} at {shopName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input
              id="customerName"
              {...form.register("customerName")}
              placeholder="Enter your full name"
              data-testid="input-customer-name"
            />
            {form.formState.errors.customerName && (
              <p className="text-sm text-red-500">{form.formState.errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input
              id="customerPhone"
              {...form.register("customerPhone")}
              placeholder="Enter your phone number"
              data-testid="input-customer-phone"
            />
            {form.formState.errors.customerPhone && (
              <p className="text-sm text-red-500">{form.formState.errors.customerPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email (Optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              {...form.register("customerEmail")}
              placeholder="Enter your email address"
              data-testid="input-customer-email"
            />
            {form.formState.errors.customerEmail && (
              <p className="text-sm text-red-500">{form.formState.errors.customerEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={availableStock}
              {...form.register("quantity", { 
                valueAsNumber: true,
                onChange: (e) => handleQuantityChange(parseInt(e.target.value) || 1)
              })}
              data-testid="input-quantity"
            />
            <p className="text-sm text-gray-500">Available stock: {availableStock}</p>
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Total Price</Label>
            <div className="text-2xl font-semibold text-green-600" data-testid="text-total-price">
              ₹{form.watch("totalPrice")}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Any special instructions or notes..."
              rows={3}
              data-testid="input-notes"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel-reservation"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={reservation.isPending}
              className="flex-1"
              data-testid="button-submit-reservation"
            >
              {reservation.isPending ? "Creating..." : "Reserve Medicine"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}