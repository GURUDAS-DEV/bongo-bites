import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "@/lib/apiClient";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useAdmin";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, X, GripVertical, Loader2 } from "lucide-react";
import type { ProductImage, StockStatus } from "@/types";

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;

  const { data: existingProduct } = useProduct(id || "");
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [categories, setCategories] = useState<
    { id: string; name: string; slug: string }[]
  >([]);

  useEffect(() => {
    apiClient.get("/products/categories").then((res) => setCategories(res));
  }, []);

  const [form, setForm] = useState({
    name: existingProduct?.name || "",
    description: existingProduct?.description || "",
    category_id: "",
    price: existingProduct?.price?.toString() || "",
    sale_price: existingProduct?.sale_price?.toString() || "",
    sku: existingProduct?.sku || "",
    stock: existingProduct?.stock?.toString() || "0",
    weight: existingProduct?.weight || "",
    size_or_dimensions: existingProduct?.size_or_dimensions || "",
    stock_status: (existingProduct?.stock_status || "in-stock") as StockStatus,
    is_visible: existingProduct?.is_visible ?? true,
  });

  useEffect(() => {
    if (existingProduct && categories.length > 0) {
      const cat = categories.find(
        (c) => c.slug === existingProduct.category_slug,
      );
      setForm((prev) => ({ ...prev, category_id: cat?.id || "" }));
    }
  }, [existingProduct, categories]);

  const [images, setImages] = useState<ProductImage[]>(
    existingProduct?.images || [
      { url: "", alt_text: "", sort_order: 0 },
      { url: "", alt_text: "", sort_order: 1 },
      { url: "", alt_text: "", sort_order: 2 },
      { url: "", alt_text: "", sort_order: 3 },
    ],
  );

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category_id) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const validImages = images.filter((img) => img.url.trim());

    const productData = {
      name: form.name,
      slug: form.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      description: form.description,
      category_id: form.category_id,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : undefined,
      sku: form.sku || undefined,
      stock: parseInt(form.stock) || 0,
      weight: form.weight || undefined,
      size_or_dimensions: form.size_or_dimensions || undefined,
      keywords: [], // backend expects array
      is_bestseller: false, // not in form
      is_visible: form.is_visible,
    };

    try {
      let product;
      if (isEditing && id) {
        const result = await updateProduct.mutateAsync({
          id,
          data: productData,
        });
        product = result;
        // Delete existing images
        if (existingProduct?.images) {
          for (const img of existingProduct.images) {
            if (img.id) {
              await apiClient.delete(`/products/${id}/images/${img.id}`);
            }
          }
        }
      } else {
        const result = await createProduct.mutateAsync(productData);
        product = result;
        id = product.id;
      }

      // Add new images
      for (const img of validImages) {
        await apiClient.post(`/products/${id}/images`, {
          image_url: img.url,
          alt_text: img.alt_text || undefined,
          sort_order: img.sort_order,
        });
      }

      toast({
        title: "Success",
        description: `Product ${isEditing ? "updated" : "created"}`,
      });
      navigate("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Edit Product" : "New Product"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update product details"
              : "Add a new product to your catalog"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(v) => handleChange("category_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input
                    value={form.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="e.g., BH-TURM-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <Input
                    value={form.weight}
                    onChange={(e) => handleChange("weight", e.target.value)}
                    placeholder="e.g., 1.0 kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Size / Dimensions</Label>
                  <Input
                    value={form.size_or_dimensions}
                    onChange={(e) =>
                      handleChange("size_or_dimensions", e.target.value)
                    }
                    placeholder="e.g., 10x15 cm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Product Images</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => "imageslot"}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste image URLs. Minimum 4 images recommended.
              </p>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-start p-3 rounded-lg border border-border"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={img.url}
                      onChange={(e) =>
                        handleImageChange(idx, "url", e.target.value)
                      }
                      placeholder={`Image URL ${idx + 1}`}
                    />
                    <Input
                      value={img.alt_text || ""}
                      onChange={(e) =>
                        handleImageChange(idx, "alt_text", e.target.value)
                      }
                      placeholder="Alt text (for SEO)"
                      className="text-sm"
                    />
                  </div>
                  {img.url && (
                    <img
                      src={img.url}
                      alt=""
                      className="w-16 h-16 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={() => removeImageSlot(idx)}
                    disabled={images.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Display Price (₹) *</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="Selling price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sale Price (₹)</Label>
                  <Input
                    type="number"
                    value={form.sale_price}
                    onChange={(e) => handleChange("sale_price", e.target.value)}
                    placeholder="Discounted price"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input
                    type="number"
                    value={form.purchase_price}
                    onChange={(e) =>
                      handleChange("purchase_price", e.target.value)
                    }
                    placeholder="Your cost"
                  />
                  <p className="text-xs text-muted-foreground">
                    Internal only - never shown to customers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Visible on site</Label>
                <Switch
                  checked={form.is_visible}
                  onCheckedChange={(v) => handleChange("is_visible", v)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Status</Label>
                <Select
                  value={form.stock_status}
                  onValueChange={(v) => handleChange("stock_status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditing ? "Update Product" : "Create Product"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/admin/products")}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
