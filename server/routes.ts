import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertCartItemSchema, insertNewsletterSubscriberSchema, updateProductSchema, insertProductImageSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { getUncachableStripeClient } from "./stripeClient";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Auth routes - Register
  app.post('/api/register', async (req: any, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email i hasło są wymagane" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Użytkownik z tym adresem email już istnieje" });
      }

      const user = await storage.createUser({ email, password, firstName, lastName });
      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Błąd podczas rejestracji" });
    }
  });

  // Auth routes - Login
  app.post('/api/login', async (req: any, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email i hasło są wymagane" });
      }

      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
      }

      req.session.userId = user.id;
      
      res.json({ 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName,
        isAdmin: user.isAdmin 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Błąd podczas logowania" });
    }
  });

  // Auth routes - Logout
  app.post('/api/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Błąd podczas wylogowywania" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });

  // Auth routes - Get current user
  app.get('/api/auth/user', async (req: any, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName,
      isAdmin: user.isAdmin 
    });
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      let product = await storage.getProductBySlug(slug);
      if (!product) {
        product = await storage.getProduct(slug);
      }
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      const images = await storage.getProductImages(product.id);
      res.json({ product, images });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Cart
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const items = await storage.getCartItems(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const itemData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      const item = await storage.addToCart(itemData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }
      const item = await storage.updateCartItemQuantity(req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.session.id;
      await storage.clearCart(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear cart" });
    }
  });

  // Newsletter
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const subscriberData = insertNewsletterSubscriberSchema.parse(req.body);
      const subscriber = await storage.subscribeToNewsletter(subscriberData);
      res.json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // Checkout - Create Stripe session
  app.post("/api/checkout", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const { 
        customerName, 
        customerEmail, 
        customerPhone, 
        customerType,
        companyName,
        companyNip,
        inpostPointId, 
        inpostPointName, 
        inpostPointAddress 
      } = req.body;

      if (!customerName || !customerEmail || !customerPhone) {
        return res.status(400).json({ error: "Missing customer information" });
      }

      if (customerType === "company" && (!companyName || !companyNip)) {
        return res.status(400).json({ error: "Missing company information" });
      }

      const cartItems = await storage.getCartItems(sessionId);
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      const order = await storage.createOrder({
        sessionId,
        status: "pending",
        customerType: customerType || "individual",
        customerName,
        customerEmail,
        customerPhone,
        companyName: customerType === "company" ? companyName : null,
        companyNip: customerType === "company" ? companyNip : null,
        inpostPointId: inpostPointId || null,
        inpostPointName: inpostPointName || null,
        inpostPointAddress: inpostPointAddress || null,
        totalAmount: totalAmount.toFixed(2),
        items: JSON.stringify(cartItems.map(item => ({
          productId: item.productId,
          title: item.product.title,
          weight: item.product.weight,
          type: item.product.type,
          price: item.product.price,
          quantity: item.quantity
        })))
      });

      const stripe = await getUncachableStripeClient();
      
      const lineItems = cartItems.map(item => ({
        price_data: {
          currency: 'pln',
          product_data: {
            name: `${item.product.title} ${item.product.weight}`,
            description: item.product.description,
          },
          unit_amount: Math.round(parseFloat(item.product.price) * 100),
        },
        quantity: item.quantity,
      }));

      const baseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
      
      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'blik', 'p24'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout?canceled=true`,
        customer_email: customerEmail,
        metadata: {
          orderId: order.id,
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 1499,
                currency: 'pln',
              },
              display_name: 'InPost Paczkomat',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 2,
                },
                maximum: {
                  unit: 'business_day',
                  value: 4,
                },
              },
            },
          },
        ],
      });

      await storage.updateOrderStripeSession(order.id, checkoutSession.id);
      await storage.updateOrderStatus(order.id, "awaiting_payment");

      res.json({ url: checkoutSession.url, orderId: order.id });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Verify payment success by Stripe checkout session ID
  app.get("/api/order/verify/:stripeSessionId", async (req, res) => {
    try {
      const stripe = await getUncachableStripeClient();
      const stripeSession = await stripe.checkout.sessions.retrieve(req.params.stripeSessionId);
      
      if (stripeSession.payment_status === 'paid' && stripeSession.metadata?.orderId) {
        let order = await storage.getOrder(stripeSession.metadata.orderId);
        if (order && order.status !== 'paid') {
          order = await storage.updateOrderStatus(order.id, "paid", stripeSession.payment_intent as string);
          await storage.clearCart(order!.sessionId);
        }
        res.json({ success: true, order });
      } else {
        res.json({ success: false, status: stripeSession.payment_status });
      }
    } catch (error) {
      console.error("Order verification error:", error);
      res.status(500).json({ error: "Failed to verify order" });
    }
  });

  // Get order by ID
  app.get("/api/order/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to get order" });
    }
  });

  // ============ ADMIN API ============

  // Check if current user is admin
  app.get("/api/admin/check", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      res.json({ isAdmin: user?.isAdmin === true });
    } catch (error) {
      res.status(500).json({ error: "Failed to check admin status" });
    }
  });

  // Admin: Get all products
  app.get("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin: Create product
  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Admin: Update product
  app.patch("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const updateData = updateProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  // Admin: Delete product
  app.delete("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Admin: Get product images
  app.get("/api/admin/products/:id/images", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const images = await storage.getProductImages(req.params.id);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product images" });
    }
  });

  // Admin: Add product image
  app.post("/api/admin/products/:id/images", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const imageData = insertProductImageSchema.parse({
        ...req.body,
        productId: req.params.id,
      });
      const image = await storage.createProductImage(imageData);
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to add product image" });
    }
  });

  // Admin: Delete product image
  app.delete("/api/admin/images/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      await storage.deleteProductImage(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product image" });
    }
  });

  return httpServer;
}
