import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Upload, Image, Settings, Package, ChevronLeft } from "lucide-react";
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
import type { Product, Order } from "@shared/schema";

interface OrderItem {
  title: string;
  unitPrice: string;
  quantity: number;
}

interface OrderWithItems extends Omit<Order, 'items'> {
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  pending: "Oczekujące",
  awaiting_payment: "Oczekuje na płatność",
  paid: "Opłacone",
  shipped: "Wysłane",
  cancelled: "Anulowane",
  failed: "Nieudane"
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  awaiting_payment: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  shipped: "bg-purple-100 text-purple-800",
  cancelled: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800"
};

function OrdersTab() {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const { data: selectedOrder, isLoading: loadingOrder } = useQuery<OrderWithItems>({
    queryKey: ["admin-order", selectedOrderId],
    queryFn: async () => {
      const res = await fetch(`/api/admin/orders/${selectedOrderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
    enabled: !!selectedOrderId,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", selectedOrderId] });
      toast.success("Status zamówienia zaktualizowany!");
    },
    onError: () => {
      toast.error("Nie udało się zaktualizować statusu");
    },
  });

  if (selectedOrderId && selectedOrder) {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedOrderId(null)}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Wróć do listy
        </Button>

        {loadingOrder ? (
          <p className="text-muted-foreground">Ładowanie zamówienia...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-serif text-xl text-primary">Zamówienie #{selectedOrder.id.slice(0, 8)}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedOrder.createdAt!).toLocaleString("pl-PL")}
                </p>
              </div>
              <Select 
                value={selectedOrder.status} 
                onValueChange={(status) => updateStatus.mutate({ id: selectedOrder.id, status })}
                disabled={selectedOrder.status === "paid"}
              >
                <SelectTrigger className="w-48" data-testid="select-order-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Oczekujące</SelectItem>
                  <SelectItem value="awaiting_payment">Oczekuje na płatność</SelectItem>
                  <SelectItem value="shipped">Wysłane</SelectItem>
                  <SelectItem value="cancelled">Anulowane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Dane klienta</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Imię:</span> {selectedOrder.customerName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                  <p><span className="text-muted-foreground">Telefon:</span> {selectedOrder.customerPhone}</p>
                  {selectedOrder.customerType === "company" && (
                    <>
                      <p><span className="text-muted-foreground">Firma:</span> {selectedOrder.companyName}</p>
                      <p><span className="text-muted-foreground">NIP:</span> {selectedOrder.companyNip}</p>
                    </>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Dostawa InPost</h3>
                <div className="text-sm space-y-1">
                  <p><span className="text-muted-foreground">Paczkomat:</span> {selectedOrder.inpostPointName || "-"}</p>
                  <p><span className="text-muted-foreground">Adres:</span> {selectedOrder.inpostPointAddress || "-"}</p>
                  {selectedOrder.inpostShipmentId ? (
                    <p><span className="text-muted-foreground">Przesyłka ID:</span> <span className="font-mono text-green-600">{selectedOrder.inpostShipmentId}</span></p>
                  ) : selectedOrder.inpostPointId ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/admin/orders/${selectedOrder.id}/inpost/create`, {
                            method: "POST",
                            credentials: "include",
                          });
                          const data = await res.json();
                          if (res.ok) {
                            toast.success(`Utworzono przesyłkę: ${data.inpostShipmentId}`);
                            queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
                          } else {
                            toast.error(data.error || "Błąd tworzenia przesyłki");
                          }
                        } catch (err) {
                          toast.error("Błąd połączenia");
                        }
                      }}
                      data-testid="button-create-inpost-shipment"
                    >
                      Utwórz przesyłkę InPost (sandbox)
                    </Button>
                  ) : null}
                  
                  {selectedOrder.status !== "shipped" && selectedOrder.inpostShipmentId && (
                    <Button
                      size="sm"
                      className="mt-3 bg-green-600 hover:bg-green-700"
                      onClick={() => updateStatus.mutate({ id: selectedOrder.id, status: "shipped" })}
                      data-testid="button-mark-shipped"
                    >
                      Oznacz jako wysłane
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Produkty</h3>
              <div className="border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-2">Produkt</th>
                      <th className="text-right px-4 py-2">Cena</th>
                      <th className="text-right px-4 py-2">Ilość</th>
                      <th className="text-right px-4 py-2">Suma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="px-4 py-2">{item.title}</td>
                        <td className="px-4 py-2 text-right">{parseFloat(item.unitPrice).toFixed(2)} zł</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right font-medium">
                          {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)} zł
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-medium">Razem:</td>
                      <td className="px-4 py-2 text-right font-bold text-primary">
                        {parseFloat(selectedOrder.totalAmount).toFixed(2)} zł
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loadingOrders ? (
        <p className="text-muted-foreground">Ładowanie zamówień...</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Brak zamówień</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="table-orders">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Data</th>
                  <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Klient</th>
                  <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Kwota</th>
                  <th className="text-left px-4 py-3 font-medium text-sm text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedOrderId(order.id)}
                    data-testid={`row-order-${order.id}`}
                  >
                    <td className="px-4 py-3 text-sm">
                      {new Date(order.createdAt!).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{order.customerName}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.customerEmail}</td>
                    <td className="px-4 py-3 text-sm font-medium">{parseFloat(order.totalAmount).toFixed(2)} zł</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded ${statusColors[order.status] || "bg-gray-100"}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

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
              <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Package className="h-4 w-4 mr-2" /> Zamówienia
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

            <TabsContent value="orders" className="space-y-4">
              <OrdersTab />
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
