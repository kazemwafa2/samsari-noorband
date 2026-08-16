type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GroqHistoryTurn = {
  role: "user" | "assistant";
  content: string;
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
  };
};

// قبلا این تابع فقط همان یک پیام آخر کاربر را می‌فرستاد و هیچ تاریخچه‌ای
// از گفتگو نداشت — یعنی هر بار Groq بدون هیچ اطلاعی از سوال/جواب‌های
// قبلی پاسخ می‌داد. همین باعث می‌شد در ادامه‌ی یک گفتگو، پاسخ‌ها به سوال
// قبلی/متن مکالمه بی‌ربط شوند و مسیر بحث هی عوض شود. حالا یک آرایه‌ی
// اختیاری `history` هم گرفته می‌شود و به‌عنوان چند پیام user/assistant
// قبل از پیام فعلی به مدل داده می‌شود تا مکالمه واقعا پیوسته بماند.
export async function askGroq(
  message: string,
  systemPrompt?: string,
  history: GroqHistoryTurn[] = []
): Promise<GroqResponse> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY تنظیم نشده است. فایل .env.local را بررسی کنید."
    );
  }

  const messages: GroqMessage[] = [];

  if (systemPrompt) {
    messages.push({
      role: "system",
      content: systemPrompt,
    });
  }

  // فقط چند پیام آخر (حداکثر ۱۰ = ۵ رفت‌وبرگشت) برای جلوگیری از حجم
  // زیاد/هزینه‌ی بی‌مورد توکن نگه داشته می‌شود؛ کافی است تا موضوع
  // مکالمه‌ی جاری حفظ شود.
  const trimmedHistory = history.slice(-10);

  for (const turn of trimmedHistory) {
    if (!turn?.content?.trim()) continue;
    messages.push({
      role: turn.role,
      content: turn.content,
    });
  }

  messages.push({
    role: "user",
    content: message,
  });

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.4,
        max_tokens: 800,
      }),
    }
  );

  const data = (await response.json()) as GroqResponse;

  if (!response.ok) {
    console.error("GROQ API ERROR:", data);

    throw new Error(
      data.error?.message ||
        `Groq API Error: HTTP ${response.status}`
    );
  }

  return data;
}
