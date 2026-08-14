//==================================
// NOORBAND AI RESPONSE SYSTEM
//==================================

import { getPersonality } from "./personality";
import { searchProductsAI } from "./search";

interface AIResponseInput {
  message: string;
  language: string;
}

export async function generateAIResponse(
  input: AIResponseInput
): Promise<string> {
  const message =
    input.message.toLowerCase();

  const personality =
    getPersonality();

  //==================================
  // GREETING
  //==================================

  if (
    message.includes("سلام") ||
    message.includes("درود") ||
    message.includes("hello") ||
    message.includes("hi")
  ) {
    return getLanguageResponse(
      input.language,

      `
سلام و عرض ادب 🌸

به فروشگاه سیمساری نوربند جاغوری خوش آمدید.

چگونه می‌توانم کمک کنم؟

دسته‌بندی‌ها:

🌸 لوازم آرایشی
🌸 لوازم بهداشتی
🌸 لباس
🌸 چادر
🌸 گردنبند
🌸 دستبند
🌸 انگشتر
🌸 اکسسوری

از همراهی شما سپاسگزاریم 🌷
`
    );
  }

  //==================================
  // AI INTRO
  //==================================

  if (
    message.includes("تو کی هستی") ||
    message.includes("who are you") ||
    message.includes("معرفی")
  ) {
    return getLanguageResponse(
      input.language,

      `
من ${personality.name} هستم 🌸

دستیار هوشمند فروشگاه سیمساری نوربند جاغوری.

می‌توانم در انتخاب محصولات، جستجو، سفارش و خدمات فروشگاه به شما کمک کنم.
`
    );
  }

  //==================================
  // PRODUCT SEARCH
  //==================================

  if (
    message.includes("چادر") ||
    message.includes("لباس") ||
    message.includes("گردنبند") ||
    message.includes("دستبند") ||
    message.includes("انگشتر") ||
    message.includes("آرایشی") ||
    message.includes("بهداشتی") ||
    message.includes("محصول") ||
    message.includes("قیمت") ||
    message.includes("دارید")
  ) {
    return await searchProductsAI(
      input.message
    );
  }

  //==================================
  // ORDER
  //==================================

  if (
    message.includes("سفارش") ||
    message.includes("پیگیری")
  ) {
    return `
🛒 لطفاً کد سفارش خود را ارسال کنید تا وضعیت سفارش بررسی شود.
`;
  }

  //==================================
  // PAYMENT
  //==================================

  if (
    message.includes("پرداخت") ||
    message.includes("پول") ||
    message.includes("کارت")
  ) {
    return `
💳 برای راهنمایی پرداخت، لطفاً اطلاعات سفارش خود را ارسال کنید.
`;
  }

  //==================================
  // SUPPORT
  //==================================

  if (
    message.includes("کمک") ||
    message.includes("پشتیبانی")
  ) {
    return `
☎️ تیم پشتیبانی نوربند آماده کمک به شما است.
`;
  }

  //==================================
  // DEFAULT
  //==================================

  return getLanguageResponse(
    input.language,

    `
متوجه درخواست شما نشدم 🌷

لطفاً نام محصول یا سوال خود را واضح‌تر بنویسید.

من برای راهنمایی محصولات نوربند در خدمت شما هستم.
`
  );
}

//==================================
// LANGUAGE RESPONSE
//==================================

function getLanguageResponse(
  language: string,
  text: string
) {
  switch (language) {
    case "en":
      return `
NOORBAND AI 🌸

I can help you with products, prices, orders and store services.
`;

    case "ps":
      return `
د نوربند AI خدمتګار یم.

زه ستاسو د محصولاتو، فرمایشونو او خدمتونو په اړه مرسته کولی شم.
`;

    case "de":
      return `
NOORBAND AI 🌸

Ich helfe Ihnen bei Produkten, Preisen und Bestellungen.
`;

    case "fr":
      return `
NOORBAND AI 🌸

Je peux vous aider avec les produits et les commandes.
`;

    case "it":
      return `
NOORBAND AI 🌸

Posso aiutarti con prodotti e ordini.
`;

    default:
      return text;
  }
}