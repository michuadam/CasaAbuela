import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'zamowienia@abuela.casa';

interface OrderItem {
  title: string;
  unitPrice: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  inpostPointName: string | null;
  inpostPointAddress: string | null;
  items?: string;
}

function parseOrderItems(order: Order, items?: OrderItem[]): OrderItem[] {
  if (items && items.length > 0) {
    return items;
  }
  if (order.items) {
    try {
      return JSON.parse(order.items);
    } catch {
      return [];
    }
  }
  return [];
}

function formatItemsHtml(items: OrderItem[]): string {
  return items.map(item => 
    `<tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${item.unitPrice} PLN</td>
    </tr>`
  ).join('');
}

export async function sendOrderConfirmationEmail(order: Order, items?: OrderItem[]): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const orderItems = parseOrderItems(order, items);
  
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3d2914;">
      <h1 style="color: #3d2914; border-bottom: 2px solid #c9a66b; padding-bottom: 10px;">
        Dziękujemy za zamówienie!
      </h1>
      
      <p>Cześć ${order.customerName},</p>
      <p>Twoje zamówienie <strong>#${order.id.slice(0, 8)}</strong> zostało opłacone i jest przygotowywane do wysyłki.</p>
      
      <h2 style="color: #3d2914; margin-top: 30px;">Szczegóły zamówienia</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f4ef;">
            <th style="padding: 10px; text-align: left;">Produkt</th>
            <th style="padding: 10px; text-align: center;">Ilość</th>
            <th style="padding: 10px; text-align: right;">Cena</th>
          </tr>
        </thead>
        <tbody>
          ${formatItemsHtml(orderItems)}
        </tbody>
      </table>
      
      <p style="font-size: 18px; font-weight: bold; margin-top: 20px; text-align: right;">
        Razem: ${order.totalAmount} PLN
      </p>
      
      <h2 style="color: #3d2914; margin-top: 30px;">Dostawa</h2>
      <p>
        <strong>InPost Paczkomat:</strong><br>
        ${order.inpostPointName || 'Brak'}<br>
        ${order.inpostPointAddress || ''}
      </p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        Pozdrawiamy,<br>
        Zespół Casa Abuela
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.customerEmail,
      subject: `Potwierdzenie zamówienia #${order.id.slice(0, 8)} - Casa Abuela`,
      html
    });
    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

export async function sendShippingEmail(order: Order, items?: OrderItem[]): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email');
    return;
  }

  const orderItems = parseOrderItems(order, items);
  
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3d2914;">
      <h1 style="color: #3d2914; border-bottom: 2px solid #c9a66b; padding-bottom: 10px;">
        Twoja paczka została wysłana!
      </h1>
      
      <p>Cześć ${order.customerName},</p>
      <p>Twoje zamówienie <strong>#${order.id.slice(0, 8)}</strong> zostało wysłane i już wkrótce dotrze do Ciebie!</p>
      
      <h2 style="color: #3d2914; margin-top: 30px;">Punkt odbioru</h2>
      <p style="background: #f8f4ef; padding: 15px; border-radius: 8px;">
        <strong>${order.inpostPointName || 'InPost Paczkomat'}</strong><br>
        ${order.inpostPointAddress || ''}
      </p>
      
      <h2 style="color: #3d2914; margin-top: 30px;">Zawartość przesyłki</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8f4ef;">
            <th style="padding: 10px; text-align: left;">Produkt</th>
            <th style="padding: 10px; text-align: center;">Ilość</th>
          </tr>
        </thead>
        <tbody>
          ${orderItems.map(item => 
            `<tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            </tr>`
          ).join('')}
        </tbody>
      </table>
      
      <p style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
        📦 Otrzymasz powiadomienie SMS/email od InPost, gdy paczka dotrze do paczkomatu.
      </p>
      
      <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
        Dziękujemy za zakupy!<br>
        Zespół Casa Abuela
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.customerEmail,
      subject: `Wysłaliśmy Twoje zamówienie #${order.id.slice(0, 8)} - Casa Abuela`,
      html
    });
    console.log(`Shipping email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error('Failed to send shipping email:', error);
  }
}
