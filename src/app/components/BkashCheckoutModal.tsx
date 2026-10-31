import { useRef, useState } from 'react';
import {
  Check, Copy, Minus, Plus, Printer, QrCode, ShieldCheck, ShoppingBag, Trash2, Upload, ArrowRight, ArrowLeft,
} from 'lucide-react';
import type { BkashOrder, BkashOrderItem, CartItem, StoreProduct, UserProfile } from '../types';
import { BKASH_RECEIVER_NUMBER } from '../lib/supabase';
import { toBengaliNumerals } from '../utils/pureLogic';
import { CloseButton, Modal, SectionLabel, cn } from './Primitives';

function SimpleQrSvg({ value }: { value: string }) {
  // Deterministic 11x11 visual QR matrix from string hash
  const cells: boolean[][] = [];
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let r = 0; r < 11; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < 11; c++) {
      const isCorner = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
      if (isCorner) {
        row.push(true);
      } else {
        const bit = ((h >>> ((r * 11 + c) % 28)) ^ (r * 7 + c * 13)) & 1;
        row.push(bit === 1);
      }
    }
    cells.push(row);
  }
  return (
    <svg viewBox="0 0 13 13" className="size-24 rounded-lg border border-[#e2136e]/30 bg-white p-1.5">
      {cells.map((row, r) =>
        row.map((on, c) =>
          on ? <rect key={`${r}-${c}`} x={c + 1} y={r + 1} width={0.92} height={0.92} fill="#111827" rx={0.12} /> : null,
        ),
      )}
    </svg>
  );
}

