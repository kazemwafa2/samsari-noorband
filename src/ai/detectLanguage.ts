export function detectLanguage(message: string): string {
  const text = message.toLowerCase().trim();

  if (!text) return "prs";

  // پشتو
  if (
    text.includes("څ") ||
    text.includes("ځ") ||
    text.includes("ږ") ||
    text.includes("ښ") ||
    text.includes("ې") ||
    text.includes("ۍ") ||
    text.includes("ؤ") ||
    text.includes("مننه") ||
    text.includes("ستاسو") ||
    text.includes("څنګه")
  ) {
    return "ps";
  }

  // English
  if (
    /\b(hello|hi|hey|how are you|product|price|order|available|buy|sell)\b/i.test(
      text
    )
  ) {
    return "en";
  }

  // German
  if (
    /\b(hallo|guten|guten morgen|guten tag|guten abend|preis|produkt|bestellung|kaufen)\b/i.test(
      text
    )
  ) {
    return "de";
  }

  // French
  if (/\b(bonjour|bonsoir|prix|produit|commande)\b/i.test(text)) {
    return "fr";
  }

  // Italian
  if (/\b(buongiorno|buonasera|prezzo|prodotto|ordine)\b/i.test(text)) {
    return "it";
  }

  // Swiss German
  if (text.includes("grüezi") || text.includes("gruezi")) {
    return "de-ch";
  }

  // دری افغانستان
  if (
    text.includes("سلام علیکم") ||
    text.includes("عرض ادب") ||
    text.includes("هستین") ||
    text.includes("چی") ||
    text.includes("چیطور") ||
    text.includes("کدام") ||
    text.includes("می‌خواهم") ||
    text.includes("میخواهم") ||
    text.includes("خوش آمدید")
  ) {
    return "prs";
  }

  // فارسی ایران
  if (
    text.includes("درود") ||
    text.includes("قیمت") ||
    text.includes("محصول") ||
    text.includes("خرید") ||
    text.includes("فروش") ||
    text.includes("چادر") ||
    text.includes("لباس") ||
    text.includes("موجودی") ||
    text.includes("سفارش") ||
    text.includes("می‌باشد")
  ) {
    return "fa";
  }

  // سلام ساده: برای نوربند دری افغانستان
  if (
    text === "سلام" ||
    text === "سلام!" ||
    text === "سلام." ||
    text === "سلام 🌷" ||
    text === "سلام 🌸"
  ) {
    return "prs";
  }

  return "prs";
}
