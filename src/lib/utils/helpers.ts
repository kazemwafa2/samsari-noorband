// src/lib/utils/helpers.ts

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}


export function formatPrice(price: number | string) {

  const value = Number(price);

  if (isNaN(value)) {
    return "0 افغانی";
  }

  return new Intl.NumberFormat("fa-AF").format(value) + " افغانی";
}


export function formatDate(date: string | Date) {

  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));

}


export function formatNumber(number: number | string) {

  const value = Number(number);

  if (isNaN(value)) return "0";

  return new Intl.NumberFormat("fa-IR").format(value);

}
