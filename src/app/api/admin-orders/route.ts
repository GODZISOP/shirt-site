import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    // Fetch quotes if requested
    if (type === 'quotes') {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ success: true, quotes: [] });
      }
      return NextResponse.json({ success: true, quotes: data });
    }

    // Default: fetch orders
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ success: false, error: 'The "orders" table does not exist in your Supabase project. Please create it first.' });
      }
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, orders: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}


export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { order_id, status_step, tracking_number, carrier } = data;

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (status_step !== undefined) updates.status_step = status_step;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (carrier !== undefined) updates.carrier = carrier;

    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', order_id)
      .single();

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('order_id', order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification to user if status changed
    if (status_step !== undefined && status_step !== orderData.status_step) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER || 'appointmentstudio@gmail.com',
            pass: process.env.EMAIL_PASS,
          },
          tls: { rejectUnauthorized: false }
        });

        const statusMap: any = {
          1: 'Order Placed & Confirmed',
          2: 'Digitizing & Proofing',
          3: 'In Production',
          4: 'Quality Check & Packing',
          5: 'Out for Delivery / Shipped',
          6: 'Delivered'
        };
        const newStatusName = statusMap[status_step] || 'Updated';

        const updateHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #2563eb;">Order Status Updated!</h1>
            <p>Hi ${orderData.customer_name || 'Customer'},</p>
            <p>Your order <strong>${order_id}</strong> has a new status update.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-left: 4px solid #2563eb;">
              <h2 style="margin: 0; color: #1e40af; font-size: 18px;">Current Status: ${newStatusName}</h2>
            </div>
            
            <p>You can track the full progress of your order at any time using the link below:</p>
            <p><a href="https://yourwebsite.com/track" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Track My Order</a></p>
            <p style="margin-top: 10px;">Enter your Order ID: <strong>${order_id}</strong></p>
            
            <p style="margin-top: 30px; font-size: 0.9em; color: #666;">Thank you for choosing Demir Studio!</p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Demir Studio Orders" <${process.env.EMAIL_USER || 'appointmentstudio@gmail.com'}>`,
          to: orderData.email,
          subject: `Order Update: ${order_id} is now ${newStatusName}`,
          html: updateHtml
        });
      } catch (emailErr) {
        console.error("Failed to send update email", emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get('order_id');
    const all = searchParams.get('all');

    if (all === 'true') {
      const { error } = await supabase.from('orders').delete().neq('order_id', '');
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: 'All test orders cleared' });
    }

    if (!order_id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const { error } = await supabase.from('orders').delete().eq('order_id', order_id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

