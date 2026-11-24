"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Home,
  Landmark,
  MapPin,
  Package,
  Plus,
  Smartphone,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { medicineById } from "@/data/medicines";
import { deliveryOptions, savedAddresses } from "@/data/orders";
import { cx, formatFee } from "@/lib/format";
import { clearCart, useCart } from "@/store/cart";
import { placeOrder } from "@/store/orders";
import { pushNotification } from "@/store/notifications";
import { Card, CardTitle, EmptyState } from "@/components/ui/Surfaces";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { OptionCards, TextField } from "@/components/ui/Field";
import { ProductVisual } from "@/components/pharmacy/ProductVisual";
import { useToast } from "@/components/providers/ToastProvider";
import type { Address, DeliverySpeed, PaymentMethod } from "@/types";

const STEPS = ["Cart", "Address", "Delivery", "Payment", "Review", "Confirmed"];

const slots = ["8 AM – 10 AM", "10 AM – 12 PM", "2 PM – 4 PM", "5 PM – 7 PM", "7 PM – 9 PM"];

const payments: { value: PaymentMethod; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "upi", label: "UPI", description: "Pay with any UPI app", icon: <Smartphone size={18} /> },
  { value: "card", label: "Card", description: "Credit or debit card", icon: <CreditCard size={18} /> },
  { value: "wallet", label: "Wallet", description: "Balance ₹1,250", icon: <Wallet size={18} /> },
  { value: "cod", label: "Cash on delivery", description: "Pay the rider", icon: <Banknote size={18} /> },
  { value: "netbanking", label: "Net banking", description: "All major banks", icon: <Landmark size={18} /> },
];

