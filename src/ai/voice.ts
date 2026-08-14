//==================================
// NOORBAND AI VOICE SYSTEM
//==================================

import { getCache } from "@/ai/cache";

//==================================
// VOICE AI
//==================================

export async function voiceAI(
  voice: Blob
): Promise<string> {

  try {

    if (!voice) {
      return "❌ فایل صوتی دریافت نشد.";
    }

    return `
🎤 پیام صوتی دریافت شد.

حجم فایل:

${voice.size} Bytes

NOORBAND AI آماده پردازش صوت است.
`;

  } catch {

    return "❌ خطا در پردازش پیام صوتی.";
  }
}

//==================================
// START VOICE
//==================================

export function startVoiceRecognition(
  callback: (text: string) => void
) {

  if (typeof window === "undefined") {
    return false;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {

    console.log(
      "SpeechRecognition not supported."
    );

    return false;
  }

  const user = getCache();

  const recognition =
    new SpeechRecognition();

  recognition.lang =
    getVoiceLanguage(
      user.language
    );

  recognition.continuous = false;

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  recognition.onresult = (
    event: any
  ) => {

    const text =
      event.results[0][0]
        .transcript;

    callback(text);
  };

  recognition.onerror = (
    event: any
  ) => {

    console.log(
      "VOICE ERROR:",
      event.error
    );
  };

  recognition.onend = () => {

    console.log(
      "Voice recognition stopped."
    );
  };

  try {

    recognition.start();

    return true;

  } catch {

    return false;
  }
}

//==================================
// LANGUAGE
//==================================

export function getVoiceLanguage(
  language: string
) {

  switch (language) {

    case "fa":
      return "fa-IR";

    case "prs":
      return "fa-AF";

    case "ps":
      return "ps-AF";

    case "en":
      return "en-US";

    case "de":
      return "de-DE";

    case "tr":
      return "tr-TR";

    case "ar":
      return "ar-SA";

    default:
      return "fa-IR";
  }
}

//==================================
// TEXT TO SPEECH
//==================================

export function speak(
  text: string,
  language = "fa"
) {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    !window.speechSynthesis
  ) {
    return;
  }

  const speech =
    new SpeechSynthesisUtterance(
      text
    );

  speech.lang =
    getVoiceLanguage(
      language
    );

  speech.rate = 1;

  speech.pitch = 1;

  speech.volume = 1;

  window.speechSynthesis.speak(
    speech
  );
}

//==================================
// STOP SPEAKING
//==================================

export function stopSpeaking() {

  if (
    typeof window === "undefined"
  ) {
    return;
  }

  if (
    window.speechSynthesis
  ) {

    window
      .speechSynthesis
      .cancel();
  }
}