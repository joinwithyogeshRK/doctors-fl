"use client";

import { useState } from "react";
import { Check, Pencil, Plus, X } from "lucide-react";
import { currentPatient } from "@/data/patients";
import { cx } from "@/lib/format";
import { Card, CardTitle, PageHeader } from "@/components/ui/Surfaces";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useToast } from "@/components/providers/ToastProvider";

export function ProfileView() {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState({
    name: currentPatient.name,
    email: currentPatient.email,
    phone: currentPatient.phone,
    city: currentPatient.city,
    bloodGroup: currentPatient.bloodGroup,
    age: String(currentPatient.age),
  });
  const [allergies, setAllergies] = useState(currentPatient.allergies);
  const [conditions, setConditions] = useState(currentPatient.conditions);
  const [medications, setMedications] = useState(currentPatient.medications);
  const [draft, setDraft] = useState({ allergy: "", condition: "", medication: "" });

  const save = () => {
    setEditing(false);
    toast("success", "Profile updated", "Changes are kept in this browser only.");
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Health profile"
        lede="What your doctors see before a consultation. Keeping it current saves time in the room."
        action={
          editing ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button onClick={save}>
                <Check size={16} />
                Save changes
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil size={15} />
              Edit profile
            </Button>
          )
        }
      />

      <div className="mt-7 space-y-5">
        <Card>
          <CardTitle>Personal information</CardTitle>
          {editing ? (
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Full name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} />
              <TextField label="Age" type="number" value={details.age} onChange={(e) => setDetails({ ...details, age: e.target.value })} />
              <TextField label="Email" type="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} />
              <TextField label="Phone" type="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} />
              <TextField label="City" value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} />
              <TextField label="Blood group" value={details.bloodGroup} onChange={(e) => setDetails({ ...details, bloodGroup: e.target.value })} />
            </div>
          ) : (
            <dl className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" value={details.name} />
              <Field label="Age" value={`${details.age} years`} />
              <Field label="Email" value={details.email} />
              <Field label="Phone" value={details.phone} />
              <Field label="City" value={details.city} />
              <Field label="Blood group" value={details.bloodGroup} />
            </dl>
          )}
        </Card>

        <TagCard
          title="Allergies"
          hint="Shown prominently to any doctor you see"
          tone="coral"
          items={allergies}
          editing={editing}
          draft={draft.allergy}
          onDraft={(v) => setDraft({ ...draft, allergy: v })}
          onAdd={(v) => setAllergies([...allergies, v])}
          onRemove={(v) => setAllergies(allergies.filter((x) => x !== v))}
          emptyText="No known allergies recorded."
        />

        <TagCard
          title="Medical history"
          hint="Ongoing and past conditions"
          tone="ice"
          items={conditions}
          editing={editing}
          draft={draft.condition}
          onDraft={(v) => setDraft({ ...draft, condition: v })}
          onAdd={(v) => setConditions([...conditions, v])}
          onRemove={(v) => setConditions(conditions.filter((x) => x !== v))}
          emptyText="No conditions recorded."
        />

        <TagCard
          title="Current medications"
          hint="Including anything bought over the counter"
          tone="mint"
          items={medications}
          editing={editing}
          draft={draft.medication}
          onDraft={(v) => setDraft({ ...draft, medication: v })}
          onAdd={(v) => setMedications([...medications, v])}
          onRemove={(v) => setMedications(medications.filter((x) => x !== v))}
          emptyText="No regular medication recorded."
        />

        <Card>
          <CardTitle>Emergency contact</CardTitle>
          <dl className="grid gap-5 sm:grid-cols-3">
            <Field label="Name" value={currentPatient.emergencyContact.name} />
            <Field label="Relationship" value={currentPatient.emergencyContact.relation} />
            <Field label="Phone" value={currentPatient.emergencyContact.phone} />
          </dl>
        </Card>

        <p className="rounded-card bg-mist px-5 py-4 text-xs leading-relaxed text-ink-soft">
          All details here are fictional demonstration data. In a live deployment this record would
          be encrypted and access-controlled.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-ink-faint">{label}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}

function TagCard({
  title,
  hint,
  tone,
  items,
  editing,
  draft,
  onDraft,
  onAdd,
  onRemove,
  emptyText,
}: {
  title: string;
  hint: string;
  tone: "coral" | "ice" | "mint";
  items: string[];
  editing: boolean;
  draft: string;
  onDraft: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  emptyText: string;
}) {
  const tint = {
    coral: "bg-[color-mix(in_oklab,var(--color-coral)_10%,white)] text-coral",
    ice: "bg-ice text-ink-soft",
    mint: "bg-[color-mix(in_oklab,var(--color-mint)_12%,white)] text-[color-mix(in_oklab,var(--color-mint)_82%,black)]",
  }[tone];

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mt-0.5 text-xs text-ink-faint">{hint}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft">{emptyText}</p>
      ) : (
        <ul className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li key={item} className={cx("inline-flex items-center gap-2 rounded-chip px-3 py-1.5 text-sm font-medium", tint)}>
              {item}
              {editing && (
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  aria-label={`Remove ${item}`}
                  className="opacity-60 transition-opacity hover:opacity-100"
                >
                  <X size={13} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onAdd(draft.trim());
            onDraft("");
          }}
          className="mt-4 flex gap-2"
        >
          <label htmlFor={`add-${title}`} className="sr-only">
            Add to {title}
          </label>
          <input
            id={`add-${title}`}
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            placeholder={`Add to ${title.toLowerCase()}`}
            className="min-w-0 flex-1 rounded-xl border hairline bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-electric focus:outline-none"
          />
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            <Plus size={15} />
            Add
          </Button>
        </form>
      )}
    </Card>
  );
}
