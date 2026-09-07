import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import dns from 'dns';
import fs from 'fs';
import path from 'path';

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

    cartItems.forEach((item: any, index: number) => {
      let techniqueName = 'Direct Print (DTF)';
      if (item.technique === 'embroidery') techniqueName = '3D Custom Embroidery';
      if (item.technique === 'laser') techniqueName = 'Laser Engraved Patch';

      const defaultImg = item.productType === 'hat' ? 'http://localhost:3001/hat-front.png' : 'http://localhost:3001/shirt-front.png';
      const images = [item.frontImage || defaultImg, item.backImage, item.leftImage, item.rightImage].filter(Boolean);
      let imgTags = images.map((img: string) => {
        if (img.startsWith('data:image')) {
          const cid = `img${attachmentCounter}@shirt.site`;
          const base64Data = img.split(',')[1];
          attachments.push({
            filename: `item${index + 1}-img${attachmentCounter}.png`,
            content: base64Data,
            encoding: 'base64',
            cid: cid
          });
          const tag = `<img src="cid:${cid}" width="120" style="margin-right:10px; border:1px solid #ddd; border-radius: 4px;" />`;
          attachmentCounter++;
          return tag;
        }
        
        // If it's a relative URL (like the default image), make it absolute
        const absoluteImg = img.startsWith('http') ? img : `http://localhost:3001${img.startsWith('/') ? '' : '/'}${img}`;
        return `<img src="${absoluteImg}" width="120" style="margin-right:10px; border:1px solid #ddd; border-radius: 4px;" />`;
      }).join('');
      
      itemsHtml += `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; background-color: #fafafa;">
          <h3>Item ${index + 1}: Custom ${item.productType} (${techniqueName})</h3>
          <p><strong>Color:</strong> ${item.shirtColor || 'White'}</p>
          <p><strong>Sizes:</strong> ${
            Object.entries(item.quantities || {})
              .filter(([_, qty]) => parseInt(qty as string) > 0)
              .map(([size, qty]) => `${size.toUpperCase()}: ${qty}`)
              .join(', ')
          }</p>
          <p><strong>Decorations:</strong> 
            Front: ${item.frontColors?.length > 0 ? 'Yes' : 'No'}, 
            Back: ${item.backColors?.length > 0 ? 'Yes' : 'No'}, 
            Left: ${item.leftColors?.length > 0 ? 'Yes' : 'No'}, 
            Right: ${item.rightColors?.length > 0 ? 'Yes' : 'No'}
          </p>
          <div style="margin-top: 10px;">
            ${imgTags}
          </div>
        </div>
      `;
    });

    const adminHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">New Order Received!</h1>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
        
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Customer Details</h2>
        <p><strong>Name:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>

        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Design Instructions</h2>
        <p>${instructions || 'No specific instructions provided.'}</p>

        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Cart Items</h2>
        ${itemsHtml}
      </div>
    `;

    const customerHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981;">Thank You For Your Order!</h1>
        <p>Hi ${customerName},</p>
        <p>We have successfully received your order. We are currently processing it and will update you soon.</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
        
        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Shipping Address</h2>
        <p>${address}</p>

        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Track Your Order</h2>
        <p>You can track the status of your order at any time on our website using the link below:</p>
        <p><a href="https://yourwebsite.com/track" style="color: #2563eb; font-weight: bold;">Track Order</a></p>
        <p>Enter your Order ID: <strong>${orderId}</strong></p>

        <h2 style="border-bottom: 2px solid #eee; padding-bottom: 5px;">Order Summary</h2>
        ${itemsHtml}
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #666;">If you have any questions, feel free to reply to this email.</p>
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
