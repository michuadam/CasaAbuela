import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { useUpload } from "@/hooks/use-upload";
import type { Product } from "@shared/schema";

function HomepageSettings() {
  const queryClient = useQueryClient();
  const [heroImage, setHeroImage] = useState("");
  const [aboutImage, setAboutImage] = useState("");
  
  const { uploadFile, isUploading } = useUpload({
    onSuccess: () => {
      toast.success("Zdjęcie przesłane!");
    },
    onError: () => {
      toast.error("Nie udało się przesłać zdjęcia");
    },
  });

  const { data: settings, isLoading } = useQuery<Record<string, string>>({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const res = await fetch("/api/site-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setHeroImage(settings.heroImage || "");
      setAboutImage(settings.aboutImage || "");
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await fetch(`/api/admin/site-settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error("Failed to update setting");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Ustawienie zapisane!");
    },
    onError: () => {
      toast.error("Nie udało się zapisać ustawienia");
    },
  });

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    settingKey: string,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const response = await uploadFile(file);
      if (response) {
        setter(response.objectPath);
        updateSetting.mutate({ key: settingKey, value: response.objectPath });
      }
    }
    e.target.value = "";
  };

  const saveUrl = (key: string, value: string) => {
    updateSetting.mutate({ key, value });
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Ładowanie ustawień...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-serif text-xl text-primary mb-4">Zdjęcie Hero (główny baner)</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Główne zdjęcie wyświetlane na górze strony głównej.
        </p>
        <div className="flex gap-2 mb-4">
          <Input
            value={heroImage || settings?.heroImage || ""}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="URL zdjęcia lub prześlij plik..."
            className="flex-1"
            data-testid="input-hero-image"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "heroImage", setHeroImage)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading} className="rounded-none">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Przesyłam..." : "Prześlij"}
            </Button>
          </div>
          <Button
            onClick={() => saveUrl("heroImage", heroImage)}
            disabled={updateSetting.isPending}
            className="rounded-none"
          >
            <Save className="h-4 w-4 mr-2" /> Zapisz
          </Button>
        </div>
        {(heroImage || settings?.heroImage) && (
          <img
            src={heroImage || settings?.heroImage}
            alt="Podgląd Hero"
            className="w-full max-w-md h-48 object-cover border"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="font-serif text-xl text-primary mb-4">Zdjęcie sekcji "O nas"</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Zdjęcie wyświetlane w sekcji opisującej historię plantacji.
        </p>
        <div className="flex gap-2 mb-4">
          <Input
            value={aboutImage || settings?.aboutImage || ""}
            onChange={(e) => setAboutImage(e.target.value)}
            placeholder="URL zdjęcia lub prześlij plik..."
            className="flex-1"
            data-testid="input-about-image"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, "aboutImage", setAboutImage)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading} className="rounded-none">
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Przesyłam..." : "Prześlij"}
            </Button>
          </div>
          <Button
            onClick={() => saveUrl("aboutImage", aboutImage)}
            disabled={updateSetting.isPending}
            className="rounded-none"
          >
            <Save className="h-4 w-4 mr-2" /> Zapisz
          </Button>
        </div>
        {(aboutImage || settings?.aboutImage) && (
          <img
            src={aboutImage || settings?.aboutImage}
            alt="Podgląd O nas"
            className="w-full max-w-md h-48 object-cover border"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading: authLoading, isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState("products");
  
  const { uploadFile, isUploading } = useUpload({
    onSuccess: (response) => {
      setEditForm({ ...editForm, imageUrl: response.objectPath });
      toast.success("Zdjęcie przesłane!");
    },
    onError: (error) => {
      toast.error("Nie udało się przesłać zdjęcia");
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
    e.target.value = "";
  };

  const { data: products = [], isLoading: loadingProducts } = useQuery<Product[]>({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: isAdmin,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <p className="text-muted-foreground">Sprawdzanie uprawnień...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 md:px-6 py-32 text-center">
          <h1 className="font-serif text-3xl text-primary mb-4">Zaloguj się</h1>
          <p className="text-muted-foreground mb-8">Musisz się zalogować, aby uzyskać dostęp do panelu admina.</p>
          <Link href="/login">
            <Button className="rounded-none" data-testid="button-login">Zaloguj się</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
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
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border">
              <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Image className="h-4 w-4 mr-2" /> Produkty
              </TabsTrigger>
              <TabsTrigger value="homepage" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" /> Strona główna
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <div className="flex justify-end">
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
            </TabsContent>

            <TabsContent value="homepage" className="space-y-6">
              <HomepageSettings />
            </TabsContent>
          </Tabs>
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
              <Label htmlFor="imageUrl">Zdjęcie produktu</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  value={editForm.imageUrl || ""}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  placeholder="URL zdjęcia lub prześlij plik..."
                  data-testid="input-image-url"
                  className="flex-1"
                />
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                    data-testid="input-file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    className="rounded-none"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Przesyłam..." : "Prześlij"}
                  </Button>
                </div>
              </div>
              {editForm.imageUrl && (
                <div className="mt-2">
                  <img
                    src={editForm.imageUrl}
                    alt="Podgląd"
                    className="w-32 h-32 object-cover border"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
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
