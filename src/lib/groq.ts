type GroqMessage = {
  role: "system" | "user";
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

export async function askGroq(
  message: string,
  systemPrompt?: string
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
