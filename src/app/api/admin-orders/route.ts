import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // If table doesn't exist, error code is usually '42P01'
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

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('order_id', order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
