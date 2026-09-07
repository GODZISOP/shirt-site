"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Truck, Search, CheckCircle2, Package, Save } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 1, label: '1 - Order Placed' },
  { value: 2, label: '2 - Digitizing/Proofing' },
  { value: 3, label: '3 - In Production' },
  { value: 4, label: '4 - Quality Check' },
  { value: 5, label: '5 - Shipped' },
  { value: 6, label: '6 - Delivered' }
];

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin-orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (orderId: string, updates: any) => {
    setSaving(orderId);
    try {
      const res = await fetch('/api/admin-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, ...updates })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, ...updates } : o));
      } else {
        alert('Failed to update: ' + data.error);
      }
    } catch (err) {
      alert('Error updating order');
    } finally {
      setSaving(null);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'demirStudioo@') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-slate-200">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <input
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-2">Manage customer orders and update tracking status.</p>
            </div>
            <button onClick={fetchOrders} className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-100 bg-white">
              Refresh
            </button>
          </div>

          {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">{error}</div>}

          {loading ? (
            <div className="text-center py-20 text-slate-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No orders found</h3>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID & Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tracking / Shipping</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {orders.map((order) => (
                      <tr key={order.id || order.order_id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{order.order_id}</div>
                          <div className="text-sm text-slate-500">{new Date(order.created_at || Date.now()).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4 max-w-[250px]">
                          <div className="text-sm font-medium text-slate-900">{order.customer_name}</div>
                          <div className="text-sm text-slate-500">{order.email}</div>
                          <div className="text-xs text-slate-500">{order.phone}</div>
                          <div className="text-xs text-slate-400 mt-1 whitespace-pre-wrap">{order.shipping_address}</div>
                          {order.instructions && (
                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              <strong>Instructions:</strong> {order.instructions}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-4">
                            <div>
                              <div className="text-sm font-bold text-slate-900 mb-1">Total: ${order.total_price}</div>
                              <div className="text-xs text-slate-600 font-medium border-b pb-2 mb-2">{order.quantity} total items</div>
                            </div>
                            
                            {order.cart_data ? (
                              <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                {(() => {
                                  try {
                                    const cartItems = JSON.parse(order.cart_data);
                                    return cartItems.map((item: any, idx: number) => (
                                      <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 flex flex-col gap-2">
                                        <div className="text-xs font-semibold text-slate-800">
                                            Item {idx + 1}: Custom {item.productType} ({item.technique === 'embroidery' ? '3D Custom Embroidery' : item.technique === 'laser' ? 'Laser Engraved Patch' : 'Direct Print (DTF)'})
                                        </div>
                                        <div className="text-xs text-slate-600"><strong>Color:</strong> {item.shirtColor || 'White'}</div>
                                        
                                        {/* Display decorations */}
                                        <div className="text-xs text-slate-600">
                                          <div><strong>Front:</strong> {item.frontColors?.length > 0 ? 'Decorated' : 'Blank'}</div>
                                          <div><strong>Back:</strong> {item.backColors?.length > 0 ? 'Decorated' : 'Blank'}</div>
                                          <div><strong>Left:</strong> {item.leftColors?.length > 0 ? 'Decorated' : 'Blank'}</div>
                                          <div><strong>Right:</strong> {item.rightColors?.length > 0 ? 'Decorated' : 'Blank'}</div>
                                        </div>
                                        {/* Display sizes and quantities */}
                                        {item.quantities && Object.keys(item.quantities).length > 0 && (
                                          <div className="text-xs text-slate-600">
                                            <strong>Sizes:</strong> {
                                              Object.entries(item.quantities)
                                                .filter(([_, qty]) => parseInt(qty as string) > 0)
                                                .map(([size, qty]) => `${size.toUpperCase()}: ${qty}`)
                                                .join(', ')
                                            }
                                          </div>
                                        )}
                                        
                                        {/* Display item price if available */}
                                        {item.price && (
                                          <div className="text-xs font-semibold text-slate-800 mt-1">
                                            ${(item.price * Object.values(item.quantities || {}).reduce((sum, q) => sum + parseInt((q as string) || '0'), 0)).toFixed(2)} (${item.price.toFixed(2)} each)
                                          </div>
                                        )}
                                        
                                        {/* Display images */}
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {[item.frontImage, item.backImage, item.leftImage, item.rightImage].filter(Boolean).map((img, i) => (
                                            <img key={i} src={img} className="w-12 h-12 object-cover rounded border border-slate-200" />
                                          ))}
                                        </div>
                                      </div>
                                    ));
                                  } catch (e) {
                                    return <div className="text-xs text-red-500">Error parsing cart data</div>;
                                  }
                                })()}
                              </div>
                            ) : (
                              // Fallback for older orders without cart_data
                              <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap gap-2">
                                  {(() => {
                                    let imgs = [];
                                    try {
                                      imgs = order.image_url?.startsWith('[') ? JSON.parse(order.image_url) : [order.image_url].filter(Boolean);
                                    } catch(e) {
                                      imgs = [order.image_url].filter(Boolean);
                                    }
                                    return imgs.map((img: string, idx: number) => (
                                      <img key={idx} src={img} alt={`Product ${idx+1}`} className="w-12 h-12 object-cover rounded border border-slate-200" />
                                    ));
                                  })()}
                                </div>
                                <div className="text-xs text-slate-500">{order.product_name}</div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select 
                            value={order.status_step || 1} 
                            onChange={(e) => updateOrder(order.order_id, { status_step: parseInt(e.target.value) })}
                            disabled={saving === order.order_id}
                            className="text-sm border border-slate-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {saving === order.order_id && <span className="ml-2 text-xs text-blue-600">Saving...</span>}
                        </td>
                        <td className="px-6 py-4">
                          <form 
                            className="flex flex-col gap-2"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formData = new FormData(e.currentTarget);
                              updateOrder(order.order_id, { 
                                carrier: formData.get('carrier') as string, 
                                tracking_number: formData.get('tracking') as string 
                              });
                            }}
                          >
                            <input 
                              type="text" 
                              name="carrier"
                              placeholder="Carrier (e.g. UPS)" 
                              defaultValue={order.carrier || ''}
                              className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input 
                              type="text" 
                              name="tracking"
                              placeholder="Tracking Number" 
                              defaultValue={order.tracking_number || ''}
                              className="text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="mt-1 text-xs bg-slate-800 text-white py-1 px-2 rounded hover:bg-slate-700">
                              Save Tracking
                            </button>
                          </form>
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
    </div>
  );
}
