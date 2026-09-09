"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Search, CheckCircle2, Package, Save, RefreshCw,
  ShieldCheck, ChevronDown, ChevronUp, Clock,
  BarChart3, ShoppingBag, AlertCircle, X,
  ClipboardList, Tag, MessageSquare, Eye, EyeOff,
  Layers, DollarSign, ExternalLink, Plus, Trash2,
  Upload, Image as ImageIcon
} from 'lucide-react';
import { PRODUCTS, CATEGORY_INFO, TECHNIQUE_INFO, type ProductCategory, type Product } from '@/lib/products';
import CategoryIcon from '@/components/CategoryIcon';
import { useProducts } from '@/lib/useProducts';

// ─── STATUS OPTIONS ──────────────────────────────
const STATUS_OPTIONS = [
  { value: 1, label: 'Order Placed', color: '#6366f1', bg: '#eef2ff' },
  { value: 2, label: 'Digitizing/Proofing', color: '#f59e0b', bg: '#fffbeb' },
  { value: 3, label: 'In Production', color: '#3b82f6', bg: '#eff6ff' },
  { value: 4, label: 'Quality Check', color: '#8b5cf6', bg: '#f5f3ff' },
  { value: 5, label: 'Shipped', color: '#06b6d4', bg: '#ecfeff' },
  { value: 6, label: 'Delivered', color: '#10b981', bg: '#ecfdf5' }
];

function getStatusInfo(step: number) {
  return STATUS_OPTIONS.find(s => s.value === step) || STATUS_OPTIONS[0];
}

