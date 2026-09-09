import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import fs from 'fs';
import path from 'path';
import { PRODUCTS, getColorHex, getColorName } from '@/lib/products';

// Force IPv4 to prevent ECONNREFUSED on IPv6 networks with Gmail
dns.setDefaultResultOrder('ipv4first');

// Helper to manually read .env.local in case server wasn't restarted
function getEnv(key: string): string {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(new RegExp(`^${key}=['"]?(.*?)['"]?$`, 'm'));
    return match ? match[1] : '';
  } catch (e) {
    return '';
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { orderId, customerName, email, phone, address, instructions, cartItems, totalAmount } = data;

    // Create reusable transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: getEnv('EMAIL_USER') || 'appointmentstudio@gmail.com',
        pass: getEnv('EMAIL_PASS'), 
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const adminEmail = getEnv('EMAIL_USER') || 'appointmentstudio@gmail.com';
    const attachments: any[] = [];
    let attachmentCounter = 1;
    let itemsHtml = '';

    (cartItems || []).forEach((item: any, index: number) => {
      let techniqueName = 'Direct Print (DTF)';
      if (item.technique === 'embroidery') techniqueName = '3D Custom Embroidery';
      if (item.technique === 'laser') techniqueName = 'Laser Engraved Patch';

      // Find fallback image from product catalog
      const matchedProd = PRODUCTS.find(
        (p) => p.id === item.productId || p.name.toLowerCase() === (item.productName || '').toLowerCase()
      );
      const defaultImg = matchedProd?.image || (item.productType === 'hat' ? '/hat-front.png' : '/shirt-front.png');

      const rawImages = [item.frontImage, item.backImage, item.leftImage, item.rightImage].filter(Boolean);
      const images = rawImages.length > 0 ? rawImages : [defaultImg];

      const imgTags = images.map((img: string) => {
        if (!img) return '';

        // 1. Base64 customizer preview
        if (img.startsWith('data:image')) {
          const cid = `img${attachmentCounter}@demir.studio`;
          const mimeMatch = img.match(/^data:([^;]+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
          const ext = mimeType.split('/')[1] || 'png';
          const base64Data = img.replace(/^data:[^;]+;base64,/, '');

          attachments.push({
            filename: `item${index + 1}-img${attachmentCounter}.${ext}`,
            content: base64Data,
            encoding: 'base64',
            contentType: mimeType,
            cid: cid
          });
          attachmentCounter++;
          return `<img src="cid:${cid}" width="120" style="margin-right:10px; margin-bottom:10px; border:1px solid #e2e8f0; border-radius: 6px; object-fit: cover; background: #ffffff;" />`;
        }

        // 2. Local relative image or localhost image from public folder
        let cleanPath = img;
        if (cleanPath.startsWith('http://localhost') || cleanPath.startsWith('https://localhost')) {
          try {
            const parsed = new URL(cleanPath);
            cleanPath = parsed.pathname;
          } catch (e) {
            // ignore
          }
        }

        cleanPath = cleanPath.split('?')[0].split('#')[0].replace(/^\/+/, '');
        try {
          cleanPath = decodeURIComponent(cleanPath);
        } catch (e) {
          // ignore
        }

        const localFilePath = path.join(process.cwd(), 'public', cleanPath);
        if (fs.existsSync(localFilePath) && fs.statSync(localFilePath).isFile()) {
          try {
            const fileBuffer = fs.readFileSync(localFilePath);
            const ext = path.extname(localFilePath).replace('.', '').toLowerCase() || 'png';
            const mimeType =
              ext === 'jpg' || ext === 'jpeg'
                ? 'image/jpeg'
                : ext === 'webp'
                ? 'image/webp'
                : ext === 'gif'
                ? 'image/gif'
                : 'image/png';
            const cid = `prod${attachmentCounter}@demir.studio`;

            attachments.push({
              filename: `item${index + 1}-${path.basename(localFilePath)}`,
              content: fileBuffer,
              contentType: mimeType,
              cid: cid
            });
            attachmentCounter++;
            return `<img src="cid:${cid}" width="120" style="margin-right:10px; margin-bottom:10px; border:1px solid #e2e8f0; border-radius: 6px; object-fit: cover; background: #ffffff;" />`;
          } catch (err) {
            console.error('Failed to read image file for email:', localFilePath, err);
          }
        }

        // 3. Remote external URL (not localhost)
        if (img.startsWith('http://') || img.startsWith('https://')) {
          return `<img src="${img}" width="120" style="margin-right:10px; margin-bottom:10px; border:1px solid #e2e8f0; border-radius: 6px; object-fit: cover; background: #ffffff;" />`;
        }

        return '';
      }).filter(Boolean).join('');

      const colorHex = getColorHex(item.shirtColorHex || item.shirtColor);
      const colorName = getColorName(item.shirtColor);

      const sizeEntries = item.quantities
        ? Object.entries(item.quantities).filter(([_, qty]) => parseInt(qty as string) > 0)
        : [];
      const sizesString = sizeEntries.map(([size, qty]) => `${size.toUpperCase()}: ${qty}`).join(', ');
      const itemTotalQty = sizeEntries.reduce((sum, [_, qty]) => sum + (parseInt(qty as string, 10) || 0), 0);

      const unitPrice = item.pricePerShirt ?? item.price;
      const itemTotalPrice = item.totalPrice
        ? parseFloat(item.totalPrice)
        : unitPrice
        ? unitPrice * (itemTotalQty || 1)
        : 0;

      const productName = item.productName || `Custom ${item.productType || 'Apparel'}`;

      itemsHtml += `
        <div style="margin-bottom: 20px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #f8fafc;">
          <h3 style="margin-top:0; color:#1e293b; font-size:16px;">
            Item ${index + 1}: ${productName} <span style="font-size:13px; color:#6366f1; font-weight:normal;">(${techniqueName})</span>
          </h3>
          <p style="margin: 6px 0; font-size: 14px;">
            <strong>Color:</strong> 
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${colorHex}; border:1px solid #cbd5e1; vertical-align:middle; margin-right:4px;"></span>
            ${colorName}
          </p>
          <p style="margin: 6px 0; font-size: 14px;">
            <strong>Quantity:</strong> 
            <strong style="color:#0f172a;">${itemTotalQty > 0 ? `${itemTotalQty} pcs` : '1 pc'}</strong>
            ${sizesString ? ` (${sizesString})` : ''}
          </p>
          ${
            itemTotalPrice > 0
              ? `<p style="margin: 6px 0; font-size: 14px;"><strong>Price:</strong> $${itemTotalPrice.toFixed(2)} ${unitPrice ? `<span style="color:#64748b; font-size:12px;">($${unitPrice.toFixed(2)}/ea)</span>` : ''}</p>`
              : ''
          }
          <p style="margin: 6px 0; font-size: 13px; color: #64748b;">
            ${
              item.isCustomDesign === false || item.productId
                ? '<strong>Product Type:</strong> Ready-Made Store Product (As Pictured)'
                : `<strong>Custom Prints:</strong> Front: ${item.frontColors?.length > 0 ? 'Yes' : 'No'}, Back: ${item.backColors?.length > 0 ? 'Yes' : 'No'}, Left: ${item.leftColors?.length > 0 ? 'Yes' : 'No'}, Right: ${item.rightColors?.length > 0 ? 'Yes' : 'No'}`
            }
          </p>
          ${
            imgTags
              ? `<div style="margin-top: 12px; display: flex; flex-wrap: wrap;">${imgTags}</div>`
              : ''
          }
        </div>
      `;
    });

    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; color: #334155;">
        <h1 style="color: #2563eb; margin-bottom: 8px;">New Order Received!</h1>
        <p style="font-size: 16px; margin-top: 0;">Order ID: <strong style="color: #0f172a;">${orderId}</strong></p>
        <p style="font-size: 18px; font-weight: bold; color: #16a34a;">Total Amount: $${totalAmount}</p>
        
        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Customer Details</h2>
        <p style="margin: 4px 0;"><strong>Name:</strong> ${customerName}</p>
        <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
        <p style="margin: 4px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p style="margin: 4px 0;"><strong>Shipping Address:</strong> ${address}</p>

        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Design Instructions</h2>
        <p style="background: #fffbeb; padding: 10px; border-radius: 6px; border: 1px solid #fef3c7; color: #b45309;">
          ${instructions || 'No specific instructions provided.'}
        </p>

        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Order Items</h2>
        ${itemsHtml}
      </div>
    `;

    const customerHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 20px; color: #334155;">
        <h1 style="color: #10b981; margin-bottom: 8px;">Thank You For Your Order!</h1>
        <p style="font-size: 15px;">Hi ${customerName},</p>
        <p style="font-size: 14px; line-height: 1.5;">We have successfully received your order and our team is preparing it. We will notify you once your order begins production and ships.</p>
        
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 4px 0; font-size: 15px;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 4px 0; font-size: 16px; font-weight: bold; color: #0f172a;"><strong>Total Amount:</strong> $${totalAmount}</p>
        </div>
        
        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Shipping Address</h2>
        <p style="margin: 4px 0;">${address}</p>

        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Track Your Order</h2>
        <p style="font-size: 14px;">You can track the live status of your order at any time using our online tracker:</p>
        <p><a href="http://localhost:3000/track" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Track Order #${orderId}</a></p>

        <h2 style="border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; font-size: 16px; margin-top: 24px;">Order Items Breakdown</h2>
        ${itemsHtml}
        
        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">If you have any questions or need to make changes to your order, feel free to reply directly to this email or reach us on WhatsApp.</p>
      </div>
    `;

    const adminEmailToUse = process.env.EMAIL_USER || 'appointmentstudio@gmail.com';
    const customerEmailToUse = email || adminEmailToUse;

    // Send email to Customer
    const customerInfo = await transporter.sendMail({
      from: `"Demir Studio Orders" <${adminEmailToUse}>`,
      to: customerEmailToUse,
      subject: `Order Confirmation: ${orderId}`,
      html: customerHtmlContent,
      attachments: attachments
    });

    // Send email to Admin
    if (adminEmailToUse !== customerEmailToUse) {
      await transporter.sendMail({
        from: `"Demir Studio Orders" <${adminEmailToUse}>`,
        to: adminEmailToUse,
        subject: `[Admin] New Order Received: ${orderId}`,
        html: adminHtmlContent,
        attachments: attachments
      });
    }

    return NextResponse.json({ success: true, messageId: customerInfo.messageId });
  } catch (error: any) {
    console.error("Email Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
