import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { sendOrderConfirmationEmail } from './mailer';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    const stripe = await getUncachableStripeClient();
    
    const webhookSecret = await sync.getWebhookSecret(uuid);
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    const isNew = await storage.recordStripeEvent(event.id, event.type);
    if (!isNew) {
      console.log(`Stripe event ${event.id} already processed, skipping`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const order = await storage.getOrderByStripeSession(session.id);
      
      if (order && order.status !== 'paid') {
        await storage.updateOrderStatus(
          order.id, 
          'paid', 
          session.payment_intent as string
        );
        await storage.clearCart(order.sessionId);
        await storage.batchDecrementStockForOrder(order.id);
        console.log(`Order ${order.id} marked as paid, stock decremented`);
        
        const orderItems = await storage.getOrderItems(order.id);
        const items = orderItems.map(item => ({
          title: item.titleSnapshot,
          unitPrice: item.unitPriceSnapshot,
          quantity: item.quantity
        }));
        sendOrderConfirmationEmail(order as any, items).catch(err => 
          console.error('Email send failed:', err)
        );
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as any;
      const checkoutSessions = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
        limit: 1
      });
      
      if (checkoutSessions.data.length > 0) {
        const session = checkoutSessions.data[0];
        const order = await storage.getOrderByStripeSession(session.id);
        if (order) {
          await storage.updateOrderStatus(order.id, 'failed');
          console.log(`Order ${order.id} marked as failed`);
        }
      }
    }

    await sync.processWebhook(payload, signature, uuid);
  }
}
