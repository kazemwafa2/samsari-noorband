"use client";

import { useCurrency, CURRENCY_OPTIONS, CURRENCY_LABELS } from "@/lib/currency";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
      {CURRENCY_OPTIONS.map((c) => (
        <option key={c} value={c}>
          {CURRENCY_LABELS[c]}
        </option>
      ))}
    </select>
  );
}