function StatusBadge({ step }: { step: number }) {
  const info = getStatusInfo(step);
  return (
    <span style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}20` }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
      <span style={{ background: info.color }} className="w-1.5 h-1.5 rounded-full" />
      {info.label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div><div className="h-4 w-32 bg-slate-200 rounded mb-2" /><div className="h-3 w-24 bg-slate-100 rounded" /></div>
        <div className="h-6 w-28 bg-slate-100 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><div className="h-3 w-20 bg-slate-100 rounded mb-2" /><div className="h-4 w-40 bg-slate-200 rounded mb-1" /><div className="h-3 w-36 bg-slate-100 rounded" /></div>
        <div><div className="h-3 w-20 bg-slate-100 rounded mb-2" /><div className="h-8 w-full bg-slate-100 rounded" /></div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

// ─── ORDER CARD ──────────────────────────────────
interface OrderCardProps { order: any; saving: string | null; onUpdate: (orderId: string, updates: any) => void; }

function OrderCard({ order, saving, onUpdate }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isSaving = saving === order.order_id;
  const statusInfo = getStatusInfo(order.status_step || 1);

  const cartItems = useMemo(() => {
    if (!order.cart_data) return [];
    try { return JSON.parse(order.cart_data); } catch { return []; }
  }, [order.cart_data]);

  const images = useMemo(() => {
    if (cartItems.length > 0) {
      return cartItems.flatMap((item: any) =>
        [item.frontImage, item.backImage, item.leftImage, item.rightImage].filter(Boolean)
      );
    }
    try {
      return order.image_url?.startsWith('[') ? JSON.parse(order.image_url) : [order.image_url].filter(Boolean);
    } catch { return [order.image_url].filter(Boolean); }
  }, [cartItems, order.image_url]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
      style={{ borderLeft: `4px solid ${statusInfo.color}` }}>
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            {images.length > 0 && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
                <img src={images[0]} alt="Product" className="w-full h-full object-cover" loading="lazy" />
              </div>
            )}
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm tracking-wide">{order.order_id}</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock size={11} />
                {new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold text-slate-900">${order.total_price}</div>
              <div className="text-[11px] text-slate-400">{order.quantity} items</div>
            </div>
            <StatusBadge step={order.status_step || 1} />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Customer</div>
            <div className="text-sm font-semibold text-slate-800">{order.customer_name}</div>
            <div className="text-xs text-slate-500">{order.email}</div>
            {order.phone && <div className="text-xs text-slate-400">{order.phone}</div>}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Update Status</div>
            <select value={order.status_step || 1} onChange={(e) => onUpdate(order.order_id, { status_step: parseInt(e.target.value) })}
              disabled={isSaving}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
              {STATUS_OPTIONS.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
            </select>
            {isSaving && <div className="flex items-center gap-1 mt-1 text-xs text-indigo-500"><RefreshCw size={10} className="animate-spin" /> Saving...</div>}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tracking</div>
            <form className="flex flex-col gap-1.5" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onUpdate(order.order_id, { carrier: fd.get('carrier') as string, tracking_number: fd.get('tracking') as string }); }}>
              <input type="text" name="carrier" placeholder="Carrier (UPS, FedEx...)" defaultValue={order.carrier || ''} className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-colors" />
              <div className="flex gap-1.5">
                <input type="text" name="tracking" placeholder="Tracking #" defaultValue={order.tracking_number || ''} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-colors" />
                <button type="submit" disabled={isSaving} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 shrink-0"><Save size={13} /></button>
              </div>
            </form>
          </div>
        </div>
        {order.instructions && (
          <div className="mt-3 flex items-start gap-2 text-xs bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-100">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <div><span className="font-semibold">Instructions: </span>{order.instructions}</div>
          </div>
        )}
        {order.shipping_address && (
          <div className="mt-2 text-xs text-slate-400 leading-relaxed flex items-center gap-1.5">
            <Package size={13} className="shrink-0 text-slate-400" />
            <span>{order.shipping_address}</span>
          </div>
        )}
      </div>
      {(cartItems.length > 0 || images.length > 1) && (
        <>
          <button onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-400 bg-slate-50/80 border-t border-slate-100 hover:text-slate-600 hover:bg-slate-50 transition-colors">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide' : 'View'} {cartItems.length || images.length} Item{(cartItems.length || images.length) > 1 ? 's' : ''} Details
          </button>
          {expanded && (
            <div className="border-t border-slate-100 bg-slate-50/50 p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cartItems.map((item: any, idx: number) => {
                  let techniqueName = 'Direct Print (DTF)';
                  if (item.technique === 'embroidery') techniqueName = '3D Custom Embroidery';
                  if (item.technique === 'laser') techniqueName = 'Laser Engraved Patch';
                  const itemImages = [item.frontImage, item.backImage, item.leftImage, item.rightImage].filter(Boolean);
                  const sizes = item.quantities ? Object.entries(item.quantities).filter(([_, qty]) => parseInt(qty as string) > 0).map(([size, qty]) => `${size.toUpperCase()}: ${qty}`).join(', ') : '';
                  return (
                    <div key={idx} className="bg-white rounded-xl p-3.5 border border-slate-100">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <span>Item {idx + 1} ·</span>
                        <CategoryIcon category={item.productType === 'hat' ? 'hats' : 'shirts'} size={14} className="text-slate-500" />
                        <span>{techniqueName}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-500">
                        <div><span className="font-medium text-slate-600">Color:</span> {item.shirtColor || 'White'}</div>
                        <div className="flex gap-3 flex-wrap">
                          <span>Front: {item.frontColors?.length > 0 ? '✅' : '—'}</span>
                          <span>Back: {item.backColors?.length > 0 ? '✅' : '—'}</span>
                          <span>Left: {item.leftColors?.length > 0 ? '✅' : '—'}</span>
                          <span>Right: {item.rightColors?.length > 0 ? '✅' : '—'}</span>
                        </div>
                        {sizes && <div><span className="font-medium text-slate-600">Sizes:</span> {sizes}</div>}
                        {item.price && (
                          <div className="font-semibold text-slate-700 pt-1">
                            ${(item.price * Object.values(item.quantities || {}).reduce((sum: number, q: any) => sum + parseInt((q as string) || '0'), 0)).toFixed(2)}
                            <span className="font-normal text-slate-400"> (${item.price.toFixed(2)}/ea)</span>
                          </div>
                        )}
                      </div>
                      {itemImages.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {itemImages.map((img: string, i: number) => (
                            <img key={i} src={img} className="w-14 h-14 object-cover rounded-lg border border-slate-100" loading="lazy" alt={`Design ${i + 1}`} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── PRESET IMAGES FOR EASY PRODUCT CREATION ─────
const PRESET_IMAGES = [
  { label: 'T-Shirt (Black/Colors)', url: '/Shirt/florida-dtf-prints-services.png' },
  { label: 'Classic White Tee', url: '/shirt-front.png' },
  { label: 'Hoodie (Custom)', url: '/Shirt/image.png' },
  { label: 'Crewneck Sweatshirt', url: '/Shirt/image copy.png' },
  { label: 'Youth Tee', url: '/Shirt/image copy 5.png' },
  { label: 'Women Fitted Tee', url: '/Shirt/women.png' },
  { label: 'Custom Jacket', url: '/Shirt/image copy 2.png' },
  { label: 'Embroidered Hat', url: '/Shirt/landing-embroidered-patches.jpg' },
  { label: 'Printed DTF Hat', url: '/Shirt/DTF-Xpress-print-finished-garment.jpg' },
  { label: 'Laser Patch Hat', url: '/Shirt/laser-engraved-erie-pa-patch.webp' },
  { label: 'Custom Jeans (Denim)', url: '/Shirt/custom-jeans.jpg' },
];

// ─── PRODUCTS TAB ────────────────────────────────
function ProductsTab() {
  const {
    products,
    addProduct,
    deleteProduct,
    updateProductImage,
    updateProductImages,
    toggleHomepageVisibility,
    loading: productsLoading,
  } = useProducts();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Multi-Image Modal State
  const [editingImageProduct, setEditingImageProduct] = useState<Product | null>(null);
  const [editGalleryImages, setEditGalleryImages] = useState<string[]>([]);
  const [customEditImageUrl, setCustomEditImageUrl] = useState('');
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  // New Product Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('shirts');
  const [formPrice, setFormPrice] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBadge, setFormBadge] = useState('New');
  const [formTechniques, setFormTechniques] = useState<('print' | 'embroidery' | 'laser')[]>(['print']);
  const [formImages, setFormImages] = useState<string[]>([PRESET_IMAGES[0].url]);
  const [customImageUrl, setCustomImageUrl] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openEditImage = (prod: Product) => {
    setEditingImageProduct(prod);
    const existing = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : [prod.image];
    setEditGalleryImages([...existing]);
    setCustomEditImageUrl('');
  };

  const handleEditMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setEditGalleryImages((prev) => [...prev, loadEvt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddEditImageUrl = () => {
    const trimmed = customEditImageUrl.trim();
    if (!trimmed) return;
    setEditGalleryImages((prev) => [...prev, trimmed]);
    setCustomEditImageUrl('');
  };

  const handleAddPresetToEditGallery = (url: string) => {
    setEditGalleryImages((prev) => [...prev, url]);
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    setEditGalleryImages((prev) => {
      const filtered = prev.filter((_, i) => i !== idxToRemove);
      return filtered.length > 0 ? filtered : [PRESET_IMAGES[0].url];
    });
  };

  const handleSetPrimaryGalleryImage = (idx: number) => {
    setEditGalleryImages((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
    showToast("Selected image is now the main cover!");
  };

  const handleSaveProductImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageProduct) return;
    if (editGalleryImages.length === 0) {
      alert("Please add at least one image.");
      return;
    }
    setIsUpdatingImage(true);
    const primaryCover = editGalleryImages[0];
    const res = await updateProductImages(editingImageProduct.id, editGalleryImages, primaryCover);
    setIsUpdatingImage(false);
    if (res.success) {
      showToast(`Updated ${editGalleryImages.length} images for "${editingImageProduct.name}"!`);
      setEditingImageProduct(null);
    } else {
      alert(res.error || 'Failed to update images');
    }
  };

  const handleNewProductMultiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setFormImages((prev) => [...prev, loadEvt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleAddPresetToNewProduct = (url: string) => {
    setFormImages((prev) => [...prev, url]);
  };

  const handleAddCustomUrlToNewProduct = () => {
    const trimmed = customImageUrl.trim();
    if (!trimmed) return;
    setFormImages((prev) => [...prev, trimmed]);
    setCustomImageUrl('');
  };

  const handleRemoveNewProductImage = (idx: number) => {
    if (formImages.length <= 1) return;
    setFormImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSetPrimaryNewProductImage = (idx: number) => {
    setFormImages((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
  };

  const toggleTechnique = (tech: 'print' | 'embroidery' | 'laser') => {
    if (formTechniques.includes(tech)) {
      if (formTechniques.length === 1) return; // keep at least one
      setFormTechniques(formTechniques.filter(t => t !== tech));
    } else {
      setFormTechniques([...formTechniques, tech]);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      alert('Please fill in product name and price.');
      return;
    }

    setIsSubmitting(true);
    const finalImages = formImages.length > 0 ? formImages : [PRESET_IMAGES[0].url];

    const res = await addProduct({
      name: formName.trim(),
      description: formDesc.trim(),
      category: formCategory,
      priceFrom: parseFloat(formPrice) || 9.99,
      techniques: formTechniques,
      badge: formBadge.trim() || undefined,
      image: finalImages[0],
      images: finalImages,
      href: `/design?product=${formCategory === 'hats' ? 'hat' : 'tshirt'}`,
    });

    setIsSubmitting(false);

    if (res.success) {
      showToast('Product successfully added!');
      setIsAddModalOpen(false);
      // Reset form
      setFormName('');
      setFormPrice('');
      setFormDesc('');
      setFormBadge('New');
      setFormImages([PRESET_IMAGES[0].url]);
      setCustomImageUrl('');
    } else {
      alert(res.error || 'Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    const res = await deleteProduct(id);
    if (res.success) {
      showToast('Product deleted');
    } else {
      alert(res.error || 'Could not delete product');
    }
  };

  const categories: ProductCategory[] = ['shirts', 'hats', 'jeans'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Category Summary Cards with Lucide Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const count = products.filter(p => p.category === cat).length;
          return (
            <div key={cat} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0070f3]">
                  <CategoryIcon category={cat} size={22} />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
                  {count} items
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{info.label}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{info.description}</p>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setCategoryFilter(cat)}
                  className="text-xs font-semibold text-[#0070f3] hover:underline"
                >
                  Filter this category
                </button>
                <a href={`/${cat}`} target="_blank" className="text-xs text-slate-400 hover:text-indigo-500 flex items-center gap-1">
                  View Page <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Bar: Search + Category Filter + Add Product Button */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-[#0070f3] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <CategoryIcon category={cat} size={12} />
                {CATEGORY_INFO[cat].label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0070f3] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              Products ({filteredProducts.length})
            </h3>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0070f3] border border-blue-100">
              Homepage Featured: {products.filter(p => p.showOnHomepage).length}/7 Selected
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {products.length - PRODUCTS.length} custom added
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price From</th>
                <th className="px-4 py-3 text-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Homepage (Max 7)</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isCustom = !PRODUCTS.some(p => p.id === product.id);
                  const isShownOnHome = Boolean(product.showOnHomepage);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => openEditImage(product)}
                            className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 relative cursor-pointer group/img transition-all hover:ring-2 hover:ring-[#0070f3]"
                            title="Click to manage images"
                          >
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                              <ImageIcon size={14} className="text-white" />
                            </div>
                            {product.images && product.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-tl">
                                +{product.images.length}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-slate-900">{product.name}</span>
                              {product.badge && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[#0070f3] text-[9px] font-bold">
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{product.description}</div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                              {product.images?.length || 1} {(product.images?.length || 1) === 1 ? 'image' : 'images'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                          <CategoryIcon category={product.category} size={14} className="text-slate-400" />
                          {CATEGORY_INFO[product.category]?.label || product.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold text-emerald-600">${product.priceFrom.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={async () => {
                            const nextVal = !isShownOnHome;
                            const res = await toggleHomepageVisibility(product.id, nextVal);
                            if (res.success) {
                              showToast(nextVal ? `"${product.name}" added to Homepage showcase!` : `"${product.name}" removed from Homepage.`);
                            } else {
                              alert(res.error || "Failed to update");
                            }
                          }}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                            isShownOnHome
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Click to toggle showing on website homepage"
                        >
                          <span className={`w-2 h-2 rounded-full ${
                            isShownOnHome ? "bg-emerald-500" : "bg-slate-300"
                          }`} />
                          <span>{isShownOnHome ? "Show on Homepage ✓" : "Hidden from Home"}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditImage(product)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0070f3] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            title="Manage product images (upload as many as you want)"
                          >
                            <ImageIcon size={13} />
                            <span>Manage Images ({product.images?.length || 1})</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer shadow-xs"
                            title={`Delete "${product.name}"`}
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── ADD PRODUCT MODAL ───────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
                <p className="text-xs text-slate-400">Item will instantly appear in the Shop and Category pages</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Heavyweight Vintage Fleece Hoodie"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                  >
                    <option value="shirts">Shirts & Apparel</option>
                    <option value="hats">Caps & Hats</option>
                    <option value="jeans">Custom Jeans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price From ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="24.99"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short marketing description of the product..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                />
              </div>

              {/* Badge & Techniques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Badge (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="New / Best Seller / Hot"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Available Techniques
                  </label>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {(['print', 'embroidery', 'laser'] as const).map(tech => {
                      const selected = formTechniques.includes(tech);
                      return (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => toggleTechnique(tech)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            selected
                              ? 'bg-[#0070f3] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {TECHNIQUE_INFO[tech].label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Images (Multiple Supported) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Product Images ({formImages.length})
                  </label>
                  <span className="text-[11px] text-slate-400">First image is main cover</span>
                </div>

                {/* Selected Images Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                  {formImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl bg-white border-2 overflow-hidden p-1 flex flex-col justify-between ${
                        idx === 0 ? 'border-[#0070f3] ring-2 ring-[#0070f3]/20' : 'border-slate-200'
                      }`}
                    >
                      <Image src={img} alt="Preview" fill className="object-contain p-1" />
                      {idx === 0 ? (
                        <span className="absolute top-1 left-1 bg-[#0070f3] text-white text-[8px] font-bold px-1.5 py-0.2 rounded">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryNewProductImage(idx)}
                          className="absolute bottom-1 left-1 text-[8px] font-bold text-[#0070f3] bg-white/90 px-1 rounded hover:underline"
                        >
                          Cover
                        </button>
                      )}
                      {formImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNewProductImage(idx)}
                          className="absolute top-1 right-1 p-0.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors z-10"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Multi-upload & URL input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <label className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 bg-blue-50 hover:bg-blue-100 text-[#0070f3] rounded-xl cursor-pointer transition-colors border border-blue-200">
                    <Upload size={14} />
                    <span>Upload Multiple Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewProductMultiFileUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Paste Image URL"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0070f3]"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomUrlToNewProduct}
                      disabled={!customImageUrl.trim()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl disabled:opacity-40"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5">Add from Presets:</div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddPresetToNewProduct(preset.url)}
                        className="flex flex-col items-center p-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#0070f3] text-center transition-all cursor-pointer"
                      >
                        <div className="w-6 h-6 relative mb-1">
                          <Image src={preset.url} alt={preset.label} fill className="object-contain" />
                        </div>
                        <span className="text-[9px] font-medium text-slate-700 line-clamp-1">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0070f3] hover:bg-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Plus size={14} /> Save Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── CHANGE IMAGE MODAL ──────────────────────── */}
      {editingImageProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Manage Product Gallery</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0070f3] text-xs font-bold">
                    {editGalleryImages.length} {editGalleryImages.length === 1 ? 'image' : 'images'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Product: <span className="font-bold text-slate-800">{editingImageProduct.name}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingImageProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProductImage} className="mt-5 space-y-6">
              {/* Current Images Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Current Photos in Gallery ({editGalleryImages.length})
                  </label>
                  <span className="text-[11px] text-slate-400">
                    The first image is the <strong className="text-slate-700">Main Cover</strong>
                  </span>
                </div>

                {editGalleryImages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                    No images in gallery yet. Add images below.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
                    {editGalleryImages.map((imgUrl, idx) => {
                      const isMain = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`group relative rounded-2xl border-2 overflow-hidden bg-white flex flex-col p-2 transition-all ${
                            isMain
                              ? 'border-[#0070f3] ring-2 ring-[#0070f3]/20 shadow-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2">
                            <Image src={imgUrl} alt={`Image ${idx + 1}`} fill className="object-contain p-1" />
                            {isMain && (
                              <span className="absolute top-1.5 left-1.5 bg-[#0070f3] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                ★ Main Cover
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-1 mt-auto">
                            {!isMain ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryGalleryImage(idx)}
                                className="text-[10px] font-bold text-[#0070f3] hover:underline cursor-pointer"
                              >
                                Set as Cover
                              </button>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400">Cover</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Image"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Add New Images Section */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Add More Images (Select as many as you want)
                </h4>

                {/* 1. Multi-file upload dropzone */}
                <label className="w-full flex flex-col items-center justify-center p-5 border-2 border-dashed border-blue-200 hover:border-[#0070f3] bg-blue-50/40 hover:bg-blue-50/80 rounded-2xl cursor-pointer transition-all text-center group">
                  <div className="w-10 h-10 rounded-full bg-white text-[#0070f3] shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Click to Upload from Device
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Select 1 or multiple files at once (PNG, JPG, WebP)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleEditMultiFileUpload}
                    className="hidden"
                  />
                </label>

                {/* 2. Add by URL */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                    Or Paste Image URL:
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image link: https://example.com/photo.jpg"
                      value={customEditImageUrl}
                      onChange={(e) => setCustomEditImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEditImageUrl();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0070f3]"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditImageUrl}
                      disabled={!customEditImageUrl.trim()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      + Add to Gallery
                    </button>
                  </div>
                </div>

                {/* 3. Quick Presets */}
                <div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
                    Or Click Stock Presets to Add:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-100">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => handleAddPresetToEditGallery(preset.url)}
                        className="flex flex-col items-center p-2 rounded-lg border border-slate-200 bg-white hover:border-[#0070f3] hover:bg-blue-50/50 text-center transition-all cursor-pointer group"
                      >
                        <div className="w-8 h-8 relative mb-1">
                          <Image src={preset.url} alt={preset.label} fill className="object-contain" />
                        </div>
                        <span className="text-[9px] font-medium text-slate-700 line-clamp-1">{preset.label}</span>
                        <span className="text-[9px] font-bold text-[#0070f3] opacity-0 group-hover:opacity-100 mt-0.5">
                          + Add
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Total: <strong className="text-slate-800">{editGalleryImages.length} images</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingImageProduct(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingImage || editGalleryImages.length === 0}
                    className="px-6 py-2.5 rounded-xl bg-[#0070f3] hover:bg-blue-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdatingImage ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" /> Saving Gallery...
                      </>
                    ) : (
                      <>
                        <Save size={14} /> Save Gallery ({editGalleryImages.length} Images)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QUOTES TAB ──────────────────────────────────
function QuotesTab() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/admin-orders?type=quotes');
      const data = await res.json();
      if (data.success) {
        setQuotes(data.quotes || []);
      }
    } catch (err) {
      console.error('Failed to load quotes', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
        <MessageSquare className="mx-auto h-12 w-12 text-slate-200 mb-4" />
        <h3 className="text-base font-semibold text-slate-900 mb-1">No quotes yet</h3>
        <p className="text-sm text-slate-400">Bulk quote requests from customers will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote, idx) => (
        <div key={idx} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-bold text-slate-900">{quote.name}</div>
              <div className="text-xs text-slate-500">{quote.email} {quote.phone && `· ${quote.phone}`}</div>
              {quote.company && <div className="text-xs text-slate-400 mt-1">🏢 {quote.company}</div>}
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">
                {new Date(quote.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Product</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{quote.product_type}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Technique</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{quote.technique}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-slate-400 uppercase">Quantity</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">{quote.quantity} units</div>
            </div>
          </div>
          {quote.notes && (
            <div className="mt-3 text-xs text-slate-500 bg-amber-50 p-3 rounded-xl border border-amber-100">
              <span className="font-semibold text-amber-700">Notes:</span> {quote.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ADMIN PANEL ────────────────────────────
type AdminTab = 'orders' | 'products' | 'quotes';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin-orders');
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setError(data.error);
    } catch { setError('Failed to load orders.'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const updateOrder = async (orderId: string, updates: any) => {
    setSaving(orderId);
    try {
      const res = await fetch('/api/admin-orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: orderId, ...updates }) });
      const data = await res.json();
      if (data.success) setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, ...updates } : o));
      else alert('Failed to update: ' + data.error);
    } catch { alert('Error updating order'); }
    finally { setSaving(null); }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'demirStudioo@') setIsAuthenticated(true);
    else alert('Incorrect password');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !searchQuery || order.order_id?.toLowerCase().includes(searchQuery.toLowerCase()) || order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || order.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === null || order.status_step === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = orders.length;
    const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || '0'), 0);
    const pending = orders.filter(o => (o.status_step || 1) < 5).length;
    const delivered = orders.filter(o => o.status_step === 6).length;
    return { total, revenue, pending, delivered };
  }, [orders]);

  // ─── LOGIN ──────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
              <ShieldCheck size={28} className="text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-slate-400 mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" required placeholder="Password" value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
              autoFocus />
            <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ──────────────────────────────
  const tabs: { key: AdminTab; label: string; icon: any; count?: number }[] = [
    { key: 'orders', label: 'Orders', icon: ClipboardList, count: orders.length },
    { key: 'products', label: 'Products', icon: Tag, count: PRODUCTS.length },
    { key: 'quotes', label: 'Quotes', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Package size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Demir Studio</h1>
              <p className="text-[11px] text-slate-400 -mt-0.5">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
              <ExternalLink size={13} /> View Site
            </a>
            <button onClick={fetchOrders} disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50">
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-xl border border-slate-100 p-1 w-fit">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}>
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <>
            {/* Stats */}
            {!loading && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} color="#6366f1" />
                <StatCard icon={BarChart3} label="Revenue" value={`$${stats.revenue.toFixed(0)}`} color="#10b981" />
                <StatCard icon={Clock} label="In Progress" value={stats.pending} color="#f59e0b" />
                <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered} color="#06b6d4" />
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                <input type="text" placeholder="Search by order ID, name, or email..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300 transition-colors" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={() => setStatusFilter(null)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${statusFilter === null ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
                  All
                </button>
                {STATUS_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setStatusFilter(statusFilter === opt.value ? null : opt.value)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${statusFilter === opt.value ? 'text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                    style={statusFilter === opt.value ? { background: opt.color } : {}}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {!loading && <div className="text-xs text-slate-400 mb-4">Showing {filteredOrders.length} of {orders.length} orders</div>}

            {loading ? (
              <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <Package className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                <h3 className="text-base font-semibold text-slate-900 mb-1">No orders found</h3>
                <p className="text-sm text-slate-400">{searchQuery || statusFilter !== null ? 'Try adjusting your search or filters' : 'Orders will appear here when customers place them'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id || order.order_id} order={order} saving={saving} onUpdate={updateOrder} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'quotes' && <QuotesTab />}
      </main>
    </div>
  );
}