export function CheckoutFlow() {
  const cart = useCart();
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>(savedAddresses);
  const [addressId, setAddressId] = useState(savedAddresses[0].id);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    label: "Home" as Address["label"],
    name: "",
    line1: "",
    landmark: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [speed, setSpeed] = useState<DeliverySpeed>("standard");
  const [slot, setSlot] = useState(slots[1]);
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [state, setState] = useState<"idle" | "processing" | "failed">("idle");
  const [orderId, setOrderId] = useState<string | null>(null);

  const address = addresses.find((a) => a.id === addressId) ?? addresses[0];
  const speedOption = deliveryOptions.find((d) => d.id === speed) ?? deliveryOptions[0];
  const deliveryFee = cart.subtotal >= 499 && speed === "standard" ? 0 : speedOption.fee;
  const total = Math.max(0, cart.subtotal - cart.discount + deliveryFee + cart.tax);

  if (cart.lines.length === 0 && step < 5) {
    return (
      <EmptyState
        icon={<Package size={22} />}
        title="There's nothing to check out"
        body="Add some items to your cart and come back when you're ready."
        action={<ButtonLink href="/pharmacy">Browse the pharmacy</ButtonLink>}
      />
    );
  }

  const saveAddress = () => {
    const errors: Record<string, string> = {};
    if (draft.name.trim().length < 2) errors.name = "Enter the recipient's name.";
    if (draft.line1.trim().length < 6) errors.line1 = "Enter the full street address.";
    if (draft.city.trim().length < 2) errors.city = "Enter a city.";
    if (!/^\d{6}$/.test(draft.pincode.trim())) errors.pincode = "PIN codes are 6 digits.";
    if (!/^[+\d][\d\s-]{8,}$/.test(draft.phone.trim())) errors.phone = "Enter a contact number.";
    setAddressErrors(errors);
    if (Object.keys(errors).length) return;

    const created: Address = { id: `addr-${addresses.length + 1}`, ...draft };
    setAddresses([...addresses, created]);
    setAddressId(created.id);
    setAdding(false);
    setDraft({ label: "Home", name: "", line1: "", landmark: "", city: "", pincode: "", phone: "" });
    toast("success", "Address saved", `${created.label} · ${created.city}`);
  };

  const confirm = () => {
    setState("processing");
    window.setTimeout(() => {
      if (payment === "card" && address.pincode.endsWith("3")) {
        setState("failed");
        return;
      }
      const id = `MH-ORD-${48300 + cart.count * 7 + cart.subtotal % 97}`;
      placeOrder({
        id,
        placedAt: "Just now",
        stage: "placed",
        items: cart.lines.map((l) => ({ medicineId: l.id, quantity: l.quantity })),
        subtotal: cart.subtotal,
        discount: cart.discount,
        deliveryFee,
        tax: cart.tax,
        total,
        address,
        speed,
        payment: payment ?? "upi",
        paid: payment !== "cod",
        rider: { name: "Mahesh K.", vehicle: "Scooter · KA 05 HJ 2210", phone: "+91 98860 77121" },
        eta: speed === "express" ? "Within 3 hours" : speed === "scheduled" ? `Tomorrow, ${slot}` : "Tomorrow, by 6 PM",
      });
      pushNotification({
        id: `n-${id}`,
        kind: "order",
        title: "Order placed",
        body: `${id} · ${cart.count} items, ${formatFee(total)}.`,
        time: "Just now",
        read: false,
        href: `/orders/${id}/tracking`,
      });
      setOrderId(id);
      clearCart();
      setState("idle");
      setStep(5);
      toast("success", "Order placed", id);
    }, 1700);
  };

  const canAdvance = () => {
    if (step === 1) return Boolean(address) && !adding;
    if (step === 3) return Boolean(payment);
    return true;
  };

  return (
    <div>
      <Stepper steps={STEPS} current={step} onJump={step < 4 ? setStep : undefined} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <Card>
                  <CardTitle
                    action={
                      <Link href="/cart" className="text-sm font-semibold text-electric hover:underline">
                        Edit cart
                      </Link>
                    }
                  >
                    Review your items
                  </CardTitle>
                  <ul className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                    {cart.lines.map((line) => {
                      const item = medicineById[line.id];
                      if (!item) return null;
                      return (
                        <li key={line.id} className="flex items-center gap-4 py-4 first:pt-0">
                          <ProductVisual item={item} size="sm" className="h-16 w-16 shrink-0 rounded-xl" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-ink">{item.name}</p>
                            <p className="text-xs text-ink-faint">
                              {item.packSize} · Qty {line.quantity}
                            </p>
                          </div>
                          <p className="shrink-0 font-semibold text-ink tnum">
                            {formatFee(item.price * line.quantity)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              )}

              {step === 1 && (
                <Card>
                  <CardTitle
                    action={
                      !adding && (
                        <button
                          type="button"
                          onClick={() => setAdding(true)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric hover:underline"
                        >
                          <Plus size={14} />
                          Add new
                        </button>
                      )
                    }
                  >
                    Delivery address
                  </CardTitle>

                  {adding ? (
                    <div className="space-y-5">
                      <div>
                        <p className="mb-2.5 text-xs font-semibold text-ink-soft">Address type</p>
                        <div className="flex gap-1.5">
                          {(["Home", "Office", "Other"] as const).map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setDraft({ ...draft, label })}
                              aria-pressed={draft.label === label}
                              className={cx(
                                "rounded-chip px-4 py-2 text-sm font-semibold transition-colors",
                                draft.label === label
                                  ? "bg-electric text-white"
                                  : "bg-ice text-ink-soft hover:bg-ice-deep",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField
                          label="Recipient name"
                          required
                          value={draft.name}
                          error={addressErrors.name}
                          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                        />
                        <TextField
                          label="Phone"
                          required
                          value={draft.phone}
                          error={addressErrors.phone}
                          placeholder="+91 98450 11234"
                          onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                        />
                        <div className="sm:col-span-2">
                          <TextField
                            label="Flat, building, street"
                            required
                            value={draft.line1}
                            error={addressErrors.line1}
                            onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
                          />
                        </div>
                        <TextField
                          label="Landmark"
                          hint="Optional"
                          value={draft.landmark}
                          onChange={(e) => setDraft({ ...draft, landmark: e.target.value })}
                        />
                        <TextField
                          label="City"
                          required
                          value={draft.city}
                          error={addressErrors.city}
                          onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                        />
                        <TextField
                          label="PIN code"
                          required
                          inputMode="numeric"
                          value={draft.pincode}
                          error={addressErrors.pincode}
                          onChange={(e) => setDraft({ ...draft, pincode: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={saveAddress}>Save address</Button>
                        <Button variant="secondary" onClick={() => setAdding(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((option) => (
                        <label
                          key={option.id}
                          className={cx(
                            "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-all",
                            addressId === option.id
                              ? "border-electric bg-[color-mix(in_oklab,var(--color-electric)_6%,white)]"
                              : "hairline hover:border-electric/40",
                          )}
                        >
                          <input
                            type="radio"
                            name="address"
                            checked={addressId === option.id}
                            onChange={() => setAddressId(option.id)}
                            className="sr-only"
                          />
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ice text-ink-soft">
                            {option.label === "Home" ? <Home size={17} /> : <MapPin size={17} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-ink">{option.label}</span>
                              <span className="text-xs text-ink-faint">{option.name}</span>
                            </span>
                            <span className="mt-1 block text-sm text-ink-soft">
                              {option.line1}, {option.city} {option.pincode}
                            </span>
                            {option.landmark && (
                              <span className="mt-0.5 block text-xs text-ink-faint">
                                Landmark: {option.landmark}
                              </span>
                            )}
                            <span className="mt-1 block text-xs text-ink-faint">{option.phone}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </Card>
              )}

              {step === 2 && (
                <Card>
                  <CardTitle>Delivery speed</CardTitle>
                  <OptionCards
                    name="delivery"
                    value={speed}
                    onChange={setSpeed}
                    columns={1}
                    options={deliveryOptions.map((option) => ({
                      value: option.id,
                      label: option.label,
                      description: `${option.eta} · ${
                        option.id === "standard" && cart.subtotal >= 499
                          ? "Free on this order"
                          : option.fee === 0
                            ? "No extra charge"
                            : formatFee(option.fee)
                      }`,
                      icon: <Truck size={18} />,
                    }))}
                  />

                  {speed === "scheduled" && (
                    <div className="mt-6 border-t hairline pt-6">
                      <p className="mb-3 text-xs font-semibold text-ink-soft">Pick a window</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {slots.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setSlot(option)}
                            aria-pressed={slot === option}
                            className={cx(
                              "rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                              slot === option
                                ? "border-electric bg-electric text-white"
                                : "hairline bg-white text-ink hover:border-electric",
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              )}

              {step === 3 && (
                <Card>
                  <CardTitle>Payment method</CardTitle>
                  <OptionCards
                    name="payment"
                    value={payment}
                    onChange={setPayment}
                    columns={2}
                    options={payments}
                  />
                  <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-ink-soft">
                    Payments are simulated. No card is charged and no payment provider is contacted.
                  </p>
                </Card>
              )}

              {step === 4 && (
                <Card>
                  {state === "processing" ? (
                    <div className="py-14 text-center">
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ice">
                        <span className="h-7 w-7 animate-spin rounded-full border-2 border-electric border-t-transparent" />
                      </span>
                      <h2 className="mt-6 text-lg font-semibold text-ink">Placing your order</h2>
                      <p className="mt-2 text-sm text-ink-soft">
                        Confirming stock and notifying the pharmacy.
                      </p>
                    </div>
                  ) : state === "failed" ? (
                    <div className="py-10 text-center">
                      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-coral)_12%,white)] text-coral">
                        <XCircle size={30} />
                      </span>
                      <h2 className="mt-6 text-lg font-semibold text-ink">Payment declined</h2>
                      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                        Nothing was charged and your cart is intact. Try a different method.
                      </p>
                      <div className="mt-6 flex flex-wrap justify-center gap-2">
                        <Button onClick={() => setState("idle")}>Try again</Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setPayment("cod");
                            setState("idle");
                          }}
                        >
                          Pay cash on delivery
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle>Review your order</CardTitle>
                      <dl className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                        <Row label="Items" value={`${cart.count} products`} />
                        <Row
                          label="Deliver to"
                          value={`${address.label} · ${address.line1}, ${address.city} ${address.pincode}`}
                        />
                        <Row
                          label="Delivery"
                          value={
                            speed === "scheduled"
                              ? `Scheduled · ${slot}`
                              : `${speedOption.label} · ${speedOption.eta}`
                          }
                        />
                        <Row
                          label="Payment"
                          value={payments.find((p) => p.value === payment)?.label ?? "UPI"}
                        />
                      </dl>

                      <Button className="mt-6 w-full" size="lg" onClick={confirm}>
                        {payment === "cod" ? "Place order" : `Pay ${formatFee(total)}`}
                      </Button>
                    </>
                  )}
                </Card>
              )}

              {step === 5 && orderId && (
                <Card className="text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color-mix(in_oklab,var(--color-mint)_14%,white)] text-mint">
                    <CheckCircle2 size={32} />
                  </span>
                  <h2 className="mt-6 font-display text-2xl font-bold text-ink">Order placed</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
                    The pharmacy is preparing your order. You&rsquo;ll get an update at every step.
                  </p>

                  <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-ice px-4 py-2 text-sm font-semibold text-ink">
                    Order number
                    <span className="font-display tracking-wide text-electric tnum">{orderId}</span>
                  </p>

                  <dl className="mt-6 divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)] text-left">
                    <Row label="Delivering to" value={`${address.line1}, ${address.city} ${address.pincode}`} />
                    <Row
                      label="Estimated delivery"
                      value={speed === "express" ? "Within 3 hours" : speed === "scheduled" ? `Tomorrow, ${slot}` : "Tomorrow, by 6 PM"}
                    />
                    <Row
                      label="Payment"
                      value={
                        payment === "cod"
                          ? `${formatFee(total)} payable on delivery`
                          : `${formatFee(total)} paid`
                      }
                    />
                  </dl>

                  <div className="mt-7 grid gap-2 sm:grid-cols-2">
                    <ButtonLink href={`/orders/${orderId}/tracking`}>Track order</ButtonLink>
                    <ButtonLink href="/pharmacy" variant="secondary">
                      Continue shopping
                    </ButtonLink>
                  </div>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 4 && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button size="lg" disabled={!canAdvance()} onClick={() => setStep((s) => s + 1)}>
                Continue
                <ArrowRight size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        {step < 5 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardTitle>Summary</CardTitle>
              <dl className="space-y-2.5 text-sm">
                <Mini label={`Subtotal (${cart.count})`} value={formatFee(cart.subtotal)} />
                {cart.discount > 0 && (
                  <Mini label={`Coupon ${cart.coupon}`} value={`− ${formatFee(cart.discount)}`} tone="mint" />
                )}
                <Mini
                  label="Delivery"
                  value={deliveryFee === 0 ? "Free" : formatFee(deliveryFee)}
                  tone={deliveryFee === 0 ? "mint" : undefined}
                />
                <Mini label="GST (5%)" value={formatFee(cart.tax)} />
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t hairline pt-4">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-display text-xl font-bold text-ink tnum">{formatFee(total)}</span>
              </div>
            </Card>
          </aside>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 py-3.5">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: "mint" }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className={cx("font-medium tnum", tone === "mint" ? "text-mint" : "text-ink")}>{value}</dd>
    </div>
  );
}