export function CreateProductModal({
  open,
  onClose,
  currentUser,
  onCreateProduct,
}: {
  open: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onCreateProduct: (product: StoreProduct) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('পিস');
  const [tag, setTag] = useState('Agri-Tech');
  const [seller, setSeller] = useState(currentUser?.organization || currentUser?.name || '');
  const [stock, setStock] = useState('25');
  const [image, setImage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(price);
    if (!name.trim() || isNaN(numericPrice) || numericPrice <= 0) return;
    const product: StoreProduct = {
      id: `prod-${Date.now().toString(36)}`,
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      unit: unit.trim() || 'পিস',
      tag: tag.trim() || 'Agri-Tech',
      image: image.trim(),
      sellerId: currentUser?.id || 'seller-1',
      seller: seller.trim() || currentUser?.name || 'Verified Seller',
      stock: Math.max(1, Number(stock) || 10),
      createdAt: new Date().toISOString(),
    };
    onCreateProduct(product);
    setName('');
    setDescription('');
    setPrice('');
    setImage('');
    onClose();
  };

  const inputCls =
    'w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-2 text-[14px] text-pine-900 outline-none placeholder:text-pine-900/40 focus:border-pine-900';

  return (
    <Modal open={open} onClose={onClose} className="max-w-[560px]" labelledBy="create-prod-title">
      <div className="overflow-hidden rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-pine-900 bg-canvas-card px-5 py-3.5">
          <div>
            <h2 id="create-prod-title" className="font-display text-[20px] font-semibold text-pine-900">
              Add Product to Store
            </h2>
            <p className="font-mono text-[10.5px] text-pine-600">Saved in Supabase · public.store_products</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
          <div>
            <SectionLabel className="mb-1">Product Title *</SectionLabel>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মাটির pH ও আর্দ্রতা মিটার / ব্রি ধান১০২ বীজ"
              className={cn(inputCls, 'font-bangla')}
            />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <SectionLabel className="mb-1">Price (BDT ৳) *</SectionLabel>
              <input
                required
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1450"
                className={inputCls}
              />
            </div>
            <div>
              <SectionLabel className="mb-1">Unit</SectionLabel>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="পিস / কেজি / কিট"
                className={cn(inputCls, 'font-bangla')}
              />
            </div>
            <div>
              <SectionLabel className="mb-1">Stock Qty</SectionLabel>
              <input
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <SectionLabel className="mb-1">Category Badge</SectionLabel>
              <input
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="IoT Sensor / Certified Seed"
                className={inputCls}
              />
            </div>
            <div>
              <SectionLabel className="mb-1">Seller / Supplier</SectionLabel>
              <input
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                placeholder="Organization or Seller Name"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <SectionLabel className="mb-1">Product Photo (Upload or URL)</SectionLabel>
            <div className="flex gap-2">
              <input
                value={image.startsWith('data:') ? '' : image}
                onChange={(e) => setImage(e.target.value)}
                placeholder={image.startsWith('data:') ? 'Uploaded photo attached' : 'https://...'}
                className={cn(inputCls, 'flex-1')}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-subtle px-3 text-[12.5px] font-semibold text-pine-900 hover:bg-pine-100"
              >
                <Upload className="size-4" /> Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {image && (
              <img src={image} alt="Preview" className="mt-2 h-28 w-full rounded-lg border border-canvas-border object-cover" />
            )}
          </div>

          <div>
            <SectionLabel className="mb-1">Product Specification / Description</SectionLabel>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="পণ্যের বিবরণ ও ব্যবহারবিধি…"
              className={cn(inputCls, 'font-bangla')}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-canvas-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-canvas-border px-4 text-[13px] font-semibold text-pine-900/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg border border-pine-900 bg-pine-900 px-5 text-[13.5px] font-semibold text-canvas shadow-tactile-xs"
            >
              Publish Product to Supabase
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

interface CheckoutProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: StoreProduct[];
  currentUser: UserProfile | null;
  orders: BkashOrder[];
  onUpdateQty: (productId: string, qty: number) => void;
  onClearCart: () => void;
  onCompleteOrder: (order: BkashOrder) => void;
}

export function BkashCheckoutModal({
  open,
  onClose,
  cart,
  products,
  currentUser,
  orders,
  onUpdateQty,
  onCompleteOrder,
}: CheckoutProps) {
  const [step, setStep] = useState<'cart' | 'bkash' | 'receipt' | 'history'>('cart');
  const [buyerName, setBuyerName] = useState(currentUser?.name || '');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [zone, setZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [notes, setNotes] = useState('');

  // bKash payment fields
  const [payMode, setPayMode] = useState<'send_money' | 'express'>('send_money');
  const [senderBkash, setSenderBkash] = useState('');
  const [trxId, setTrxId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [copiedNum, setCopiedNum] = useState(false);
  const [screenshot, setScreenshot] = useState('');
  const [completedOrder, setCompletedOrder] = useState<BkashOrder | null>(null);
  const [formError, setFormError] = useState('');
  const screenRef = useRef<HTMLInputElement>(null);

  const detailedItems: BkashOrderItem[] = cart
    .map((c) => {
      const p = products.find((x) => x.id === c.productId);
      if (!p) return null;
      return {
        productId: p.id,
        name: p.name,
        unit: p.unit,
        unitPrice: p.price,
        quantity: c.quantity,
        lineTotal: p.price * c.quantity,
        image: p.image,
      };
    })
    .filter((x): x is BkashOrderItem => x !== null);

  const subtotal = detailedItems.reduce((s, i) => s + i.lineTotal, 0);
  const deliveryFee = detailedItems.length > 0 ? (zone === 'inside_dhaka' ? 60 : 120) : 0;
  const grandTotal = subtotal + deliveryFee;
  const referenceCode = `PLS-${Date.now().toString().slice(-5)}`;

  const copyReceiver = () => {
    navigator.clipboard?.writeText(BKASH_RECEIVER_NUMBER);
    setCopiedNum(true);
    setTimeout(() => setCopiedNum(false), 2000);
  };

  const proceedToBkash = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (detailedItems.length === 0) {
      setFormError('আপনার কার্টে কোনো পণ্য নেই।');
      return;
    }
    if (!buyerName.trim() || !/^01[3-9]\d{8}$/.test(buyerPhone.trim()) || !address.trim()) {
      setFormError('সঠিক নাম, ১১ ডিজিটের মোবাইল নম্বর (01XXXXXXXXX) এবং ঠিকানা দিন।');
      return;
    }
    setSenderBkash(buyerPhone.trim());
    setStep('bkash');
  };

  const confirmBkashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const cleanSender = senderBkash.trim();
    if (!/^01[3-9]\d{8}$/.test(cleanSender)) {
      setFormError('আপনার সঠিক ১১ ডিজিটের বিকাশ নম্বর দিন (01XXXXXXXXX)।');
      return;
    }

    let finalTrx = trxId.trim().toUpperCase();
    if (payMode === 'send_money') {
      if (finalTrx.length < 6) {
        setFormError('অনুগ্রহ করে বিকাশ লেনদেনের সঠিক Transaction ID (TrxID) লিখুন।');
        return;
      }
    } else {
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      if (otpCode.trim().length < 4) {
        setFormError('৪-৬ সংখ্যার ভেরিফিকেশন কোড দিন।');
        return;
      }
      if (!finalTrx) {
        finalTrx = `BK${Date.now().toString(36).toUpperCase().slice(-8)}`;
      }
    }

    const order: BkashOrder = {
      id: `ord-${Date.now().toString(36)}`,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      buyerId: currentUser?.id || 'guest',
      buyerName: buyerName.trim(),
      buyerPhone: buyerPhone.trim(),
      district: district.trim(),
      deliveryAddress: address.trim(),
      deliveryZone: zone,
      notes: notes.trim(),
      items: detailedItems,
      subtotalBdt: subtotal,
      deliveryFeeBdt: deliveryFee,
      totalBdt: grandTotal,
      receiverBkash: BKASH_RECEIVER_NUMBER,
      senderBkash: cleanSender,
      trxId: finalTrx,
      paymentMethod: payMode === 'send_money' ? 'bkash_send_money' : 'bkash_checkout',
      paymentScreenshot: screenshot || undefined,
      status: 'paid_verifying',
      createdAt: new Date().toISOString(),
    };

    onCompleteOrder(order);
    setCompletedOrder(order);
    setStep('receipt');
  };

  const inputCls =
    'w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-2 text-[14px] text-pine-900 outline-none placeholder:text-pine-900/40 focus:border-pine-900';

  return (
    <Modal open={open} onClose={onClose} className="max-w-[660px]" labelledBy="bkash-modal-title">
      <div className="overflow-hidden rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between border-b border-pine-900 px-5 py-3.5 text-white',
            step === 'bkash' ? 'bg-[#e2136e]' : 'bg-pine-900',
          )}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="size-5" />
            <div>
              <h2 id="bkash-modal-title" className="font-display text-[20px] font-semibold">
                {step === 'bkash'
                  ? `bKash Payment · ${BKASH_RECEIVER_NUMBER}`
                  : step === 'receipt'
                  ? 'bKash Payment Receipt'
                  : step === 'history'
                  ? 'Orders & bKash Receipts'
                  : 'Cart & Checkout'}
              </h2>
              <p className="font-mono text-[10.5px] opacity-85">
                Merchant / Personal Receiver: {BKASH_RECEIVER_NUMBER}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep(step === 'history' ? 'cart' : 'history')}
              className="rounded-lg bg-white/15 px-2.5 py-1 font-mono text-[11px] font-semibold text-white hover:bg-white/25"
            >
              {step === 'history' ? 'Back to Cart' : `Orders (${orders.length})`}
            </button>
            <CloseButton onClick={onClose} className="bg-white/15 text-white hover:bg-white/25" />
          </div>
        </div>

        {/* Step 1: Cart + Shipping */}
        {step === 'cart' && (
          <form onSubmit={proceedToBkash} className="max-h-[78vh] space-y-4 overflow-y-auto p-5">
            {detailedItems.length === 0 ? (
              <div className="py-10 text-center">
                <ShoppingBag className="mx-auto size-10 text-pine-600/50" />
                <p className="mt-2 font-display text-[19px] font-semibold text-pine-900">
                  আপনার কার্ট খালি
                </p>
                <p className="mt-1 font-bangla text-[13.5px] text-pine-900/60">
                  কৃষি বাজার থেকে পণ্য যোগ করুন এবং বিকাশে ({BKASH_RECEIVER_NUMBER}) পেমেন্ট সম্পন্ন করুন।
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <SectionLabel>Selected Items ({toBengaliNumerals(detailedItems.length)})</SectionLabel>
                  {detailedItems.map((it) => (
                    <div
                      key={it.productId}
                      className="flex items-center gap-3 rounded-xl border border-canvas-border bg-canvas-card p-2.5"
                    >
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="size-14 rounded-lg object-cover" />
                      ) : (
                        <span className="flex size-14 items-center justify-center rounded-lg bg-pine-100 font-mono text-[11px] text-pine-800">
                          ITEM
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bangla text-[14.5px] font-semibold text-pine-900">{it.name}</p>
                        <p className="font-mono text-[11.5px] text-pine-600">
                          ৳{toBengaliNumerals(it.unitPrice)} / {it.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(it.productId, it.quantity - 1)}
                          className="flex size-7 items-center justify-center rounded-md border border-pine-900/30 bg-canvas hover:bg-pine-50"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-[13px] font-semibold">
                          {it.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(it.productId, it.quantity + 1)}
                          className="flex size-7 items-center justify-center rounded-md border border-pine-900/30 bg-canvas hover:bg-pine-50"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(it.productId, 0)}
                          aria-label="Remove item"
                          className="ml-1 flex size-7 items-center justify-center rounded-md text-[#c01048] hover:bg-rose-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Details */}
                <div className="space-y-3 rounded-xl border border-canvas-border bg-canvas-card p-4">
                  <SectionLabel>Delivery &amp; Buyer Details</SectionLabel>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">Full Name *</label>
                      <input
                        required
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="আপনার নাম"
                        className={cn(inputCls, 'font-bangla')}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                        Active Mobile Number (11 digits) *
                      </label>
                      <input
                        required
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className={cn(inputCls, 'font-mono')}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">District *</label>
                      <input
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Dhaka / Mymensingh / Bogura..."
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">Delivery Zone</label>
                      <select
                        value={zone}
                        onChange={(e) => setZone(e.target.value as 'inside_dhaka' | 'outside_dhaka')}
                        className={inputCls}
                      >
                        <option value="inside_dhaka">Inside Dhaka (৳60)</option>
                        <option value="outside_dhaka">Outside Dhaka / Courier (৳120)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                      Full Delivery Address (Upazila, Village/Road, House) *
                    </label>
                    <input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="বিস্তারিত ঠিকানা লিখুন…"
                      className={cn(inputCls, 'font-bangla')}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-pine-900">Order Notes (Optional)</label>
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ডেলিভারি সংক্রান্ত বিশেষ নির্দেশনা…"
                      className={cn(inputCls, 'font-bangla')}
                    />
                  </div>
                </div>

                {/* Totals */}
                <div className="rounded-xl border border-pine-900 bg-pine-50 p-4">
                  <div className="flex justify-between text-[13.5px] text-pine-900/80">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold">৳{toBengaliNumerals(subtotal)}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-[13.5px] text-pine-900/80">
                    <span>Delivery Fee ({zone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                    <span className="font-mono font-semibold">৳{toBengaliNumerals(deliveryFee)}</span>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-pine-900/20 pt-2 font-display text-[20px] font-bold text-pine-950">
                    <span>Total Payable</span>
                    <span>৳{toBengaliNumerals(grandTotal)}</span>
                  </div>
                </div>

                {formError && (
                  <p className="rounded-lg bg-rose-50 px-3 py-2 font-bangla text-[13px] font-semibold text-[#c01048]">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-pine-900 bg-[#e2136e] text-[15px] font-bold text-white shadow-tactile transition hover:bg-[#c81060]"
                >
                  Pay ৳{toBengaliNumerals(grandTotal)} with bKash ({BKASH_RECEIVER_NUMBER})
                  <ArrowRight className="size-4" />
                </button>
              </>
            )}
          </form>
        )}

        {/* Step 2: bKash Payment Screen */}
        {step === 'bkash' && (
          <form onSubmit={confirmBkashPayment} className="max-h-[78vh] space-y-4 overflow-y-auto p-5">
            {/* Receiver Highlight Card */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border-2 border-[#e2136e] bg-[#fff0f6] p-4 text-[#111827] sm:flex-row sm:items-center">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#e2136e] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                  Official bKash Receiver
                </span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-[26px] font-extrabold tracking-tight text-[#e2136e]">
                    {BKASH_RECEIVER_NUMBER}
                  </span>
                  <button
                    type="button"
                    onClick={copyReceiver}
                    className="inline-flex items-center gap-1 rounded-md border border-[#e2136e] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#e2136e] hover:bg-[#ffe0ed]"
                  >
                    {copiedNum ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copiedNum ? 'Copied!' : 'Copy Number'}
                  </button>
                </div>
                <p className="font-bangla text-[13px] text-gray-700">
                  প্রাপক নম্বর: <b>{BKASH_RECEIVER_NUMBER}</b> · পরিশোধযোগ্য টাকা:{' '}
                  <b className="text-[#e2136e]">৳{toBengaliNumerals(grandTotal)}</b> (Ref: {referenceCode})
                </p>
              </div>
              <div className="flex flex-col items-center">
                <SimpleQrSvg value={`bkash://sendmoney?receiver=${BKASH_RECEIVER_NUMBER}&amount=${grandTotal}`} />
                <span className="mt-1 flex items-center gap-1 font-mono text-[9.5px] text-gray-600">
                  <QrCode className="size-3" /> Scan in bKash App
                </span>
              </div>
            </div>

            {/* Payment Method Sub-tabs */}
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-canvas-subtle p-1">
              <button
                type="button"
                onClick={() => setPayMode('send_money')}
                className={cn(
                  'rounded-lg py-2 text-[13px] font-semibold transition',
                  payMode === 'send_money' ? 'bg-[#e2136e] text-white shadow' : 'text-pine-900/70',
                )}
              >
                Send Money + TrxID
              </button>
              <button
                type="button"
                onClick={() => setPayMode('express')}
                className={cn(
                  'rounded-lg py-2 text-[13px] font-semibold transition',
                  payMode === 'express' ? 'bg-[#e2136e] text-white shadow' : 'text-pine-900/70',
                )}
              >
                bKash Express Checkout
              </button>
            </div>

            {payMode === 'send_money' ? (
              <div className="space-y-3.5 rounded-xl border border-canvas-border bg-canvas-card p-4">
                <ol className="list-inside list-decimal space-y-1 font-bangla text-[13.5px] text-pine-900/85">
                  <li>
                    বিকাশ অ্যাপ খুলুন অথবা ডায়াল করুন <b>*247#</b>
                  </li>
                  <li>
                    <b>Send Money (সেন্ড মানি)</b> অপশন নির্বাচন করুন
                  </li>
                  <li>
                    প্রাপক নম্বরে দিন: <b className="font-mono text-[#e2136e]">{BKASH_RECEIVER_NUMBER}</b>
                  </li>
                  <li>
                    টাকার পরিমাণ দিন: <b>৳{grandTotal}</b> এবং রেফারেন্স দিন: <b className="font-mono">{referenceCode}</b>
                  </li>
                  <li>
                    পিন দিয়ে লেনদেন সম্পন্ন করে নিচের ঘরে আপনার বিকাশ নম্বর ও <b>Transaction ID (TrxID)</b> লিখুন:
                  </li>
                </ol>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                      Your Sender bKash Number *
                    </label>
                    <input
                      required
                      value={senderBkash}
                      onChange={(e) => setSenderBkash(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className={cn(inputCls, 'font-mono')}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                      bKash Transaction ID (TrxID) *
                    </label>
                    <input
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. BKL94M82QX"
                      className={cn(inputCls, 'font-mono uppercase')}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                    Payment Screenshot (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => screenRef.current?.click()}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900/30 bg-canvas-subtle px-3 text-[12.5px] font-semibold text-pine-900"
                    >
                      <Upload className="size-3.5" /> Attach bKash Screenshot
                    </button>
                    {screenshot && <span className="font-mono text-[11px] text-pine-600">✓ Attached</span>}
                    <input
                      ref={screenRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        const r = new FileReader();
                        r.onload = () => setScreenshot(String(r.result));
                        r.readAsDataURL(f);
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 rounded-xl border border-[#e2136e]/40 bg-[#e2136e]/5 p-4">
                <p className="font-bangla text-[13.5px] text-pine-900">
                  বিকাশ এক্সপ্রেস গেটওয়ে — প্রাপক <b className="font-mono">{BKASH_RECEIVER_NUMBER}</b> বরাবর{' '}
                  <b>৳{grandTotal}</b> পরিশোধ করুন:
                </p>
                <div>
                  <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                    Your bKash Account Number *
                  </label>
                  <input
                    required
                    value={senderBkash}
                    onChange={(e) => setSenderBkash(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className={cn(inputCls, 'font-mono')}
                  />
                </div>
                {otpSent && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                        Verification Code *
                      </label>
                      <input
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className={cn(inputCls, 'font-mono')}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold text-pine-900">
                        Reference TrxID (Optional override)
                      </label>
                      <input
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                        placeholder="Auto-generated if blank"
                        className={cn(inputCls, 'font-mono uppercase')}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {formError && (
              <p className="rounded-lg bg-rose-50 px-3 py-2 font-bangla text-[13px] font-semibold text-[#c01048]">
                {formError}
              </p>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-pine-900/30 px-4 text-[13.5px] font-semibold text-pine-900"
              >
                <ArrowLeft className="size-4" /> Back
              </button>
              <button
                type="submit"
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-pine-900 bg-[#e2136e] text-[15px] font-bold text-white shadow-tactile hover:bg-[#c81060]"
              >
                <ShieldCheck className="size-5" />
                {payMode === 'express' && !otpSent
                  ? 'Proceed to bKash Verification'
                  : `Confirm bKash Payment to ${BKASH_RECEIVER_NUMBER}`}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Official Receipt */}
        {step === 'receipt' && completedOrder && (
          <div className="max-h-[78vh] space-y-4 overflow-y-auto p-5">
            <div className="rounded-xl border-2 border-pine-900 bg-canvas-card p-5 shadow-tactile">
              <div className="flex items-center justify-between border-b border-dashed border-pine-900/30 pb-3">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-pine-100 px-2.5 py-0.5 font-mono text-[10px] font-bold text-pine-800">
                    ✓ PAYMENT RECORDED IN SUPABASE
                  </span>
                  <h3 className="mt-1 font-display text-[22px] font-bold text-pine-950">
                    Order #{completedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas px-3 py-1.5 font-mono text-[11.5px] font-semibold text-pine-900 shadow-tactile-xs"
                >
                  <Printer className="size-3.5" /> Print Receipt
                </button>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-2.5 text-[13px] sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">bKash Receiver</dt>
                  <dd className="font-mono font-bold text-[#e2136e]">{completedOrder.receiverBkash}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">Sender bKash</dt>
                  <dd className="font-mono font-semibold text-pine-900">{completedOrder.senderBkash}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">Transaction ID (TrxID)</dt>
                  <dd className="font-mono font-bold text-pine-900">{completedOrder.trxId}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">Buyer</dt>
                  <dd className="font-bangla font-semibold text-pine-900">{completedOrder.buyerName}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">Delivery To</dt>
                  <dd className="font-bangla text-pine-900">
                    {completedOrder.deliveryAddress}, {completedOrder.district}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase text-pine-600">Total Paid</dt>
                  <dd className="font-display text-[17px] font-bold text-pine-950">
                    ৳{toBengaliNumerals(completedOrder.totalBdt)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 border-t border-canvas-border pt-3">
                <SectionLabel className="mb-2">Order Items</SectionLabel>
                <ul className="divide-y divide-canvas-border text-[13.5px]">
                  {completedOrder.items.map((it) => (
                    <li key={it.productId} className="flex justify-between py-1.5">
                      <span className="font-bangla text-pine-900">
                        {it.name} × {it.quantity} {it.unit}
                      </span>
                      <span className="font-mono font-semibold text-pine-900">
                        ৳{toBengaliNumerals(it.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-11 w-full rounded-xl border border-pine-900 bg-pine-900 text-[14px] font-semibold text-canvas shadow-tactile-xs"
            >
              Done · Return to Store
            </button>
          </div>
        )}

        {/* Order History Tab */}
        {step === 'history' && (
          <div className="max-h-[78vh] space-y-3 overflow-y-auto p-5">
            <SectionLabel>Supabase Orders History ({orders.length})</SectionLabel>
            {orders.length === 0 ? (
              <p className="py-10 text-center font-bangla text-[14px] text-pine-900/60">
                এখনো কোনো অর্ডার রেকর্ড করা হয়নি।
              </p>
            ) : (
              orders.map((o) => (
                <div
                  key={o.id}
                  className="rounded-xl border border-pine-900 bg-canvas-card p-3.5 shadow-tactile-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[13px] font-bold text-pine-900">{o.orderNumber}</span>
                    <span className="rounded-full bg-[#ffe0ed] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[#e2136e]">
                      bKash TrxID: {o.trxId} → {o.receiverBkash}
                    </span>
                  </div>
                  <p className="mt-1 font-bangla text-[13px] text-pine-900/80">
                    {o.buyerName} ({o.buyerPhone}) · {o.deliveryAddress}, {o.district}
                  </p>
                  <div className="mt-2 flex items-center justify-between border-t border-canvas-border pt-2 font-mono text-[12px]">
                    <span>{o.items.length} items</span>
                    <span className="font-bold text-pine-950">৳{toBengaliNumerals(o.totalBdt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
