import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import type { Product } from "@shared/schema";

export default function Admin() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const { data: adminCheck, isLoading: checkingAdmin } = useQuery({
    queryKey: ["admin-check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check");
      if (!res.ok) {
        if (res.status === 401) return { isAdmin: false, notLoggedIn: true };
        throw new Error("Failed to check admin status");
      }
      return res.json();
    },
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: adminCheck?.isAdmin === true,
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produkt zaktualizowany!");
      setIsEditing(null);
    },
    onError: () => {
      toast.error("Nie udało się zaktualizować produktu");
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: Partial<Product>) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produkt utworzony!");
      setIsCreating(false);
      setEditForm({});
    },
    onError: () => {
      toast.error("Nie udało się utworzyć produktu");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produkt usunięty!");
    },
    onError: () => {
      toast.error("Nie udało się usunąć produktu");
    },
  });

  const startEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (isEditing) {
      updateProduct.mutate({ id: isEditing, data: editForm });
    }
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditForm({
      title: "",
      slug: "",
      weight: "250g",
      type: "beans",
      roast: "Średnio-ciemne",
      price: "0",
      description: "",
      shortDescription: "",
      origin: "Huila, Kolumbia",
      tastingNotes: "",
      inStock: 1,
    });
  };

  const saveCreate = () => {
    if (!editForm.title || !editForm.price || !editForm.description) {
      toast.error("Wypełnij wymagane pola (tytuł, cena, opis)");
      return;
    }
    const slug = editForm.slug || editForm.title?.toLowerCase().replace(/\s+/g, "-") + "-" + editForm.weight?.toLowerCase();
    createProduct.mutate({ ...editForm, slug });
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <p className="text-muted-foreground">Sprawdzanie uprawnień...</p>
        </div>
      </div>
    );
  }

  if (adminCheck?.notLoggedIn) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Zaloguj się</h1>
          <p className="text-muted-foreground mb-8">Musisz się zalogować, aby uzyskać dostęp do panelu admina.</p>
          <a href="/api/login">
            <Button className="rounded-none" data-testid="button-login">Zaloguj się</Button>
          </a>
        </div>
      </div>
    );
  }

  if (!adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Brak dostępu</h1>
          <p className="text-muted-foreground mb-8">Nie masz uprawnień administratora.</p>
          <Link href="/">
            <Button variant="outline" className="rounded-none">
              <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do strony głównej
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/">
                <Button variant="ghost" className="mb-2 text-muted-foreground hover:text-primary -ml-4" data-testid="button-back-home">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Wróć do strony
                </Button>
              </Link>
              <h1 className="font-serif text-3xl text-primary">Panel Administracyjny</h1>
            </div>
            <Button onClick={startCreate} className="bg-primary text-white rounded-none" data-testid="button-add-product">
              <Plus className="mr-2 h-4 w-4" /> Dodaj produkt
            </Button>
          </div>

          {loadingProducts ? (
            <p className="text-muted-foreground">Ładowanie produktów...</p>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-products">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Nazwa</th>
                      <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Typ</th>
                      <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Waga</th>
                      <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Cena</th>
                      <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Dostępność</th>
                      <th className="text-right px-4 py-3 font-medium text-sm text-gray-600">Akcje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50" data-testid={`row-product-${product.id}`}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-primary">{product.title}</div>
                          <div className="text-xs text-muted-foreground">{product.slug}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.type === "beans" ? "Ziarnista" : "Mielona"}</td>
                        <td className="px-4 py-3 text-sm">{product.weight}</td>
                        <td className="px-4 py-3 text-sm font-medium">{product.price} PLN</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.inStock ? "W magazynie" : "Brak"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEdit(product)}
                            data-testid={`button-edit-${product.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (confirm("Czy na pewno chcesz usunąć ten produkt?")) {
                                deleteProduct.mutate(product.id);
                              }
                            }}
                            data-testid={`button-delete-${product.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={isEditing !== null || isCreating} onOpenChange={() => { setIsEditing(null); setIsCreating(false); setEditForm({}); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {isCreating ? "Nowy produkt" : "Edytuj produkt"}
            </DialogTitle>
            <DialogDescription>
              {isCreating ? "Wypełnij dane nowego produktu" : "Zmień dane produktu"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="title">Nazwa produktu *</Label>
              <Input
                id="title"
                value={editForm.title || ""}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="np. Ziarnista"
                data-testid="input-title"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={editForm.slug || ""}
                onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                placeholder="np. ziarnista-250g"
                data-testid="input-slug"
              />
            </div>

            <div>
              <Label htmlFor="price">Cena (PLN) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={editForm.price || ""}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                placeholder="0.00"
                data-testid="input-price"
              />
            </div>

            <div>
              <Label htmlFor="type">Typ</Label>
              <Select value={editForm.type || "beans"} onValueChange={(val) => setEditForm({ ...editForm, type: val })}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beans">Ziarnista</SelectItem>
                  <SelectItem value="ground">Mielona</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">Waga</Label>
              <Select value={editForm.weight || "250g"} onValueChange={(val) => setEditForm({ ...editForm, weight: val })}>
                <SelectTrigger data-testid="select-weight">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="250g">250g</SelectItem>
                  <SelectItem value="1kg">1kg</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="roast">Palenie</Label>
              <Input
                id="roast"
                value={editForm.roast || ""}
                onChange={(e) => setEditForm({ ...editForm, roast: e.target.value })}
                placeholder="np. Średnio-ciemne"
                data-testid="input-roast"
              />
            </div>

            <div>
              <Label htmlFor="inStock">Dostępność</Label>
              <Select 
                value={String(editForm.inStock ?? 1)} 
                onValueChange={(val) => setEditForm({ ...editForm, inStock: parseInt(val) })}
              >
                <SelectTrigger data-testid="select-instock">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">W magazynie</SelectItem>
                  <SelectItem value="0">Brak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="shortDescription">Krótki opis</Label>
              <Input
                id="shortDescription"
                value={editForm.shortDescription || ""}
                onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                placeholder="Krótki opis wyświetlany w liście produktów"
                data-testid="input-short-description"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Opis *</Label>
              <Textarea
                id="description"
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Pełny opis produktu"
                rows={4}
                data-testid="input-description"
              />
            </div>

            <div>
              <Label htmlFor="origin">Pochodzenie</Label>
              <Input
                id="origin"
                value={editForm.origin || ""}
                onChange={(e) => setEditForm({ ...editForm, origin: e.target.value })}
                placeholder="np. Huila, Kolumbia"
                data-testid="input-origin"
              />
            </div>

            <div>
              <Label htmlFor="tastingNotes">Nuty smakowe</Label>
              <Input
                id="tastingNotes"
                value={editForm.tastingNotes || ""}
                onChange={(e) => setEditForm({ ...editForm, tastingNotes: e.target.value })}
                placeholder="np. czekolada, owoce, orzechy"
                data-testid="input-tasting-notes"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="imageUrl">URL zdjęcia</Label>
              <Input
                id="imageUrl"
                value={editForm.imageUrl || ""}
                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                placeholder="https://..."
                data-testid="input-image-url"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => { setIsEditing(null); setIsCreating(false); setEditForm({}); }}
              className="rounded-none"
              data-testid="button-cancel"
            >
              <X className="mr-2 h-4 w-4" /> Anuluj
            </Button>
            <Button 
              onClick={isCreating ? saveCreate : saveEdit}
              className="bg-primary text-white rounded-none"
              disabled={updateProduct.isPending || createProduct.isPending}
              data-testid="button-save"
            >
              <Save className="mr-2 h-4 w-4" /> 
              {updateProduct.isPending || createProduct.isPending ? "Zapisuję..." : "Zapisz"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
