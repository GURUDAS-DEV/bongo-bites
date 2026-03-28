import { useMemo, useState } from "react";
import { useAdminProducts, useCreateManualOrder } from "@/hooks/useAdmin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Loader2, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

type OrderItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
};

type Address = {
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export default function AdminManualOrder() {
  const { data: productsData, isLoading: productsLoading } =
    useAdminProducts(1);
  const { mutate: createOrder, isLoading: creating } = useCreateManualOrder();
  const { toast } = useToast();

  const products = (productsData?.data ?? []) as Product[];

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [productFilter, setProductFilter] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const availableProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(productFilter.toLowerCase()),
    );
  }, [products, productFilter]);

  const addProduct = () => {
    if (!selectedId) {
      toast({
        title: "Select product",
        variant: "destructive",
      });
      return;
    }

    const product = products.find((p) => p.id === selectedId);
    if (!product) return;

    if (product.stock <= 0) {
      toast({
        title: "Out of stock",
        variant: "destructive",
      });
      return;
    }

    setOrderItems((prev) => {
      const existing = prev.find((i) => i.product_id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product_id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }

      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          quantity: 1,
          price: Number(product.sale_price ?? product.price),
        },
      ];
    });

    setSelectedId("");
    setProductFilter("");
  };

  const changeQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setOrderItems((prev) =>
      prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const removeItem = (productId: string) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.product_id !== productId),
    );
  };

  const total = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }, [orderItems]);

  const canSubmit =
    orderItems.length > 0 &&
    (userId.trim() || email.trim()) &&
    address.name &&
    address.phone &&
    address.address_line1 &&
    address.city &&
    address.state &&
    address.pincode;

  const submit = () => {
    if (!canSubmit) {
      toast({
        title: "Incomplete form",
        description: "Fill all required fields",
        variant: "destructive",
      });
      return;
    }

    if (email && !email.includes("@")) {
      toast({
        title: "Invalid email",
        variant: "destructive",
      });
      return;
    }

    createOrder(
      {
        user_id: userId || undefined,
        email: email || undefined,
        address,
        items: orderItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      },
      {
        onSuccess: () => {
          setUserId("");
          setEmail("");
          setOrderItems([]);
          setAddress({
            name: "",
            phone: "",
            address_line1: "",
            address_line2: "",
            city: "",
            state: "",
            pincode: "",
          });

          toast({
            title: "Order created successfully",
            variant: "success",
          });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: (err as Error).message,
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manual Order Creator</h1>

      {/* Customer + Address */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User */}
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="User ID (optional)"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Full Name"
              value={address.name}
              onChange={(e) =>
                setAddress((p) => ({ ...p, name: e.target.value }))
              }
            />
            <Input
              placeholder="Phone"
              value={address.phone}
              onChange={(e) =>
                setAddress((p) => ({ ...p, phone: e.target.value }))
              }
            />

            <Input
              placeholder="Address Line 1"
              className="md:col-span-2"
              value={address.address_line1}
              onChange={(e) =>
                setAddress((p) => ({
                  ...p,
                  address_line1: e.target.value,
                }))
              }
            />

            <Input
              placeholder="Address Line 2"
              className="md:col-span-2"
              value={address.address_line2}
              onChange={(e) =>
                setAddress((p) => ({
                  ...p,
                  address_line2: e.target.value,
                }))
              }
            />

            <Input
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress((p) => ({ ...p, city: e.target.value }))
              }
            />

            <Input
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress((p) => ({ ...p, state: e.target.value }))
              }
            />

            <Input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress((p) => ({ ...p, pincode: e.target.value }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          {/* Search */}
          <div className="relative w-full">
            <Command className="border rounded-lg">
              <CommandInput
                placeholder="Search product..."
                value={productFilter}
                onValueChange={setProductFilter}
                className="pr-20" // space for button
              />

              <CommandList>
                <CommandEmpty>No products found</CommandEmpty>

                {availableProducts.map((product) => {
                  const image = product.images?.[0];

                  return (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      disabled={product.stock <= 0}
                      onSelect={() => {
                        setSelectedId(product.id);
                        setProductFilter(product.name);
                      }}
                      className="flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                        {image ? (
                          <img
                            src={image}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium">
                          {product.name}
                        </span>
                        <span
                          className={`text-xs ${
                            product.stock > 0
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          ₹{product.sale_price ?? product.price} ·{" "}
                          {product.stock > 0 ? "In stock" : "Out of stock"}
                        </span>
                      </div>

                      {selectedId === product.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>

            {/* Add Button inside input */}
            <Button
              size="sm"
              onClick={addProduct}
              disabled={!selectedId}
              className="absolute right-2 top-2 h-8 px-3"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Items */}
          {productsLoading ? (
            <Loader2 className="animate-spin" />
          ) : orderItems.length === 0 ? (
            <p className="text-muted-foreground">No products added</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          changeQuantity(
                            item.product_id,
                            Number(e.target.value),
                          )
                        }
                        className="w-20"
                      />
                    </td>
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <Button
                        variant="ghost"
                        onClick={() => removeItem(item.product_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-between items-center">
            <Badge>Total: ₹{total}</Badge>
            <Button onClick={submit} disabled={!canSubmit || creating}>
              {creating ? <Loader2 className="animate-spin" /> : "Place Order"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
