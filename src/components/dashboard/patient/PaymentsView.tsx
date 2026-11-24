"use client";

import { ArrowDownToLine, CreditCard, Receipt, Smartphone, Wallet } from "lucide-react";
import { doctorBySlug } from "@/data/doctors";
import { formatFee } from "@/lib/format";
import { formatLongDate } from "@/hooks/useToday";
import { usePatientAppointments } from "@/store/appointments";
import { useOrders } from "@/store/orders";
import { Card, CardTitle, PageHeader, StatTile, StatusPill } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { downloadFile } from "@/components/appointments/bookingUtils";
import { useToast } from "@/components/providers/ToastProvider";

const methods = [
  { icon: Smartphone, label: "UPI", detail: "alex@okbank", primary: true },
  { icon: CreditCard, label: "Card", detail: "Visa ending 4421", primary: false },
  { icon: Wallet, label: "Wallet", detail: "Balance ₹1,250", primary: false },
];

export function PaymentsView() {
  const appointments = usePatientAppointments();
  const orders = useOrders();
  const { toast } = useToast();

  const consultations = appointments
    .filter((a) => a.paid)
    .map((a) => ({
      id: a.id,
      date: formatLongDate(a.date),
      label: `Consultation — ${doctorBySlug[a.doctorSlug]?.name ?? "Doctor"}`,
      amount: a.fee,
      method: "UPI",
    }));

  const pharmacy = orders.map((o) => ({
    id: o.id,
    date: o.placedAt.split(",")[0],
    label: `Pharmacy order — ${o.items.length} items`,
    amount: o.total,
    method: o.payment.toUpperCase(),
  }));

  const rows = [...consultations, ...pharmacy];
  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const pending = appointments.filter((a) => !a.paid && a.status !== "cancelled");

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Payments" lede="Consultation fees, pharmacy orders and your saved payment methods." />

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        <StatTile label="Paid this year" value={formatFee(total)} icon={<Receipt size={19} />} tone="electric" />
        <StatTile
          label="Awaiting payment"
          value={pending.length}
          detail={pending.length ? "Payable at the clinic" : "Nothing outstanding"}
          icon={<CreditCard size={19} />}
          tone="amber"
        />
        <StatTile label="Wallet balance" value="₹1,250" detail="Credit from a cancellation" icon={<Wallet size={19} />} tone="mint" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Card padded={false} className="min-w-0">
          <div className="p-5 sm:p-6">
            <CardTitle>Transaction history</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <thead>
                <tr className="border-y hairline bg-mist text-left text-xs text-ink-faint">
                  <th scope="col" className="px-5 py-3 font-semibold">Reference</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Description</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color-mix(in_oklab,var(--color-ink)_7%,transparent)]">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-mist">
                    <td className="px-5 py-3.5 font-medium text-ink tnum">{row.id}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{row.label}</td>
                    <td className="px-5 py-3.5 text-ink-faint">{row.date}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-ink tnum">
                      {formatFee(row.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        aria-label={`Download receipt for ${row.id}`}
                        onClick={() => {
                          downloadFile(
                            `${row.id}-receipt.txt`,
                            `MERIDIAN HEALTH\nDemonstration receipt\n${"".padEnd(40, "-")}\nReference : ${row.id}\nItem      : ${row.label}\nDate      : ${row.date}\nMethod    : ${row.method}\nAmount    : Rs. ${row.amount.toLocaleString("en-IN")}\n${"".padEnd(40, "-")}\nNo payment was processed.`,
                            "text/plain",
                          );
                          toast("success", "Receipt downloaded", row.id);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-ice hover:text-electric"
                      >
                        <ArrowDownToLine size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardTitle>Payment methods</CardTitle>
            <ul className="space-y-2.5">
              {methods.map((method) => {
                const Icon = method.icon;
                return (
                  <li
                    key={method.label}
                    className="flex items-center gap-3 rounded-card border hairline p-3.5"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ice text-ink-soft">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-ink">{method.label}</span>
                      <span className="block truncate text-xs text-ink-faint">{method.detail}</span>
                    </span>
                    {method.primary && <StatusPill status="paid">Default</StatusPill>}
                  </li>
                );
              })}
            </ul>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              onClick={() => toast("info", "Adding payment methods is not part of this demo")}
            >
              Add a payment method
            </Button>
          </Card>

          {pending.length > 0 && (
            <Card>
              <CardTitle>Awaiting payment</CardTitle>
              <ul className="space-y-3">
                {pending.map((appointment) => (
                  <li key={appointment.id} className="rounded-card bg-mist p-3.5">
                    <p className="text-sm font-semibold text-ink">
                      {doctorBySlug[appointment.doctorSlug]?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {formatLongDate(appointment.date)} · {appointment.time}
                    </p>
                    <p className="mt-2 font-display text-lg font-bold text-ink">
                      {formatFee(appointment.fee)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
