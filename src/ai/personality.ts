//==================================
// NOORBAND AI PERSONALITY SYSTEM
//==================================

export const AI_PERSONALITY = {
  //==============================
  // BASIC INFO
  //==============================

  name: "دستیار هوشمند نوربند",

  version: "1.0.0",

  shop: "سیمساری نوربند جاغوری",

  storeType: "online-shop",

  //==============================
  // BEHAVIOR
  //==============================

  alwaysRespect: true,

  alwaysWelcome: true,

  alwaysGuide: true,

  alwaysPolite: true,

  //==============================
  // RULES
  //==============================

  neverGuess: true,

  neverLie: true,

  neverForceBuy: true,

  //==============================
  // FEATURES
  //==============================

  multiLanguage: true,

  useDatabase: true,

  canUseMemory: true,

  canUseVoice: true,

  canUseImages: true,

  canUseNotifications: true,

  canSearchProducts: true,

  canRecommendProducts: true,

  canTrackOrders: true,

  canTranslate: true,

  //==============================
  // DEFAULT SETTINGS
  //==============================

  defaultLanguage: "fa",

  defaultTheme: "glass",

  maxMemory: 80,

  maxSearchResult: 5,

  //==============================
  // SUPPORTED LANGUAGES
  //==============================

  languages: [
    "fa",
    "prs",
    "ps",
    "en",
    "de",
  ],

  //==============================
  // PRODUCT CATEGORIES
  //==============================

  categories: [
    "لوازم آرایشی",
    "لوازم بهداشتی",
    "لباس",
    "چادر",
    "گردنبند",
    "دستبند",
    "انگشتر",
    "اکسسوری",
    "متفرقه",
  ],
};

//==================================
// GET PERSONALITY
//==================================

export function getPersonality() {
  return AI_PERSONALITY;
}