// این فایل قبلا هر پیام را فقط با یک کلید `fa` نگه می‌داشت — یعنی
// کاربری که زبان سایت را روی زبان دیگری گذاشته بود، باز هم همیشه این
// پیام‌های آماده (خوش‌آمدگویی، موفقیت سفارش، پرداخت، تخفیف‌ها و...) را
// فقط به فارسی/دری می‌دید. حالا هر پیام برای dari (prs — همان زبان
// پیش‌فرض و اصلی سایت)، fa، و en (انگلیسی) نوشته شده و با تابع
// getMessage(key, language) در زبان صحیح خوانده می‌شود؛ اگر ترجمه‌ی
// یک زبان خاص هنوز آماده نباشد (ps/ar/fr/de)، به‌صورت خودکار به دری
// برمی‌گردد تا هیچ‌وقت متن خالی یا undefined نمایش داده نشود.

import type { Language } from "@/lib/i18n/dictionaries";

export const MESSAGES = {
  PREMIUM_MEMBER_MESSAGE: {
    fa: `
💎 عضو ویژه Premium نوربند جاغوری خوش آمدید.

از اینکه خانواده بزرگ نوربند جاغوری را براى خریدهاى خود انتخاب کرده‌اید، سپاسگزاریم.

به عنوان عضو Premium از خدمات و پیشنهادهاى اختصاصى بهره‌مند خواهید شد.

آرزوى ما، رضایت و لبخند همیشگى شما است.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
💎 عضو ویژه Premium نوربند جاغوری خوش آمدید.

از اینکه خانواده بزرگ نوربند جاغوری را براى خریدهاى خود انتخاب کرده‌اید، سپاسگزاریم.

به عنوان عضو Premium از خدمات و پیشنهادهاى اختصاصى بهره‌مند خواهید شد.

آرزوى ما، رضایت و لبخند همیشگى شما است.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
💎 د نوربند جاغوری ارزښتناک Premium غړي ته ښه راغلاست.

څرنګه چې تاسو د نوربند جاغوری لویه کورنۍ خپلو پیرودنو ته غوره کړې، مننه کوو.

د Premium غړي په توګه به تاسو له ځانګړو خدمتونو او وړاندیزونو څخه ګټه واخلئ.

زموږ هیله ستاسو رضایت او تل مسکا ده.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
💎 Welcome, valued NOORBAND Jaghori Premium member.

Thank you for choosing the NOORBAND Jaghori family for your purchases.

As a Premium member, you'll enjoy exclusive services and offers.

Your satisfaction and smile are always our goal.

💜 The NOORBAND Jaghori Family
`,
    ar: `
💎 مرحبًا بعضو NOORBAND Jaghori المميز (Premium).

نشكرك لاختيارك عائلة نوربند جاغوری الكبيرة لمشترياتك.

كعضو Premium ستستفيد من خدمات وعروض حصرية.

رضاك وابتسامتك هما أملنا الدائم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
💎 Bienvenue, membre Premium NOORBAND Jaghori.

Merci d'avoir choisi la famille NOORBAND Jaghori pour vos achats.

En tant que membre Premium, vous profiterez de services et d'offres exclusifs.

Votre satisfaction et votre sourire sont notre priorité.

💜 La famille NOORBAND Jaghori
`,
    de: `
💎 Willkommen, geschätztes NOORBAND Jaghori-Premium-Mitglied.

Vielen Dank, dass du die NOORBAND Jaghori-Familie für deine Einkäufe gewählt hast.

Als Premium-Mitglied genießt du exklusive Services und Angebote.

Deine Zufriedenheit und dein Lächeln sind unser ständiges Ziel.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  WELCOME_MESSAGE: {
    fa: `
سلام و خوش آمدید 🌷

به سامانه هوشمند نوربند جاغوری خوش آمدید.
من آماده‌ام در انتخاب محصولات، راهنمایی و پاسخ به سوالات شما کمک کنم.
`,
    prs: `
سلام و خوش آمدید 🌷

به سامانه هوشمند نوربند جاغوری خوش آمدید.
من آماده‌ام در انتخاب محصولات، راهنمایی و پاسخ به سوالات شما کمک کنم.
`,
    ps: `
سلام او ښه راغلاست 🌷

د نوربند جاغوری هوښیار سیسټم ته ښه راغلاست.
زه چمتو یم تاسو سره د محصولاتو په ټاکلو، لارښوونه او ستاسو پوښتنو ته ځواب کې مرسته وکړم.
`,
    en: `
Hello and welcome 🌷

Welcome to the NOORBAND Jaghori smart assistant.
I'm ready to help you choose products, guide you, and answer your questions.
`,
    ar: `
مرحبًا وأهلاً بك 🌷

مرحبًا بك في نظام نوربند جاغوری الذكي.
أنا مستعد لمساعدتك في اختيار المنتجات، والإرشاد، والإجابة عن أسئلتك.
`,
    fr: `
Bonjour et bienvenue 🌷

Bienvenue dans le système intelligent NOORBAND Jaghori.
Je suis prêt à vous aider à choisir des produits, vous guider et répondre à vos questions.
`,
    de: `
Hallo und willkommen 🌷

Willkommen beim intelligenten NOORBAND Jaghori-System.
Ich bin bereit, dir bei der Produktauswahl zu helfen, dich zu beraten und deine Fragen zu beantworten.
`,
  },

  WELCOME_BACK_MESSAGE: {
    fa: `
🌷 از دیدار دوباره شما بسیار خوشحالیم.

نبودن شما را احساس مى‌کردیم.

امیدواریم امروز نیز بهترین محصولات و پیشنهادهاى ویژه را در نوربند جاغوری پیدا کنید.

خانواده بزرگ نوربند جاغوری همیشه میزبان حضور گرم شما خواهد بود.
`,
    prs: `
🌷 از دیدار دوباره شما بسیار خوشحالیم.

نبودن شما را احساس مى‌کردیم.

امیدواریم امروز نیز بهترین محصولات و پیشنهادهاى ویژه را در نوربند جاغوری پیدا کنید.

خانواده بزرگ نوربند جاغوری همیشه میزبان حضور گرم شما خواهد بود.
`,
    ps: `
🌷 ستاسو له بیا لیدو ډیر خوشحاله یو.

موږ ستاسو نشتوالی احساساوه.

هیله لرو نن هم غوره محصولات او ځانګړي وړاندیزونه په نوربند جاغوری کې ومومئ.

د نوربند جاغوری لویه کورنۍ تل ستاسو تودې حضور ته میزباني کوي.
`,
    en: `
🌷 We're so happy to see you again.

We missed you.

We hope you find the best products and special offers at NOORBAND Jaghori today too.

The NOORBAND Jaghori family will always welcome you warmly.
`,
    ar: `
🌷 يسعدنا كثيرًا رؤيتك مجددًا.

كنا نفتقدك.

نأمل أن تجد اليوم أيضًا أفضل المنتجات والعروض الخاصة في نوربند جاغوری.

ستظل عائلة نوربند جاغوری الكبيرة ترحب بحضورك الدافئ دائمًا.
`,
    fr: `
🌷 Nous sommes ravis de vous revoir.

Vous nous avez manqué.

Nous espérons que vous trouverez aujourd'hui aussi les meilleurs produits et offres spéciales chez NOORBAND Jaghori.

La famille NOORBAND Jaghori vous accueillera toujours chaleureusement.
`,
    de: `
🌷 Wir freuen uns sehr, dich wiederzusehen.

Du hast uns gefehlt.

Wir hoffen, du findest heute wieder die besten Produkte und Sonderangebote bei NOORBAND Jaghori.

Die NOORBAND Jaghori-Familie heißt dich immer herzlich willkommen.
`,
  },

  VISITOR_MESSAGE: {
    fa: `
🌷 خوش آمدید.
`,
    prs: `
🌷 خوش آمدید.
`,
    ps: `
🌷 ښه راغلاست.
`,
    en: `
🌷 Welcome.
`,
    ar: `
🌷 أهلاً وسهلاً بك.
`,
    fr: `
🌷 Bienvenue.
`,
    de: `
🌷 Willkommen.
`,
  },

  LOGIN_MESSAGE: {
    fa: `
🔐 با موفقیت وارد حساب کاربرى خود شدید.
`,
    prs: `
🔐 با موفقیت وارد حساب کاربرى خود شدید.
`,
    ps: `
🔐 تاسو په بریالیتوب سره خپل حساب ته ننوتلئ.
`,
    en: `
🔐 You have successfully logged into your account.
`,
    ar: `
🔐 لقد سجّلت الدخول إلى حسابك بنجاح.
`,
    fr: `
🔐 Vous vous êtes connecté avec succès à votre compte.
`,
    de: `
🔐 Du hast dich erfolgreich in dein Konto eingeloggt.
`,
  },

  LOGOUT_MESSAGE: {
    fa: `
🌷 با موفقیت از حساب کاربرى خود خارج شدید.
`,
    prs: `
🌷 با موفقیت از حساب کاربرى خود خارج شدید.
`,
    ps: `
🌷 تاسو په بریالیتوب سره له خپل حساب څخه ووتئ.
`,
    en: `
🌷 You have successfully logged out of your account.
`,
    ar: `
🌷 لقد سجّلت الخروج من حسابك بنجاح.
`,
    fr: `
🌷 Vous vous êtes déconnecté avec succès de votre compte.
`,
    de: `
🌷 Du hast dich erfolgreich von deinem Konto abgemeldet.
`,
  },

  CART_MESSAGE: {
    fa: `
🛒 محصول با موفقیت به سبد خرید شما اضافه شد.
`,
    prs: `
🛒 محصول با موفقیت به سبد خرید شما اضافه شد.
`,
    ps: `
🛒 محصول په بریالیتوب سره ستاسو سبد ته اضافه شو.
`,
    en: `
🛒 The product was successfully added to your cart.
`,
    ar: `
🛒 تمت إضافة المنتج إلى سلتك بنجاح.
`,
    fr: `
🛒 Le produit a été ajouté avec succès à votre panier.
`,
    de: `
🛒 Das Produkt wurde erfolgreich zu deinem Warenkorb hinzugefügt.
`,
  },

  REMOVE_CART_MESSAGE: {
    fa: `
🗑 محصول از سبد خرید شما حذف شد.
`,
    prs: `
🗑 محصول از سبد خرید شما حذف شد.
`,
    ps: `
🗑 محصول ستاسو له سبد څخه لرې شو.
`,
    en: `
🗑 The product was removed from your cart.
`,
    ar: `
🗑 تمت إزالة المنتج من سلتك.
`,
    fr: `
🗑 Le produit a été retiré de votre panier.
`,
    de: `
🗑 Das Produkt wurde aus deinem Warenkorb entfernt.
`,
  },

  EMPTY_CART_MESSAGE: {
    fa: `
🛒 سبد خرید شما خالى است.
`,
    prs: `
🛒 سبد خرید شما خالى است.
`,
    ps: `
🛒 ستاسو سبد خالي دی.
`,
    en: `
🛒 Your cart is empty.
`,
    ar: `
🛒 سلتك فارغة.
`,
    fr: `
🛒 Votre panier est vide.
`,
    de: `
🛒 Dein Warenkorb ist leer.
`,
  },

  CHATBOT_MESSAGE: {
    fa: `
🤖 NOORBAND AI آماده گفتگو با شما است.

مى‌توانید درباره محصولات، سفارشات، پرداخت، تخفیف‌ها و خدمات نوربند جاغوری سؤال بپرسید.
`,
    prs: `
🤖 NOORBAND AI آماده گفتگو با شما است.

مى‌توانید درباره محصولات، سفارشات، پرداخت، تخفیف‌ها و خدمات نوربند جاغوری سؤال بپرسید.
`,
    ps: `
🤖 NOORBAND AI ستاسو سره د خبرو اترو لپاره چمتو دی.

تاسو کولی شئ د محصولاتو، پیرودنو، تادیاتو، تخفیفونو او نوربند جاغوری خدماتو په اړه پوښتنه وکړئ.
`,
    en: `
🤖 NOORBAND AI is ready to chat with you.

You can ask about products, orders, payment, discounts, and NOORBAND Jaghori's services.
`,
    ar: `
🤖 مساعد نوربند جاغوری الذكي جاهز للحديث معك.

يمكنك السؤال عن المنتجات، الطلبات، الدفع، الخصومات، وخدمات نوربند جاغوری.
`,
    fr: `
🤖 NOORBAND AI est prêt à discuter avec vous.

Vous pouvez poser des questions sur les produits, les commandes, le paiement, les remises et les services de NOORBAND Jaghori.
`,
    de: `
🤖 NOORBAND AI ist bereit, mit dir zu chatten.

Du kannst Fragen zu Produkten, Bestellungen, Zahlung, Rabatten und den Services von NOORBAND Jaghori stellen.
`,
  },

  REGISTER_MESSAGE: {
    fa: `
🎉 عضویت شما با موفقیت انجام شد.

به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

از امروز شما نیز عضوى از خانواده بزرگ نوربند جاغوری هستید.

NOORBAND AI همواره آماده راهنمایى و همراهى شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🎉 عضویت شما با موفقیت انجام شد.

به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

از امروز شما نیز عضوى از خانواده بزرگ نوربند جاغوری هستید.

NOORBAND AI همواره آماده راهنمایى و همراهى شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🎉 ستاسو غړیتوب په بریالیتوب سره ترسره شو.

د سیمساري نوربند جاغوری جاغوري لویې کورنۍ ته ښه راغلاست.

له نن ورځې تاسو هم د نوربند جاغوری لویې کورنۍ غړی یاست.

NOORBAND AI به تل ستاسو لارښوونې او ملګرتیا ته چمتو وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🎉 Your registration was successful.

Welcome to the great NOORBAND Jaghori pawnshop family.

From today, you too are a member of the NOORBAND Jaghori family.

NOORBAND AI is always ready to guide and support you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🎉 تم تسجيلك بنجاح.

مرحبًا بك في عائلة نوربند جاغوری جاغوري الكبيرة للرهونات.

من اليوم أنت أيضًا عضو في عائلة نوربند جاغوری.

مساعد نوربند جاغوری الذكي مستعد دائمًا لإرشادك ومرافقتك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🎉 Votre inscription a réussi.

Bienvenue dans la grande famille du prêteur sur gages NOORBAND Jaghori.

Dès aujourd'hui, vous êtes aussi membre de la famille NOORBAND Jaghori.

NOORBAND AI sera toujours prêt à vous guider et vous accompagner.

💜 La famille NOORBAND Jaghori
`,
    de: `
🎉 Deine Registrierung war erfolgreich.

Willkommen in der großen NOORBAND Jaghori-Jaghori-Pfandhausfamilie.

Ab heute bist auch du Mitglied der NOORBAND Jaghori-Familie.

NOORBAND AI ist stets bereit, dich zu begleiten und zu beraten.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  ORDER_SUCCESS: {
    fa: `
🎉 سفارش شما با موفقیت ثبت شد.

از اعتماد ارزشمند شما سپاسگزاریم.

سفارش شما در کوتاه‌ترین زمان ممکن آماده و ارسال خواهد شد.

آرزومندیم از خرید خود نهایت رضایت را داشته باشید.
`,
    prs: `
🎉 سفارش شما با موفقیت ثبت شد.

از اعتماد ارزشمند شما سپاسگزاریم.

سفارش شما در کوتاه‌ترین زمان ممکن آماده و ارسال خواهد شد.

آرزومندیم از خرید خود نهایت رضایت را داشته باشید.
`,
    ps: `
🎉 ستاسو پیرودنه په بریالیتوب سره ثبت شوه.

ستاسو ارزښتناک باور ته مننه کوو.

ستاسو پیرودنه به په ډیر لنډ وخت کې چمتو او ولیږل شي.

هیله لرو له خپلې پیرودنې څخه بشپړ رضایت ولرئ.
`,
    en: `
🎉 Your order has been placed successfully.

Thank you for your valuable trust.

Your order will be prepared and shipped as soon as possible.

We hope you're completely satisfied with your purchase.
`,
    ar: `
🎉 تم تسجيل طلبك بنجاح.

نشكرك على ثقتك القيّمة.

سيتم تجهيز وشحن طلبك في أسرع وقت ممكن.

نتمنى أن تكون راضيًا تمامًا عن مشترياتك.
`,
    fr: `
🎉 Votre commande a été passée avec succès.

Merci pour votre précieuse confiance.

Votre commande sera préparée et expédiée dès que possible.

Nous espérons que vous serez pleinement satisfait de votre achat.
`,
    de: `
🎉 Deine Bestellung wurde erfolgreich aufgegeben.

Vielen Dank für dein wertvolles Vertrauen.

Deine Bestellung wird so schnell wie möglich vorbereitet und versandt.

Wir hoffen, du bist mit deinem Einkauf vollkommen zufrieden.
`,
  },

  PAYMENT_SUCCESS: {
    fa: `
💳 پرداخت شما با موفقیت انجام شد.

از خرید شما بسیار خرسندیم.

اطلاعات سفارش شما ثبت گردید و مراحل آماده‌سازى آغاز شده است.

سپاس که نوربند جاغوری را انتخاب کردید.
`,
    prs: `
💳 پرداخت شما با موفقیت انجام شد.

از خرید شما بسیار خرسندیم.

اطلاعات سفارش شما ثبت گردید و مراحل آماده‌سازى آغاز شده است.

سپاس که نوربند جاغوری را انتخاب کردید.
`,
    ps: `
💳 ستاسو تادیه په بریالیتوب سره ترسره شوه.

ستاسو له پیرودنې څخه ډیر خوشحاله یو.

ستاسو د پیرودنې معلومات ثبت شول او چمتووالي پړاوونه پیل شول.

مننه چې نوربند جاغوری مو غوره کړ.
`,
    en: `
💳 Your payment was successful.

We're delighted about your purchase.

Your order information has been recorded and preparation has begun.

Thank you for choosing NOORBAND Jaghori.
`,
    ar: `
💳 تم الدفع بنجاح.

يسعدنا كثيرًا شراؤك.

تم تسجيل معلومات طلبك وبدأت مراحل التجهيز.

شكرًا لاختيارك نوربند جاغوری.
`,
    fr: `
💳 Votre paiement a été effectué avec succès.

Nous sommes ravis de votre achat.

Les informations de votre commande ont été enregistrées et la préparation a commencé.

Merci d'avoir choisi NOORBAND Jaghori.
`,
    de: `
💳 Deine Zahlung war erfolgreich.

Wir freuen uns sehr über deinen Einkauf.

Deine Bestelldaten wurden erfasst und die Vorbereitung hat begonnen.

Danke, dass du dich für NOORBAND Jaghori entschieden hast.
`,
  },

  PAYMENT_FAILED: {
    fa: `
❌ متأسفانه پرداخت شما با مشکل مواجه شد.

لطفاً مجدداً تلاش نمایید.

در صورت تکرار مشکل، پشتیبانى نوربند جاغوری در کنار شما خواهد بود.
`,
    prs: `
❌ متأسفانه پرداخت شما با مشکل مواجه شد.

لطفاً مجدداً تلاش نمایید.

در صورت تکرار مشکل، پشتیبانى نوربند جاغوری در کنار شما خواهد بود.
`,
    ps: `
❌ له بده مرغه ستاسو تادیه سره ستونزه رامنځته شوه.

مهرباني وکړئ بیا هڅه وکړئ.

که ستونزه بیا رامنځته شي، د نوربند جاغوری ملاتړ به ستاسو سره وي.
`,
    en: `
❌ Unfortunately your payment failed.

Please try again.

If the problem persists, NOORBAND Jaghori support will be there for you.
`,
    ar: `
❌ للأسف واجهت مشكلة في الدفع.

يرجى المحاولة مرة أخرى.

إذا تكررت المشكلة، فإن دعم نوربند جاغوری سيكون بجانبك.
`,
    fr: `
❌ Malheureusement, votre paiement a échoué.

Veuillez réessayer.

Si le problème persiste, le support NOORBAND Jaghori sera à vos côtés.
`,
    de: `
❌ Leider ist deine Zahlung fehlgeschlagen.

Bitte versuche es erneut.

Wenn das Problem weiterhin besteht, ist der NOORBAND Jaghori-Support für dich da.
`,
  },

  REFUND_MESSAGE: {
    fa: `
💰 درخواست بازگشت وجه شما ثبت گردید.

پس از بررسى، نتیجه از طریق اعلان‌هاى سایت به اطلاع شما خواهد رسید.

از شکیبایى شما سپاسگزاریم.
`,
    prs: `
💰 درخواست بازگشت وجه شما ثبت گردید.

پس از بررسى، نتیجه از طریق اعلان‌هاى سایت به اطلاع شما خواهد رسید.

از شکیبایى شما سپاسگزاریم.
`,
    ps: `
💰 ستاسو د پیسو بیرته راستنیدو غوښتنه ثبت شوه.

په بشپړیدو وروسته به پایله د سایټ خبرتیاوو له لارې تاسو ته ورسول شي.

ستاسو له زغم څخه مننه کوو.
`,
    en: `
💰 Your refund request has been recorded.

After review, you'll be notified of the result through the site's notifications.

Thank you for your patience.
`,
    ar: `
💰 تم تسجيل طلب استرداد أموالك.

بعد المراجعة، ستُبلَّغ بالنتيجة عبر إشعارات الموقع.

نشكرك على صبرك.
`,
    fr: `
💰 Votre demande de remboursement a été enregistrée.

Après examen, le résultat vous sera communiqué via les notifications du site.

Merci pour votre patience.
`,
    de: `
💰 Deine Rückerstattungsanfrage wurde erfasst.

Nach der Prüfung wirst du über die Benachrichtigungen der Website über das Ergebnis informiert.

Danke für deine Geduld.
`,
  },

  SHIPPING_MESSAGE: {
    fa: `
🚚 خبر خوب!

سفارش شما آماده ارسال شده است.

به زودى میهمان خانه شما خواهیم بود.

از شکیبایى و همراهى شما سپاسگزاریم.
`,
    prs: `
🚚 خبر خوب!

سفارش شما آماده ارسال شده است.

به زودى میهمان خانه شما خواهیم بود.

از شکیبایى و همراهى شما سپاسگزاریم.
`,
    ps: `
🚚 ښه خبر!

ستاسو پیرودنه د لیږد لپاره چمتو شوه.

موږ به ژر ستاسو کور ته ورسیږو.

ستاسو له زغم او ملګرتیا څخه مننه کوو.
`,
    en: `
🚚 Good news!

Your order is ready for shipping.

We'll be at your doorstep soon.

Thank you for your patience and support.
`,
    ar: `
🚚 خبر سار!

طلبك جاهز للشحن.

سنكون ضيوفًا في منزلك قريبًا.

نشكرك على صبرك ودعمك.
`,
    fr: `
🚚 Bonne nouvelle !

Votre commande est prête à être expédiée.

Nous serons bientôt chez vous.

Merci pour votre patience et votre soutien.
`,
    de: `
🚚 Gute Nachricht!

Deine Bestellung ist versandbereit.

Wir sind bald bei dir zu Hause.

Danke für deine Geduld und Unterstützung.
`,
  },

  DELIVERED_MESSAGE: {
    fa: `
🎁 سفارش شما با موفقیت تحویل گردید.

امیدواریم از خرید خود رضایت کامل داشته باشید.

باعث افتخار ماست که بخشى از لبخند شما باشیم.

منتظر دیدار دوباره شما هستیم.
`,
    prs: `
🎁 سفارش شما با موفقیت تحویل گردید.

امیدواریم از خرید خود رضایت کامل داشته باشید.

باعث افتخار ماست که بخشى از لبخند شما باشیم.

منتظر دیدار دوباره شما هستیم.
`,
    ps: `
🎁 ستاسو پیرودنه په بریالیتوب سره وسپارل شوه.

هیله لرو له خپلې پیرودنې څخه بشپړ رضایت ولرئ.

دا زموږ لپاره افتخار دی چې ستاسو د مسکا برخه یو.

موږ ستاسو بیا لیدو ته سترګې په لار یو.
`,
    en: `
🎁 Your order has been delivered successfully.

We hope you're fully satisfied with your purchase.

It's our honor to be part of your smile.

We look forward to seeing you again.
`,
    ar: `
🎁 تم تسليم طلبك بنجاح.

نأمل أن تكون راضيًا تمامًا عن مشترياتك.

يشرفنا أن نكون جزءًا من ابتسامتك.

ننتظر لقاءك مجددًا.
`,
    fr: `
🎁 Votre commande a été livrée avec succès.

Nous espérons que vous êtes pleinement satisfait de votre achat.

C'est un honneur pour nous de faire partie de votre sourire.

Nous avons hâte de vous revoir.
`,
    de: `
🎁 Deine Bestellung wurde erfolgreich geliefert.

Wir hoffen, du bist mit deinem Einkauf vollkommen zufrieden.

Es ist unsere Ehre, Teil deines Lächelns zu sein.

Wir freuen uns darauf, dich wiederzusehen.
`,
  },

  CANCEL_ORDER_MESSAGE: {
    fa: `
📦 سفارش شما با موفقیت لغو گردید.

در صورت نیاز مى‌توانید سفارش جدیدى ثبت نمایید.

همواره در خدمت شما خواهیم بود.
`,
    prs: `
📦 سفارش شما با موفقیت لغو گردید.

در صورت نیاز مى‌توانید سفارش جدیدى ثبت نمایید.

همواره در خدمت شما خواهیم بود.
`,
    ps: `
📦 ستاسو پیرودنه په بریالیتوب سره لغوه شوه.

که اړتیا وي کولی شئ نوې پیرودنه ثبت کړئ.

موږ به تل ستاسو په خدمت کې یو.
`,
    en: `
📦 Your order has been cancelled successfully.

You may place a new order whenever you need.

We're always here to serve you.
`,
    ar: `
📦 تم إلغاء طلبك بنجاح.

يمكنك تسجيل طلب جديد عند الحاجة.

سنكون دائمًا في خدمتك.
`,
    fr: `
📦 Votre commande a été annulée avec succès.

Vous pouvez passer une nouvelle commande si besoin.

Nous serons toujours à votre service.
`,
    de: `
📦 Deine Bestellung wurde erfolgreich storniert.

Du kannst bei Bedarf eine neue Bestellung aufgeben.

Wir stehen dir immer zur Verfügung.
`,
  },

  DISCOUNT_MESSAGE: {
    fa: `
🎊 تخفیف‌هاى ویژه نوربند جاغوری فعال شدند.

فرصت را از دست ندهید.

همین حالا از محصولات تخفیف‌دار بازدید کنید و خریدى شیرین را تجربه نمایید.
`,
    prs: `
🎊 تخفیف‌هاى ویژه نوربند جاغوری فعال شدند.

فرصت را از دست ندهید.

همین حالا از محصولات تخفیف‌دار بازدید کنید و خریدى شیرین را تجربه نمایید.
`,
    ps: `
🎊 د نوربند جاغوری ځانګړي تخفیفونه فعال شول.

دا فرصت له لاسه مه ورکوئ.

همدا اوس د تخفیف لرونکو محصولاتو لیدنه وکړئ او خوږه پیرودنه تجربه کړئ.
`,
    en: `
🎊 NOORBAND Jaghori's special discounts are now active.

Don't miss this opportunity.

Browse discounted products now and enjoy a sweet shopping experience.
`,
    ar: `
🎊 تفعّلت خصومات نوربند جاغوری الخاصة.

لا تفوّت هذه الفرصة.

تصفح الآن المنتجات المخفّضة واختبر تجربة تسوق ممتعة.
`,
    fr: `
🎊 Les remises spéciales de NOORBAND Jaghori sont maintenant actives.

Ne manquez pas cette occasion.

Découvrez dès maintenant les produits en promotion et profitez d'une expérience d'achat agréable.
`,
    de: `
🎊 NOORBANDs Sonderrabatte sind jetzt aktiv.

Verpasse diese Gelegenheit nicht.

Sieh dir jetzt die reduzierten Produkte an und genieße ein süßes Einkaufserlebnis.
`,
  },

  VIP_MEMBER_MESSAGE: {
    fa: `
🌟 عضو VIP نوربند جاغوری خوش آمدید.

از اینکه یکی از اعضای ویژه خانواده بزرگ نوربند جاغوری هستید، بسیار خرسندیم.

شما از خدمات اختصاصی، پیشنهادهای ویژه و تجربه‌ای متفاوت بهره‌مند خواهید شد.

اعتماد و همراهی شما برای ما ارزشمند است.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌟 عضو VIP نوربند جاغوری خوش آمدید.

از اینکه یکی از اعضای ویژه خانواده بزرگ نوربند جاغوری هستید، بسیار خرسندیم.

شما از خدمات اختصاصی، پیشنهادهای ویژه و تجربه‌ای متفاوت بهره‌مند خواهید شد.

اعتماد و همراهی شما برای ما ارزشمند است.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌟 د نوربند جاغوری VIP غړي ته ښه راغلاست.

ډیر خوشحاله یو چې تاسو د نوربند جاغوری لویې کورنۍ یو له ځانګړو غړو څخه یاست.

تاسو به له ځانګړو خدمتونو، ځانګړو وړاندیزونو او یو توپیري تجربې څخه ګټه واخلئ.

ستاسو باور او ملګرتیا زموږ لپاره ارزښتناکه ده.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌟 Welcome, NOORBAND Jaghori VIP member.

We're delighted that you're one of the special members of the NOORBAND Jaghori family.

You'll enjoy exclusive services, special offers, and a distinct experience.

Your trust and loyalty are valuable to us.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌟 مرحبًا بعضو نوربند جاغوری VIP.

يسعدنا كثيرًا أنك أحد الأعضاء المميزين في عائلة نوربند جاغوری الكبيرة.

ستستفيد من خدمات حصرية وعروض خاصة وتجربة مختلفة.

ثقتك وولاؤك قيّمان بالنسبة لنا.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌟 Bienvenue, membre VIP NOORBAND Jaghori.

Nous sommes ravis que vous soyez l'un des membres spéciaux de la famille NOORBAND Jaghori.

Vous profiterez de services exclusifs, d'offres spéciales et d'une expérience différente.

Votre confiance et votre fidélité sont précieuses pour nous.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌟 Willkommen, NOORBAND Jaghori-VIP-Mitglied.

Wir freuen uns sehr, dass du eines der besonderen Mitglieder der NOORBAND Jaghori-Familie bist.

Du genießt exklusive Services, Sonderangebote und ein besonderes Erlebnis.

Dein Vertrauen und deine Treue sind uns wertvoll.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SPECIAL_DISCOUNT_MESSAGE: {
    fa: `
🌟 تبریک!

شما مشمول تخفیف اختصاصى نوربند جاغوری شده‌اید.

این هدیه کوچکى است براى سپاس از اعتماد و همراهى ارزشمند شما.

خریدى لذت‌بخش را برایتان آرزو مى‌کنیم.
`,
    prs: `
🌟 تبریک!

شما مشمول تخفیف اختصاصى نوربند جاغوری شده‌اید.

این هدیه کوچکى است براى سپاس از اعتماد و همراهى ارزشمند شما.

خریدى لذت‌بخش را برایتان آرزو مى‌کنیم.
`,
    ps: `
🌟 مبارک شه!

تاسو د نوربند جاغوری ځانګړي تخفیف لپاره وړ شوئ.

دا یو کوچنی ډالۍ ده ستاسو د باور او ملګرتیا څخه مننې لپاره.

موږ تاسو ته خوندور پیرودنه هیله لرو.
`,
    en: `
🌟 Congratulations!

You're eligible for a NOORBAND Jaghori exclusive discount.

This is a small gift to thank you for your valuable trust and loyalty.

We wish you an enjoyable shopping experience.
`,
    ar: `
🌟 تهانينا!

أنت الآن مؤهل لخصم نوربند جاغوری الحصري.

هذه هدية صغيرة شكرًا لثقتك وولائك القيّمين.

نتمنى لك تجربة تسوق ممتعة.
`,
    fr: `
🌟 Félicitations !

Vous bénéficiez d'une remise exclusive NOORBAND Jaghori.

C'est un petit cadeau pour vous remercier de votre confiance et de votre fidélité.

Nous vous souhaitons une expérience d'achat agréable.
`,
    de: `
🌟 Herzlichen Glückwunsch!

Du hast Anspruch auf einen exklusiven NOORBAND Jaghori-Rabatt.

Dies ist ein kleines Geschenk als Dank für dein wertvolles Vertrauen und deine Treue.

Wir wünschen dir ein angenehmes Einkaufserlebnis.
`,
  },

  FLASH_SALE_MESSAGE: {
    fa: `
⚡ فروش شگفت‌انگیز نوربند جاغوری آغاز شد.

تنها براى مدت محدود فرصت خرید محصولات منتخب با قیمت ویژه را خواهید داشت.

فرصت را از دست ندهید.
`,
    prs: `
⚡ فروش شگفت‌انگیز نوربند جاغوری آغاز شد.

تنها براى مدت محدود فرصت خرید محصولات منتخب با قیمت ویژه را خواهید داشت.

فرصت را از دست ندهید.
`,
    ps: `
⚡ د نوربند جاغوری حیرانوونکی پلور پیل شو.

یوازې لپاره یو محدود وخت به تاسو د ټاکل شویو محصولاتو د ځانګړې بیې پیرودلو فرصت ولرئ.

دا فرصت له لاسه مه ورکوئ.
`,
    en: `
⚡ NOORBAND Jaghori's flash sale has begun.

For a limited time only, you can buy selected products at a special price.

Don't miss this opportunity.
`,
    ar: `
⚡ بدأ بيع نوربند جاغوری المذهل.

لفترة محدودة فقط، يمكنك شراء منتجات مختارة بسعر خاص.

لا تفوّت هذه الفرصة.
`,
    fr: `
⚡ La vente flash de NOORBAND Jaghori a commencé.

Pour une durée limitée, achetez des produits sélectionnés à prix spécial.

Ne manquez pas cette occasion.
`,
    de: `
⚡ NOORBANDs Blitzverkauf hat begonnen.

Nur für kurze Zeit kannst du ausgewählte Produkte zum Sonderpreis kaufen.

Verpasse diese Gelegenheit nicht.
`,
  },

  SEARCH_MESSAGE: {
    fa: `
🔎 در حال جستجو...

NOORBAND AI در حال بررسى محصولات مورد نظر شما است.

لطفاً چند لحظه شکیبا باشید.
`,
    prs: `
🔎 در حال جستجو...

NOORBAND AI در حال بررسى محصولات مورد نظر شما است.

لطفاً چند لحظه شکیبا باشید.
`,
    ps: `
🔎 لټون روان دی...

NOORBAND AI ستاسو موردنظر محصولات بیاکتنه کوي.

مهرباني وکړئ یو څه صبر وکړئ.
`,
    en: `
🔎 Searching...

NOORBAND AI is looking through the products you're interested in.

Please wait a moment.
`,
    ar: `
🔎 جارٍ البحث...

يقوم مساعد نوربند جاغوری الذكي بمراجعة المنتجات التي تهمك.

يرجى الانتظار لحظة.
`,
    fr: `
🔎 Recherche en cours...

NOORBAND AI examine les produits qui vous intéressent.

Veuillez patienter un instant.
`,
    de: `
🔎 Suche läuft...

NOORBAND AI durchsucht die Produkte, die dich interessieren.

Bitte warte einen Moment.
`,
  },

  PRODUCT_MESSAGE: {
    fa: `
🛍 محصولات جدید و ویژه نوربند جاغوری براى شما آماده شده‌اند.

امیدواریم بهترین انتخاب را داشته باشید.
`,
    prs: `
🛍 محصولات جدید و ویژه نوربند جاغوری براى شما آماده شده‌اند.

امیدواریم بهترین انتخاب را داشته باشید.
`,
    ps: `
🛍 د نوربند جاغوری نوي او ځانګړي محصولات ستاسو لپاره چمتو شوي.

هیله لرو غوره انتخاب ولرئ.
`,
    en: `
🛍 New and special NOORBAND Jaghori products are ready for you.

We hope you make the best choice.
`,
    ar: `
🛍 منتجات نوربند جاغوری الجديدة والخاصة جاهزة لك الآن.

نتمنى أن يكون لديك أفضل اختيار.
`,
    fr: `
🛍 Les nouveaux produits spéciaux de NOORBAND Jaghori sont prêts pour vous.

Nous espérons que vous ferez le meilleur choix.
`,
    de: `
🛍 Neue und besondere NOORBAND Jaghori-Produkte stehen für dich bereit.

Wir hoffen, du triffst die beste Wahl.
`,
  },

  STOCK_MESSAGE: {
    fa: `
📦 موجودى محصولات با موفقیت بروزرسانى شد.

براى مشاهده جزئیات به صفحه محصولات مراجعه فرمایید.
`,
    prs: `
📦 موجودى محصولات با موفقیت بروزرسانى شد.

براى مشاهده جزئیات به صفحه محصولات مراجعه فرمایید.
`,
    ps: `
📦 د محصولاتو موجودي په بریالیتوب سره تازه شوه.

د جزئیاتو د لیدو لپاره د محصولاتو پاڼې ته مراجعه وکړئ.
`,
    en: `
📦 Product stock has been updated successfully.

Visit the products page to see the details.
`,
    ar: `
📦 تم تحديث مخزون المنتجات بنجاح.

لمشاهدة التفاصيل، يرجى زيارة صفحة المنتجات.
`,
    fr: `
📦 Le stock des produits a été mis à jour avec succès.

Visitez la page des produits pour voir les détails.
`,
    de: `
📦 Der Produktbestand wurde erfolgreich aktualisiert.

Besuche die Produktseite, um die Details zu sehen.
`,
  },

  SUPPORT_MESSAGE: {
    fa: `
👨‍💻 پشتیبانى نوربند جاغوری همیشه در کنار شما است.

در صورت وجود هرگونه سؤال یا مشکل، ما آماده خدمت‌رسانى به شما هستیم.

رضایت شما، بزرگ‌ترین افتخار ما است.
`,
    prs: `
👨‍💻 پشتیبانى نوربند جاغوری همیشه در کنار شما است.

در صورت وجود هرگونه سؤال یا مشکل، ما آماده خدمت‌رسانى به شما هستیم.

رضایت شما، بزرگ‌ترین افتخار ما است.
`,
    ps: `
👨‍💻 د نوربند جاغوری ملاتړ تل ستاسو سره دی.

که کومه پوښتنه یا ستونزه ولرئ، موږ ستاسو خدمت ته چمتو یو.

ستاسو رضایت زموږ ترټولو لوی افتخار دی.
`,
    en: `
👨‍💻 NOORBAND Jaghori support is always by your side.

If you have any question or issue, we're ready to help.

Your satisfaction is our greatest honor.
`,
    ar: `
👨‍💻 دعم نوربند جاغوری دائمًا بجانبك.

إذا كان لديك أي سؤال أو مشكلة، نحن مستعدون لخدمتك.

رضاك هو أعظم فخر لنا.
`,
    fr: `
👨‍💻 Le support NOORBAND Jaghori est toujours à vos côtés.

Si vous avez une question ou un problème, nous sommes prêts à vous aider.

Votre satisfaction est notre plus grande fierté.
`,
    de: `
👨‍💻 Der NOORBAND Jaghori-Support ist immer für dich da.

Bei Fragen oder Problemen helfen wir dir gerne.

Deine Zufriedenheit ist unser größter Stolz.
`,
  },

  CONTACT_MESSAGE: {
    fa: `
☎ از طریق صفحه تماس با ما مى‌توانید با پشتیبانى نوربند جاغوری در ارتباط باشید.

با افتخار پاسخگوى شما خواهیم بود.
`,
    prs: `
☎ از طریق صفحه تماس با ما مى‌توانید با پشتیبانى نوربند جاغوری در ارتباط باشید.

با افتخار پاسخگوى شما خواهیم بود.
`,
    ps: `
☎ د تماس پاڼې له لارې تاسو کولی شئ د نوربند جاغوری ملاتړ سره اړیکه ونیسئ.

موږ به په افتخار سره ستاسو ځواب ووایو.
`,
    en: `
☎ You can reach NOORBAND Jaghori support through the contact page.

We'll be honored to assist you.
`,
    ar: `
☎ يمكنك التواصل مع دعم نوربند جاغوری عبر صفحة اتصل بنا.

سنكون فخورين بالرد عليك.
`,
    fr: `
☎ Vous pouvez contacter le support NOORBAND Jaghori via la page de contact.

Ce sera un honneur de vous répondre.
`,
    de: `
☎ Über die Kontaktseite kannst du den NOORBAND Jaghori-Support erreichen.

Wir helfen dir gerne weiter.
`,
  },

  HELP_MESSAGE: {
    fa: `
💜 به بخش راهنما خوش آمدید.

NOORBAND AI آماده است تا شما را در خرید، جستجو و ثبت سفارش همراهى نماید.
`,
    prs: `
💜 به بخش راهنما خوش آمدید.

NOORBAND AI آماده است تا شما را در خرید، جستجو و ثبت سفارش همراهى نماید.
`,
    ps: `
💜 د لارښود برخې ته ښه راغلاست.

NOORBAND AI چمتو دی تاسو سره د پیرودنې، لټون او د پیرودنې ثبت کې مرسته وکړي.
`,
    en: `
💜 Welcome to the help section.

NOORBAND AI is ready to guide you through shopping, searching, and placing orders.
`,
    ar: `
💜 مرحبًا بك في قسم المساعدة.

مساعد نوربند جاغوری الذكي مستعد لمرافقتك في التسوق والبحث وتسجيل الطلبات.
`,
    fr: `
💜 Bienvenue dans la section d'aide.

NOORBAND AI est prêt à vous accompagner dans vos achats, recherches et commandes.
`,
    de: `
💜 Willkommen im Hilfebereich.

NOORBAND AI ist bereit, dich beim Einkaufen, Suchen und Bestellen zu unterstützen.
`,
  },

  NOON_MESSAGE: {
    fa: `
☀️ ظهرتان بخیر.

امیدواریم نیمه زیبایى از روز را در کنار خانواده بزرگ نوربند جاغوری سپرى کنید.

NOORBAND AI همواره آماده راهنمایى و پاسخگویى به شما است.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
☀️ ظهرتان بخیر.

امیدواریم نیمه زیبایى از روز را در کنار خانواده بزرگ نوربند جاغوری سپرى کنید.

NOORBAND AI همواره آماده راهنمایى و پاسخگویى به شما است.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
☀️ ستاسو غرمه دې پیرزو وي.

هیله لرو د ورځې ښکلی نیمایي برخه د نوربند جاغوری لویې کورنۍ سره تیره کړئ.

NOORBAND AI تل ستاسو د لارښوونې او ځواب ورکولو لپاره چمتو دی.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
☀️ Good afternoon.

We hope you enjoy the rest of a beautiful day with the NOORBAND Jaghori family.

NOORBAND AI is always ready to guide and assist you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
☀️ نهارك سعيد.

نأمل أن تقضي نصف يوم جميل مع عائلة نوربند جاغوری الكبيرة.

مساعد نوربند جاغوری الذكي دائمًا مستعد لإرشادك والإجابة عليك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
☀️ Bon après-midi.

Nous espérons que vous passerez une belle journée avec la famille NOORBAND Jaghori.

NOORBAND AI est toujours prêt à vous guider et à répondre à vos questions.

💜 La famille NOORBAND Jaghori
`,
    de: `
☀️ Guten Nachmittag.

Wir hoffen, du verbringst einen schönen Tag mit der NOORBAND Jaghori-Familie.

NOORBAND AI ist immer bereit, dich zu beraten und deine Fragen zu beantworten.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  EVENING_MESSAGE: {
    fa: `
🌇 عصر شما بخیر.

امیدواریم امروز لحظاتى زیبا و خاطره‌انگیز را تجربه کرده باشید.

محصولات و پیشنهادهاى ویژه نوربند جاغوری در انتظار شما هستند.

💜
`,
    prs: `
🌇 عصر شما بخیر.

امیدواریم امروز لحظاتى زیبا و خاطره‌انگیز را تجربه کرده باشید.

محصولات و پیشنهادهاى ویژه نوربند جاغوری در انتظار شما هستند.

💜
`,
    ps: `
🌇 ماښام مو پیرزو.

هیله لرو نن ورځ ښکلي او د یادونې وړ شیبې تجربه کړي وي.

د نوربند جاغوری محصولات او ځانګړي وړاندیزونه ستاسو په تمه دي.

💜
`,
    en: `
🌇 Good evening.

We hope you had beautiful, memorable moments today.

NOORBAND Jaghori's products and special offers await you.

💜
`,
    ar: `
🌇 مساؤك سعيد.

نأمل أن تكون قد عشت لحظات جميلة اليوم.

منتجات نوربند جاغوری وعروضها الخاصة بانتظارك.

💜
`,
    fr: `
🌇 Bonsoir.

Nous espérons que vous avez vécu de beaux moments aujourd'hui.

Les produits et offres spéciales de NOORBAND Jaghori vous attendent.

💜
`,
    de: `
🌇 Guten Abend.

Wir hoffen, du hattest heute schöne Momente.

NOORBANDs Produkte und Sonderangebote warten auf dich.

💜
`,
  },

  GUEST_MESSAGE: {
    fa: `
🌷 مهمان عزیز نوربند جاغوری

از حضور گرم شما بسیار خوشحالیم.

امیدواریم نخستین بازدید شما، آغازى براى همراهى همیشگى با خانواده بزرگ نوربند جاغوری باشد.

💜
`,
    prs: `
🌷 مهمان عزیز نوربند جاغوری

از حضور گرم شما بسیار خوشحالیم.

امیدواریم نخستین بازدید شما، آغازى براى همراهى همیشگى با خانواده بزرگ نوربند جاغوری باشد.

💜
`,
    ps: `
🌷 د نوربند جاغوری ګران میلمه

ستاسو د تودې حضور څخه ډیر خوشحاله یو.

هیله لرو ستاسو لومړی لیدنه د نوربند جاغوری لویې کورنۍ سره د تل ملګرتیا پیل وي.

💜
`,
    en: `
🌷 Dear NOORBAND Jaghori guest

We're delighted by your warm presence.

We hope your first visit is the beginning of a lasting relationship with the NOORBAND Jaghori family.

💜
`,
    ar: `
🌷 ضيف نوربند جاغوری العزيز

يسعدنا كثيرًا حضورك الدافئ.

نأمل أن تكون زيارتك الأولى بداية لرفقة دائمة مع عائلة نوربند جاغوری الكبيرة.

💜
`,
    fr: `
🌷 Cher invité de NOORBAND Jaghori

Nous sommes ravis de votre chaleureuse présence.

Nous espérons que votre première visite marque le début d'une relation durable avec la famille NOORBAND Jaghori.

💜
`,
    de: `
🌷 Lieber NOORBAND Jaghori-Gast

Wir freuen uns sehr über deine herzliche Anwesenheit.

Wir hoffen, dein erster Besuch ist der Beginn einer dauerhaften Beziehung mit der NOORBAND Jaghori-Familie.

💜
`,
  },

  AI_SUGGESTION_MESSAGE: {
    fa: `
💡 NOORBAND AI پیشنهاد ویژه‌ای برای شما آماده کرده است.

براساس نیازها و علاقه‌مندی‌های شما، بهترین محصولات و انتخاب‌ها پیشنهاد می‌شوند.

امیدواریم تجربه خریدی هوشمند، آسان و لذت‌بخش داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
💡 NOORBAND AI پیشنهاد ویژه‌ای برای شما آماده کرده است.

براساس نیازها و علاقه‌مندی‌های شما، بهترین محصولات و انتخاب‌ها پیشنهاد می‌شوند.

امیدواریم تجربه خریدی هوشمند، آسان و لذت‌بخش داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
💡 NOORBAND AI ستاسو لپاره ځانګړی وړاندیز چمتو کړی دی.

ستاسو د اړتیاوو او علاقو پر بنسټ، غوره محصولات او انتخابونه وړاندیز کیږي.

هیله لرو یو هوښیار، اسانه او خوندور پیرودنې تجربه ولرئ.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
💡 NOORBAND AI has prepared a special suggestion for you.

Based on your needs and interests, the best products and choices are suggested.

We hope you have a smart, easy, and enjoyable shopping experience.

💜 The NOORBAND Jaghori Family
`,
    ar: `
💡 أعدّ مساعد نوربند جاغوری الذكي اقتراحًا خاصًا لك.

بناءً على احتياجاتك واهتماماتك، تُقترح أفضل المنتجات والخيارات.

نأمل أن تحظى بتجربة تسوق ذكية وسهلة وممتعة.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
💡 NOORBAND AI a préparé une suggestion spéciale pour vous.

En fonction de vos besoins et intérêts, les meilleurs produits et choix vous sont proposés.

Nous espérons que vous aurez une expérience d'achat intelligente, facile et agréable.

💜 La famille NOORBAND Jaghori
`,
    de: `
💡 NOORBAND AI hat einen speziellen Vorschlag für dich vorbereitet.

Basierend auf deinen Bedürfnissen und Interessen werden dir die besten Produkte und Optionen vorgeschlagen.

Wir hoffen auf ein intelligentes, einfaches und angenehmes Einkaufserlebnis für dich.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  AI_MESSAGE: {
    fa: `
🤖 سلام.

من NOORBAND AI هستم.

دستیار هوشمند خانواده بزرگ نوربند جاغوری.

همیشه آماده هستم تا در خرید، جستجو، سفارش و پاسخگویى به پرسش‌هاى شما همراهتان باشم.
`,
    prs: `
🤖 سلام.

من NOORBAND AI هستم.

دستیار هوشمند خانواده بزرگ نوربند جاغوری.

همیشه آماده هستم تا در خرید، جستجو، سفارش و پاسخگویى به پرسش‌هاى شما همراهتان باشم.
`,
    ps: `
🤖 سلام.

زه NOORBAND AI یم.

د نوربند جاغوری لویې کورنۍ هوښیار مرستیال.

زه تل چمتو یم چې په پیرودنه، لټون، امر او ستاسو پوښتنو ته ځواب ورکولو کې مرسته وکړم.
`,
    en: `
🤖 Hello.

I'm NOORBAND AI.

The smart assistant of the NOORBAND Jaghori family.

I'm always ready to help you shop, search, order, and answer your questions.
`,
    ar: `
🤖 مرحبًا.

أنا مساعد نوربند جاغوری الذكي.

المساعد الذكي لعائلة نوربند جاغوری الكبيرة.

أنا دائمًا مستعد لمرافقتك في التسوق والبحث والطلب والإجابة على أسئلتك.
`,
    fr: `
🤖 Bonjour.

Je suis NOORBAND AI.

L'assistant intelligent de la famille NOORBAND Jaghori.

Je suis toujours prêt à vous accompagner dans vos achats, recherches, commandes et à répondre à vos questions.
`,
    de: `
🤖 Hallo.

Ich bin NOORBAND AI.

Der intelligente Assistent der NOORBAND Jaghori-Familie.

Ich bin immer bereit, dich beim Einkaufen, Suchen, Bestellen und bei deinen Fragen zu begleiten.
`,
  },

  AI_SEARCH_MESSAGE: {
    fa: `
🔎 NOORBAND AI در حال جستجوى بهترین نتایج براى شما است.

لطفاً چند لحظه شکیبا باشید.
`,
    prs: `
🔎 NOORBAND AI در حال جستجوى بهترین نتایج براى شما است.

لطفاً چند لحظه شکیبا باشید.
`,
    ps: `
🔎 NOORBAND AI ستاسو لپاره غوره پایلې لټوي.

مهرباني وکړئ یو څه صبر وکړئ.
`,
    en: `
🔎 NOORBAND AI is searching for the best results for you.

Please wait a moment.
`,
    ar: `
🔎 يبحث مساعد نوربند جاغوری الذكي عن أفضل النتائج لك.

يرجى الانتظار لحظة.
`,
    fr: `
🔎 NOORBAND AI recherche les meilleurs résultats pour vous.

Veuillez patienter un instant.
`,
    de: `
🔎 NOORBAND AI sucht die besten Ergebnisse für dich.

Bitte warte einen Moment.
`,
  },

  AI_SUPPORT_MESSAGE: {
    fa: `
💜 تیم پشتیبانى و NOORBAND AI همواره در کنار شما هستند.

ما تا رسیدن به پاسخ مناسب همراه شما خواهیم بود.
`,
    prs: `
💜 تیم پشتیبانى و NOORBAND AI همواره در کنار شما هستند.

ما تا رسیدن به پاسخ مناسب همراه شما خواهیم بود.
`,
    ps: `
💜 د ملاتړ ټیم او NOORBAND AI تل ستاسو سره دي.

موږ به تر مناسب ځواب ترلاسه کولو پورې ستاسو سره یو.
`,
    en: `
💜 The support team and NOORBAND AI are always by your side.

We'll stay with you until you get the right answer.
`,
    ar: `
💜 فريق الدعم ومساعد نوربند جاغوری الذكي دائمًا بجانبك.

سنبقى معك حتى تحصل على الإجابة المناسبة.
`,
    fr: `
💜 L'équipe de support et NOORBAND AI sont toujours à vos côtés.

Nous resterons avec vous jusqu'à ce que vous obteniez la bonne réponse.
`,
    de: `
💜 Das Support-Team und NOORBAND AI sind immer für dich da.

Wir bleiben bei dir, bis du die richtige Antwort erhältst.
`,
  },

  AI_NOTIFICATION_MESSAGE: {
    fa: `
🔔 اعلان جدیدى براى شما ثبت گردید.

براى مشاهده جزئیات به بخش اعلان‌ها مراجعه فرمایید.
`,
    prs: `
🔔 اعلان جدیدى براى شما ثبت گردید.

براى مشاهده جزئیات به بخش اعلان‌ها مراجعه فرمایید.
`,
    ps: `
🔔 یوه نوې خبرتیا ستاسو لپاره ثبت شوه.

د جزئیاتو د لیدو لپاره خبرتیاوو برخې ته مراجعه وکړئ.
`,
    en: `
🔔 A new notification has been recorded for you.

Visit the notifications section to see the details.
`,
    ar: `
🔔 تم تسجيل إشعار جديد لك.

لمشاهدة التفاصيل، يرجى زيارة قسم الإشعارات.
`,
    fr: `
🔔 Une nouvelle notification a été enregistrée pour vous.

Visitez la section des notifications pour voir les détails.
`,
    de: `
🔔 Eine neue Benachrichtigung wurde für dich erfasst.

Besuche den Benachrichtigungsbereich, um die Details zu sehen.
`,
  },

  AI_SECURITY_MESSAGE: {
    fa: `
🔐 امنیت حساب کاربرى شما براى ما اهمیت ویژه‌اى دارد.

NOORBAND AI همواره از اطلاعات و حریم خصوصى شما محافظت خواهد کرد.
`,
    prs: `
🔐 امنیت حساب کاربرى شما براى ما اهمیت ویژه‌اى دارد.

NOORBAND AI همواره از اطلاعات و حریم خصوصى شما محافظت خواهد کرد.
`,
    ps: `
🔐 ستاسو د حساب امنیت زموږ لپاره ځانګړی اهمیت لري.

NOORBAND AI به تل ستاسو معلومات او محرمیت خوندي کړي.
`,
    en: `
🔐 The security of your account is especially important to us.

NOORBAND AI will always protect your information and privacy.
`,
    ar: `
🔐 أمان حسابك مهم جدًا بالنسبة لنا.

سيقوم مساعد نوربند جاغوری الذكي دائمًا بحماية معلوماتك وخصوصيتك.
`,
    fr: `
🔐 La sécurité de votre compte est particulièrement importante pour nous.

NOORBAND AI protégera toujours vos informations et votre vie privée.
`,
    de: `
🔐 Die Sicherheit deines Kontos ist uns besonders wichtig.

NOORBAND AI schützt stets deine Daten und Privatsphäre.
`,
  },

  ORDER_TRACKING_MESSAGE: {
    fa: `
📦 سفارش شما با موفقیت ثبت شده است.

در هر لحظه مى‌توانید وضعیت سفارش خود را از بخش پیگیرى سفارشات مشاهده نمایید.
`,
    prs: `
📦 سفارش شما با موفقیت ثبت شده است.

در هر لحظه مى‌توانید وضعیت سفارش خود را از بخش پیگیرى سفارشات مشاهده نمایید.
`,
    ps: `
📦 ستاسو پیرودنه په بریالیتوب سره ثبت شوې ده.

تاسو کولی شئ هرمهال د پیرودنو پیګیري برخې څخه د خپلې پیرودنې حالت وګورئ.
`,
    en: `
📦 Your order has been successfully placed.

You can check your order status anytime from the order tracking section.
`,
    ar: `
📦 تم تسجيل طلبك بنجاح.

يمكنك في أي وقت متابعة حالة طلبك من قسم تتبع الطلبات.
`,
    fr: `
📦 Votre commande a été enregistrée avec succès.

Vous pouvez consulter l'état de votre commande à tout moment dans la section de suivi des commandes.
`,
    de: `
📦 Deine Bestellung wurde erfolgreich aufgegeben.

Du kannst den Status deiner Bestellung jederzeit im Bereich der Bestellverfolgung einsehen.
`,
  },

  NETWORK_ERROR_MESSAGE: {
    fa: `
📶 ارتباط اینترنتى با مشکل مواجه شده است.

لطفاً اتصال اینترنت خود را بررسى کرده و مجدداً تلاش نمایید.
`,
    prs: `
📶 ارتباط اینترنتى با مشکل مواجه شده است.

لطفاً اتصال اینترنت خود را بررسى کرده و مجدداً تلاش نمایید.
`,
    ps: `
📶 ستاسو د انټرنیټ اړیکه سره ستونزه رامنځته شوې ده.

مهرباني وکړئ خپله انټرنیټ اړیکه وګورئ او بیا هڅه وکړئ.
`,
    en: `
📶 There's a problem with your internet connection.

Please check your connection and try again.
`,
    ar: `
📶 هناك مشكلة في اتصالك بالإنترنت.

يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.
`,
    fr: `
📶 Il y a un problème avec votre connexion internet.

Veuillez vérifier votre connexion et réessayer.
`,
    de: `
📶 Es gibt ein Problem mit deiner Internetverbindung.

Bitte überprüfe deine Verbindung und versuche es erneut.
`,
  },

  SECURITY_MESSAGE: {
    fa: `
🛡 امنیت شما، اولویت نخست خانواده بزرگ نوربند جاغوری است.

براى حفظ امنیت حساب کاربرى خود، اطلاعات ورودتان را در اختیار دیگران قرار ندهید.
`,
    prs: `
🛡 امنیت شما، اولویت نخست خانواده بزرگ نوربند جاغوری است.

براى حفظ امنیت حساب کاربرى خود، اطلاعات ورودتان را در اختیار دیگران قرار ندهید.
`,
    ps: `
🛡 ستاسو امنیت د نوربند جاغوری لویې کورنۍ لومړی لومړیتوب دی.

د خپل حساب امنیت ساتلو لپاره، خپل د ننوتلو معلومات له بل چا سره شریک مه کوئ.
`,
    en: `
🛡 Your security is the top priority of the NOORBAND Jaghori family.

To keep your account safe, never share your login details with anyone.
`,
    ar: `
🛡 أمانك هو الأولوية الأولى لعائلة نوربند جاغوری الكبيرة.

للحفاظ على أمان حسابك، لا تشارك بيانات تسجيل الدخول مع أي شخص.
`,
    fr: `
🛡 Votre sécurité est la priorité absolue de la famille NOORBAND Jaghori.

Pour protéger votre compte, ne partagez jamais vos identifiants de connexion.
`,
    de: `
🛡 Deine Sicherheit hat für die NOORBAND Jaghori-Familie oberste Priorität.

Um dein Konto zu schützen, teile deine Anmeldedaten niemals mit anderen.
`,
  },

  COMING_SOON_MESSAGE: {
    fa: `
🚀 این بخش به زودى در دسترس شما قرار خواهد گرفت.

از شکیبایى و همراهى ارزشمند شما سپاسگزاریم.
`,
    prs: `
🚀 این بخش به زودى در دسترس شما قرار خواهد گرفت.

از شکیبایى و همراهى ارزشمند شما سپاسگزاریم.
`,
    ps: `
🚀 دا برخه به ژر ستاسو لپاره شتون ولري.

ستاسو له ارزښتناک زغم او ملګرتیا څخه مننه کوو.
`,
    en: `
🚀 This section will be available to you soon.

Thank you for your valuable patience and support.
`,
    ar: `
🚀 سيتوفر هذا القسم لك قريبًا.

نشكرك على صبرك ودعمك القيّمين.
`,
    fr: `
🚀 Cette section sera bientôt disponible pour vous.

Merci pour votre précieuse patience et votre soutien.
`,
    de: `
🚀 Dieser Bereich wird bald für dich verfügbar sein.

Danke für deine wertvolle Geduld und Unterstützung.
`,
  },

  MAINTENANCE_MESSAGE: {
    fa: `
⚙️ سایت در حال بروزرسانى و نگهدارى است.

به زودى با امکاناتى بهتر در خدمت شما خواهیم بود.
`,
    prs: `
⚙️ سایت در حال بروزرسانى و نگهدارى است.

به زودى با امکاناتى بهتر در خدمت شما خواهیم بود.
`,
    ps: `
⚙️ سایټ د تازه کولو او ساتنې په حال کې دی.

موږ به ژر له ښه امکاناتو سره ستاسو خدمت ته وروستون.
`,
    en: `
⚙️ The site is currently under maintenance and updates.

We'll be back soon with better features to serve you.
`,
    ar: `
⚙️ الموقع قيد الصيانة والتحديث حاليًا.

سنعود قريبًا بميزات أفضل لخدمتك.
`,
    fr: `
⚙️ Le site est actuellement en maintenance et en cours de mise à jour.

Nous serons bientôt de retour avec de meilleures fonctionnalités pour vous servir.
`,
    de: `
⚙️ Die Website befindet sich derzeit in Wartung und wird aktualisiert.

Wir sind bald mit besseren Funktionen für dich zurück.
`,
  },

  OFFLINE_MESSAGE: {
    fa: `
📡 شما در حالت آفلاین قرار دارید.

پس از اتصال به اینترنت، امکانات کامل سایت در اختیار شما خواهد بود.
`,
    prs: `
📡 شما در حالت آفلاین قرار دارید.

پس از اتصال به اینترنت، امکانات کامل سایت در اختیار شما خواهد بود.
`,
    ps: `
📡 تاسو د آفلاین حالت کې یاست.

د انټرنیټ سره وصلیدو وروسته، د سایټ بشپړ امکانات به ستاسو په واک کې وي.
`,
    en: `
📡 You're currently offline.

Once you reconnect to the internet, the site's full features will be available to you.
`,
    ar: `
📡 أنت الآن غير متصل بالإنترنت.

بعد الاتصال بالإنترنت، ستكون جميع ميزات الموقع متاحة لك.
`,
    fr: `
📡 Vous êtes actuellement hors ligne.

Une fois reconnecté à internet, toutes les fonctionnalités du site seront à nouveau disponibles.
`,
    de: `
📡 Du bist derzeit offline.

Sobald du wieder mit dem Internet verbunden bist, stehen dir alle Funktionen der Website zur Verfügung.
`,
  },

  HOLIDAY_MESSAGE: {
    fa: `
🎉 تعطیلات مبارک.

براى شما و خانواده محترمتان روزهایى سرشار از آرامش، شادى و موفقیت آرزو مى‌کنیم.
`,
    prs: `
🎉 تعطیلات مبارک.

براى شما و خانواده محترمتان روزهایى سرشار از آرامش، شادى و موفقیت آرزو مى‌کنیم.
`,
    ps: `
🎉 رخصتۍ مو مبارک.

ستاسو او ستاسو درنې کورنۍ ته د آرامۍ، خوښۍ او بریالیتوب څخه ډکې ورځې هیله کوو.
`,
    en: `
🎉 Happy holidays.

We wish you and your family days full of peace, joy, and success.
`,
    ar: `
🎉 عطلة سعيدة.

نتمنى لك ولعائلتك الكريمة أيامًا مليئة بالسكينة والفرح والنجاح.
`,
    fr: `
🎉 Bonnes vacances.

Nous vous souhaitons, à vous et à votre famille, des jours remplis de paix, de joie et de succès.
`,
    de: `
🎉 Schöne Feiertage.

Wir wünschen dir und deiner Familie Tage voller Frieden, Freude und Erfolg.
`,
  },

  EID_MESSAGE: {
    fa: `
🌙 عید شما مبارک.

آرزومندیم لبخند، سلامتى و آرامش همواره میهمان خانه‌هاى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌙 عید شما مبارک.

آرزومندیم لبخند، سلامتى و آرامش همواره میهمان خانه‌هاى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌙 اختر مو مبارک.

هیله لرو مسکا، روغتیا او آرامي تل ستاسو کورونو ته میلمه وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌙 Eid Mubarak.

We hope smiles, health, and peace always fill your home.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌙 عيد سعيد.

نتمنى أن تملأ الابتسامة والصحة والسكينة منزلك دائمًا.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌙 Joyeux Aïd.

Nous espérons que le sourire, la santé et la paix habiteront toujours votre foyer.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌙 Frohes Eid-Fest.

Wir hoffen, Lächeln, Gesundheit und Frieden begleiten dich immer.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  NEW_YEAR_MESSAGE: {
    fa: `
🎊 سال نو مبارک.

باشد که سال جدید، سرشار از برکت، موفقیت و لحظاتى زیبا براى شما و عزیزانتان باشد.
`,
    prs: `
🎊 سال نو مبارک.

باشد که سال جدید، سرشار از برکت، موفقیت و لحظاتى زیبا براى شما و عزیزانتان باشد.
`,
    ps: `
🎊 نوی کال مو مبارک.

هیله لرو نوی کال د برکت، بریالیتوب او ښکلو شیبو څخه ډک وي ستاسو او ستاسو ګرانو لپاره.
`,
    en: `
🎊 Happy New Year.

May the new year be full of blessings, success, and beautiful moments for you and your loved ones.
`,
    ar: `
🎊 عام جديد سعيد.

نتمنى أن يكون العام الجديد مليئًا بالبركة والنجاح واللحظات الجميلة لك ولأحبائك.
`,
    fr: `
🎊 Bonne année.

Que la nouvelle année soit pleine de bénédictions, de succès et de beaux moments pour vous et vos proches.
`,
    de: `
🎊 Frohes neues Jahr.

Möge das neue Jahr voller Segen, Erfolg und schöner Momente für dich und deine Liebsten sein.
`,
  },

  FRIDAY_MESSAGE: {
    fa: `
🌷 جمعه‌تان بخیر.

امیدواریم امروز را در آرامش و شادى در کنار عزیزانتان سپرى نمایید.
`,
    prs: `
🌷 جمعه‌تان بخیر.

امیدواریم امروز را در آرامش و شادى در کنار عزیزانتان سپرى نمایید.
`,
    ps: `
🌷 جمعه مو پیرزو.

هیله لرو نن ورځ په آرامۍ او خوښۍ کې له خپلو ګرانو سره تیره کړئ.
`,
    en: `
🌷 Happy Friday.

We hope you spend today in peace and joy with your loved ones.
`,
    ar: `
🌷 جمعة سعيدة.

نأمل أن تقضي اليوم بسكينة وفرح مع أحبائك.
`,
    fr: `
🌷 Bon vendredi.

Nous espérons que vous passerez aujourd'hui dans la paix et la joie avec vos proches.
`,
    de: `
🌷 Schönen Freitag.

Wir hoffen, du verbringst den heutigen Tag in Frieden und Freude mit deinen Liebsten.
`,
  },

  COUNTRY_MESSAGE: {
    fa: `
🌍 NOORBAND AI به صورت هوشمند زبان، کشور و زمان محلى شما را تشخیص داده و بهترین تجربه کاربرى را براى شما فراهم خواهد کرد.
`,
    prs: `
🌍 NOORBAND AI به صورت هوشمند زبان، کشور و زمان محلى شما را تشخیص داده و بهترین تجربه کاربرى را براى شما فراهم خواهد کرد.
`,
    ps: `
🌍 NOORBAND AI په هوښیارۍ سره ستاسو ژبه، هیواد او ځایی وخت پیژني او تاسو ته غوره تجربه چمتو کوي.
`,
    en: `
🌍 NOORBAND AI intelligently detects your language, country, and local time to provide you with the best experience.
`,
    ar: `
🌍 يكتشف مساعد نوربند جاغوری الذكي بذكاء لغتك وبلدك ووقتك المحلي ليمنحك أفضل تجربة.
`,
    fr: `
🌍 NOORBAND AI détecte intelligemment votre langue, votre pays et votre heure locale pour vous offrir la meilleure expérience.
`,
    de: `
🌍 NOORBAND AI erkennt intelligent deine Sprache, dein Land und deine lokale Zeit, um dir das beste Erlebnis zu bieten.
`,
  },

  WEATHER_MESSAGE: {
    fa: `
☁️ امیدواریم امروز، روزى زیبا و دل‌انگیز براى شما باشد.

NOORBAND AI همواره در کنار شما خواهد بود.
`,
    prs: `
☁️ امیدواریم امروز، روزى زیبا و دل‌انگیز براى شما باشد.

NOORBAND AI همواره در کنار شما خواهد بود.
`,
    ps: `
☁️ هیله لرو نن یوه ښکلې او زړه راښکونکې ورځ وي ستاسو لپاره.

NOORBAND AI به تل ستاسو سره وي.
`,
    en: `
☁️ We hope today is a beautiful, pleasant day for you.

NOORBAND AI will always be by your side.
`,
    ar: `
☁️ نأمل أن يكون اليوم يومًا جميلاً وممتعًا لك.

مساعد نوربند جاغوری الذكي سيكون دائمًا بجانبك.
`,
    fr: `
☁️ Nous espérons que c'est une belle et agréable journée pour vous.

NOORBAND AI sera toujours à vos côtés.
`,
    de: `
☁️ Wir hoffen, heute ist ein schöner, angenehmer Tag für dich.

NOORBAND AI ist immer an deiner Seite.
`,
  },

  NOTIFICATION_MESSAGE: {
    fa: `
🔔 اعلان جدیدى براى شما ثبت شده است.

براى مشاهده جزئیات به بخش اعلان‌ها مراجعه نمایید.
`,
    prs: `
🔔 اعلان جدیدى براى شما ثبت شده است.

براى مشاهده جزئیات به بخش اعلان‌ها مراجعه نمایید.
`,
    ps: `
🔔 یوه نوې خبرتیا ستاسو لپاره ثبت شوې ده.

د جزئیاتو د لیدو لپاره خبرتیاوو برخې ته مراجعه وکړئ.
`,
    en: `
🔔 A new notification has been recorded for you.

Visit the notifications section to see the details.
`,
    ar: `
🔔 تم تسجيل إشعار جديد لك.

لمشاهدة التفاصيل، يرجى زيارة قسم الإشعارات.
`,
    fr: `
🔔 Une nouvelle notification a été enregistrée pour vous.

Visitez la section des notifications pour voir les détails.
`,
    de: `
🔔 Eine neue Benachrichtigung wurde für dich erfasst.

Besuche den Benachrichtigungsbereich, um die Details zu sehen.
`,
  },

  SUCCESS_MESSAGE: {
    fa: `
✅ عملیات مورد نظر شما با موفقیت انجام شد.

از همراهى شما سپاسگزاریم.
`,
    prs: `
✅ عملیات مورد نظر شما با موفقیت انجام شد.

از همراهى شما سپاسگزاریم.
`,
    ps: `
✅ ستاسو موردنظر عملیه په بریالیتوب سره ترسره شوه.

ستاسو له ملګرتیا څخه مننه کوو.
`,
    en: `
✅ Your requested action was completed successfully.

Thank you for your support.
`,
    ar: `
✅ تمت العملية المطلوبة بنجاح.

نشكرك على دعمك.
`,
    fr: `
✅ L'opération demandée a été effectuée avec succès.

Merci pour votre soutien.
`,
    de: `
✅ Der gewünschte Vorgang wurde erfolgreich abgeschlossen.

Danke für deine Unterstützung.
`,
  },

  ERROR_MESSAGE: {
    fa: `
❌ متأسفانه خطایى رخ داده است.

لطفاً مجدداً تلاش نمایید و در صورت نیاز با پشتیبانى در ارتباط باشید.
`,
    prs: `
❌ متأسفانه خطایى رخ داده است.

لطفاً مجدداً تلاش نمایید و در صورت نیاز با پشتیبانى در ارتباط باشید.
`,
    ps: `
❌ له بده مرغه یوه تیروتنه رامنځته شوه.

مهرباني وکړئ بیا هڅه وکړئ او که اړتیا وي له ملاتړ سره اړیکه ونیسئ.
`,
    en: `
❌ Unfortunately, an error occurred.

Please try again, and contact support if needed.
`,
    ar: `
❌ للأسف حدث خطأ.

يرجى المحاولة مرة أخرى، والتواصل مع الدعم إذا لزم الأمر.
`,
    fr: `
❌ Malheureusement, une erreur s'est produite.

Veuillez réessayer et contacter le support si nécessaire.
`,
    de: `
❌ Leider ist ein Fehler aufgetreten.

Bitte versuche es erneut und wende dich bei Bedarf an den Support.
`,
  },

  PASSWORD_RESET_MESSAGE: {
    fa: `
🔐 درخواست تغییر رمز عبور شما با موفقیت ثبت شد.

براى حفظ امنیت حساب کاربرى خود، از رمز عبورى قوى استفاده نمایید.
`,
    prs: `
🔐 درخواست تغییر رمز عبور شما با موفقیت ثبت شد.

براى حفظ امنیت حساب کاربرى خود، از رمز عبورى قوى استفاده نمایید.
`,
    ps: `
🔐 ستاسو د پټنوم بدلولو غوښتنه په بریالیتوب سره ثبت شوه.

د خپل حساب امنیت ساتلو لپاره، له یو قوي پټنوم څخه ګټه پورته کړئ.
`,
    en: `
🔐 Your password reset request has been recorded successfully.

Use a strong password to keep your account secure.
`,
    ar: `
🔐 تم تسجيل طلب إعادة تعيين كلمة المرور بنجاح.

استخدم كلمة مرور قوية للحفاظ على أمان حسابك.
`,
    fr: `
🔐 Votre demande de réinitialisation du mot de passe a été enregistrée avec succès.

Utilisez un mot de passe fort pour protéger votre compte.
`,
    de: `
🔐 Deine Anfrage zum Zurücksetzen des Passworts wurde erfolgreich erfasst.

Verwende ein starkes Passwort, um dein Konto zu schützen.
`,
  },

  BIRTHDAY_MESSAGE: {
    fa: `
🎂 تولدتان مبارک.

خانواده بزرگ نوربند جاغوری براى شما سلامتى، آرامش و موفقیت روزافزون آرزو مى‌کند.

امروز روز شما است؛ شاد و سربلند باشید.

💜
`,
    prs: `
🎂 تولدتان مبارک.

خانواده بزرگ نوربند جاغوری براى شما سلامتى، آرامش و موفقیت روزافزون آرزو مى‌کند.

امروز روز شما است؛ شاد و سربلند باشید.

💜
`,
    ps: `
🎂 زیږونې مو مبارک.

د نوربند جاغوری لویه کورنۍ ستاسو لپاره روغتیا، آرامي او ورځ په ورځ بریالیتوب هیله کوي.

نن ستاسو ورځ ده؛ خوشحاله او سرلوړی اوسئ.

💜
`,
    en: `
🎂 Happy Birthday.

The NOORBAND Jaghori family wishes you health, peace, and ever-growing success.

Today is your day — be happy and proud.

💜
`,
    ar: `
🎂 عيد ميلاد سعيد.

تتمنى لك عائلة نوربند جاغوری الكبيرة الصحة والسكينة والنجاح المتزايد.

اليوم هو يومك؛ كن سعيدًا وفخورًا.

💜
`,
    fr: `
🎂 Joyeux anniversaire.

La famille NOORBAND Jaghori vous souhaite santé, paix et succès grandissant.

Aujourd'hui c'est votre jour ; soyez heureux et fier.

💜
`,
    de: `
🎂 Alles Gute zum Geburtstag.

Die NOORBAND Jaghori-Familie wünscht dir Gesundheit, Frieden und wachsenden Erfolg.

Heute ist dein Tag — sei glücklich und stolz.

💜
`,
  },

  ANNIVERSARY_MESSAGE: {
    fa: `
🎉 سالروز همراهى شما با خانواده بزرگ نوربند جاغوری مبارک.

از اعتماد و همراهى ارزشمندتان صمیمانه سپاسگزاریم.
`,
    prs: `
🎉 سالروز همراهى شما با خانواده بزرگ نوربند جاغوری مبارک.

از اعتماد و همراهى ارزشمندتان صمیمانه سپاسگزاریم.
`,
    ps: `
🎉 د نوربند جاغوری لویې کورنۍ سره ستاسو د ملګرتیا کلیزه مبارک.

ستاسو ارزښتناک باور او ملګرتیا ته له زړه مننه کوو.
`,
    en: `
🎉 Happy anniversary of your journey with the NOORBAND Jaghori family.

We sincerely thank you for your valuable trust and loyalty.
`,
    ar: `
🎉 عيد ميلاد سعيد لرفقتك مع عائلة نوربند جاغوری الكبيرة.

نشكرك بحرارة على ثقتك وولائك القيّمين.
`,
    fr: `
🎉 Joyeux anniversaire de votre parcours avec la famille NOORBAND Jaghori.

Nous vous remercions sincèrement pour votre précieuse confiance et fidélité.
`,
    de: `
🎉 Alles Gute zum Jahrestag deiner Reise mit der NOORBAND Jaghori-Familie.

Wir danken dir herzlich für dein wertvolles Vertrauen und deine Treue.
`,
  },

  FIRST_VISIT_MESSAGE: {
    fa: `
🌷 به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

از اینکه براى نخستین بار میهمان ما هستید، بسیار خوشحالیم.

امیدواریم آغازى براى همراهى همیشگى شما با خانواده بزرگ نوربند جاغوری باشد.

NOORBAND AI به صورت ۲۴ ساعته آماده راهنمایى و پاسخگویى به شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

از اینکه براى نخستین بار میهمان ما هستید، بسیار خوشحالیم.

امیدواریم آغازى براى همراهى همیشگى شما با خانواده بزرگ نوربند جاغوری باشد.

NOORBAND AI به صورت ۲۴ ساعته آماده راهنمایى و پاسخگویى به شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 د سیمساري نوربند جاغوری جاغوري لویې کورنۍ ته ښه راغلاست.

ډیر خوشحاله یو چې لومړی ځل زموږ میلمه یاست.

هیله لرو دا د نوربند جاغوری لویې کورنۍ سره د تل ملګرتیا پیل وي.

NOORBAND AI به ۲۴ ساعته ستاسو د لارښوونې او ځواب ورکولو لپاره چمتو وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 Welcome to the great NOORBAND Jaghori pawnshop family.

We're so happy you're visiting us for the first time.

We hope this is the start of a lasting relationship with the NOORBAND Jaghori family.

NOORBAND AI is available 24/7 to guide and assist you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 مرحبًا بك في عائلة نوربند جاغوری جاغوري الكبيرة للرهونات.

يسعدنا كثيرًا زيارتك لنا للمرة الأولى.

نأمل أن تكون هذه بداية علاقة دائمة مع عائلة نوربند جاغوری الكبيرة.

مساعد نوربند جاغوری الذكي متاح ٢٤ ساعة لإرشادك ومساعدتك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Bienvenue dans la grande famille du prêteur sur gages NOORBAND Jaghori.

Nous sommes ravis que vous nous rendiez visite pour la première fois.

Nous espérons que c'est le début d'une relation durable avec la famille NOORBAND Jaghori.

NOORBAND AI est disponible 24h/24 pour vous guider et vous aider.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Willkommen in der großen NOORBAND Jaghori-Jaghori-Pfandhausfamilie.

Wir freuen uns sehr, dass du uns zum ersten Mal besuchst.

Wir hoffen, dies ist der Beginn einer dauerhaften Beziehung mit der NOORBAND Jaghori-Familie.

NOORBAND AI steht dir rund um die Uhr zur Verfügung.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  THANK_YOU_MESSAGE: {
    fa: `
💜 از اعتماد ارزشمند شما صمیمانه سپاسگزاریم.

لبخند رضایت شما، بزرگ‌ترین افتخار ما است.

همواره تلاش خواهیم کرد بهترین تجربه خرید را براى شما فراهم کنیم.

سپاس که نوربند جاغوری را انتخاب کرده‌اید.
`,
    prs: `
💜 از اعتماد ارزشمند شما صمیمانه سپاسگزاریم.

لبخند رضایت شما، بزرگ‌ترین افتخار ما است.

همواره تلاش خواهیم کرد بهترین تجربه خرید را براى شما فراهم کنیم.

سپاس که نوربند جاغوری را انتخاب کرده‌اید.
`,
    ps: `
💜 ستاسو ارزښتناک باور ته له زړه مننه کوو.

ستاسو د رضایت مسکا زموږ ترټولو لوی افتخار دی.

موږ به تل هڅه وکړو ستاسو لپاره غوره پیرودنه تجربه چمتو کړو.

مننه چې نوربند جاغوری مو غوره کړ.
`,
    en: `
💜 We sincerely thank you for your valuable trust.

Your satisfied smile is our greatest honor.

We'll always strive to provide you with the best shopping experience.

Thank you for choosing NOORBAND Jaghori.
`,
    ar: `
💜 نشكرك بحرارة على ثقتك القيّمة.

ابتسامتك الراضية هي أعظم فخر لنا.

سنسعى دائمًا لتقديم أفضل تجربة تسوق لك.

شكرًا لاختيارك نوربند جاغوری.
`,
    fr: `
💜 Nous vous remercions sincèrement pour votre précieuse confiance.

Votre sourire satisfait est notre plus grande fierté.

Nous nous efforcerons toujours de vous offrir la meilleure expérience d'achat.

Merci d'avoir choisi NOORBAND Jaghori.
`,
    de: `
💜 Wir danken dir herzlich für dein wertvolles Vertrauen.

Dein zufriedenes Lächeln ist unser größter Stolz.

Wir werden uns stets bemühen, dir das beste Einkaufserlebnis zu bieten.

Danke, dass du dich für NOORBAND Jaghori entschieden hast.
`,
  },

  NEW_PRODUCT_MESSAGE: {
    fa: `
🛍 محصولات جدید نوربند جاغوری هم‌اکنون در دسترس شما قرار گرفته‌اند.

از جدیدترین محصولات و پیشنهادهاى ویژه ما بازدید فرمایید.

امیدواریم بهترین انتخاب را داشته باشید.
`,
    prs: `
🛍 محصولات جدید نوربند جاغوری هم‌اکنون در دسترس شما قرار گرفته‌اند.

از جدیدترین محصولات و پیشنهادهاى ویژه ما بازدید فرمایید.

امیدواریم بهترین انتخاب را داشته باشید.
`,
    ps: `
🛍 د نوربند جاغوری نوي محصولات همدا اوس ستاسو لپاره شتون لري.

زموږ له وروستیو محصولاتو او ځانګړو وړاندیزونو لیدنه وکړئ.

هیله لرو غوره انتخاب ولرئ.
`,
    en: `
🛍 New NOORBAND Jaghori products are now available to you.

Check out our latest products and special offers.

We hope you make the best choice.
`,
    ar: `
🛍 منتجات نوربند جاغوری الجديدة متوفرة لك الآن.

تصفح أحدث منتجاتنا وعروضنا الخاصة.

نتمنى أن يكون لديك أفضل اختيار.
`,
    fr: `
🛍 Les nouveaux produits NOORBAND Jaghori sont maintenant disponibles pour vous.

Découvrez nos derniers produits et offres spéciales.

Nous espérons que vous ferez le meilleur choix.
`,
    de: `
🛍 Neue NOORBAND Jaghori-Produkte sind jetzt für dich verfügbar.

Sieh dir unsere neuesten Produkte und Sonderangebote an.

Wir hoffen, du triffst die beste Wahl.
`,
  },

  NEW_DISCOUNT_MESSAGE: {
    fa: `
🎊 تخفیف‌هاى جدید نوربند جاغوری فعال شدند.

همین حالا از محصولات تخفیف‌دار بازدید نمایید.

فرصت‌هاى ویژه در انتظار شما هستند.
`,
    prs: `
🎊 تخفیف‌هاى جدید نوربند جاغوری فعال شدند.

همین حالا از محصولات تخفیف‌دار بازدید نمایید.

فرصت‌هاى ویژه در انتظار شما هستند.
`,
    ps: `
🎊 د نوربند جاغوری نوي تخفیفونه فعال شول.

همدا اوس د تخفیف لرونکو محصولاتو لیدنه وکړئ.

ځانګړي فرصتونه ستاسو په تمه دي.
`,
    en: `
🎊 New NOORBAND Jaghori discounts are now active.

Check out the discounted products right now.

Special opportunities are waiting for you.
`,
    ar: `
🎊 تفعّلت خصومات نوربند جاغوری الجديدة.

تصفح المنتجات المخفّضة الآن.

فرص خاصة بانتظارك.
`,
    fr: `
🎊 De nouvelles remises NOORBAND Jaghori sont maintenant actives.

Découvrez les produits en promotion dès maintenant.

Des opportunités spéciales vous attendent.
`,
    de: `
🎊 Neue NOORBAND Jaghori-Rabatte sind jetzt aktiv.

Sieh dir jetzt die reduzierten Produkte an.

Besondere Gelegenheiten warten auf dich.
`,
  },

  FIRST_PRODUCT_MESSAGE: {
    fa: `
✨ اولین محصول مورد علاقه شما پیدا شد.

NOORBAND AI پیشنهادهاى ویژه و محصولات مشابه را نیز براى شما آماده کرده است.

امیدواریم تجربه‌اى شیرین از خرید داشته باشید.
`,
    prs: `
✨ اولین محصول مورد علاقه شما پیدا شد.

NOORBAND AI پیشنهادهاى ویژه و محصولات مشابه را نیز براى شما آماده کرده است.

امیدواریم تجربه‌اى شیرین از خرید داشته باشید.
`,
    ps: `
✨ ستاسو لومړی مورد علاقه محصول وموندل شو.

NOORBAND AI ورته ورته محصولات او ځانګړي وړاندیزونه هم ستاسو لپاره چمتو کړي دي.

هیله لرو له پیرودنې څخه خوږه تجربه ولرئ.
`,
    en: `
✨ Your first favorite product was found.

NOORBAND AI has also prepared special offers and similar products for you.

We hope you have a sweet shopping experience.
`,
    ar: `
✨ تم العثور على أول منتج مفضّل لديك.

أعدّ مساعد نوربند جاغوری الذكي أيضًا عروضًا خاصة ومنتجات مشابهة لك.

نتمنى أن تحظى بتجربة تسوق ممتعة.
`,
    fr: `
✨ Votre premier produit favori a été trouvé.

NOORBAND AI a également préparé des offres spéciales et des produits similaires pour vous.

Nous espérons que vous aurez une expérience d'achat agréable.
`,
    de: `
✨ Dein erstes Lieblingsprodukt wurde gefunden.

NOORBAND AI hat auch spezielle Angebote und ähnliche Produkte für dich vorbereitet.

Wir hoffen, du hast ein angenehmes Einkaufserlebnis.
`,
  },

  WEEKEND_MESSAGE: {
    fa: `
🌷 آخر هفته شما بخیر.

امیدواریم روزهایى سرشار از آرامش، شادى و لحظاتى زیبا در کنار عزیزانتان داشته باشید.

نوربند جاغوری همواره در کنار شما خواهد بود.
`,
    prs: `
🌷 آخر هفته شما بخیر.

امیدواریم روزهایى سرشار از آرامش، شادى و لحظاتى زیبا در کنار عزیزانتان داشته باشید.

نوربند جاغوری همواره در کنار شما خواهد بود.
`,
    ps: `
🌷 د اونۍ اخر مو پیرزو.

هیله لرو د آرامۍ، خوښۍ او ښکلو شیبو څخه ډکې ورځې له خپلو ګرانو سره ولرئ.

نوربند جاغوری به تل ستاسو سره وي.
`,
    en: `
🌷 Happy weekend.

We hope your days are full of peace, joy, and beautiful moments with your loved ones.

NOORBAND Jaghori will always be by your side.
`,
    ar: `
🌷 عطلة نهاية أسبوع سعيدة.

نأمل أن تحظى بأيام مليئة بالسكينة والفرح واللحظات الجميلة مع أحبائك.

نوربند جاغوری سيكون دائمًا بجانبك.
`,
    fr: `
🌷 Bon week-end.

Nous espérons que vous passerez des jours remplis de paix, de joie et de beaux moments avec vos proches.

NOORBAND Jaghori sera toujours à vos côtés.
`,
    de: `
🌷 Schönes Wochenende.

Wir hoffen, du verbringst Tage voller Frieden, Freude und schöner Momente mit deinen Liebsten.

NOORBAND Jaghori ist immer an deiner Seite.
`,
  },

  RAMADAN_MESSAGE: {
    fa: `
🌙 فرا رسیدن ماه مبارک رمضان را به شما و خانواده محترمتان تبریک عرض مى‌کنیم.

آرزومندیم این ماه سراسر خیر، برکت، آرامش و سلامتى براى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌙 فرا رسیدن ماه مبارک رمضان را به شما و خانواده محترمتان تبریک عرض مى‌کنیم.

آرزومندیم این ماه سراسر خیر، برکت، آرامش و سلامتى براى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌙 د روژې مبارک میاشت ته ننوتل مو مبارک وي تاسو او ستاسو درنې کورنۍ ته.

هیله لرو دا میاشت ستاسو لپاره له خیر، برکت، آرامۍ او روغتیا څخه ډکه وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌙 We congratulate you and your family on the arrival of the holy month of Ramadan.

We wish this month brings you goodness, blessings, peace, and health.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌙 نهنئكم ونهنئ عائلتكم الكريمة بحلول شهر رمضان المبارك.

نتمنى أن يكون هذا الشهر مليئًا بالخير والبركة والسكينة والصحة لكم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌙 Nous vous félicitons, vous et votre famille, pour l'arrivée du mois béni de Ramadan.

Que ce mois vous apporte bonté, bénédictions, paix et santé.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌙 Wir gratulieren dir und deiner Familie zum Beginn des heiligen Monats Ramadan.

Möge dieser Monat dir Güte, Segen, Frieden und Gesundheit bringen.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  EID_AL_FITR_MESSAGE: {
    fa: `
🌙 عید سعید فطر مبارک.

قبولى طاعات و عبادات شما را از درگاه خداوند متعال مسئلت داریم.

سلامتى، آرامش و موفقیت روزافزون آرزوى ما براى شما است.
`,
    prs: `
🌙 عید سعید فطر مبارک.

قبولى طاعات و عبادات شما را از درگاه خداوند متعال مسئلت داریم.

سلامتى، آرامش و موفقیت روزافزون آرزوى ما براى شما است.
`,
    ps: `
🌙 د اختر مبارک.

ستاسو لمونځونه او عبادتونه دې قبول شي.

روغتیا، آرامي او ورځ په ورځ بریالیتوب موږ ستاسو لپاره هیله کوو.
`,
    en: `
🌙 Happy Eid al-Fitr.

May your prayers and devotion be accepted.

We wish you health, peace, and ever-growing success.
`,
    ar: `
🌙 عيد فطر سعيد.

نسأل الله تقبّل صلواتكم وعباداتكم.

نتمنى لكم الصحة والسكينة والنجاح المتزايد.
`,
    fr: `
🌙 Joyeux Aïd al-Fitr.

Que vos prières et votre dévotion soient acceptées.

Nous vous souhaitons santé, paix et succès grandissant.
`,
    de: `
🌙 Frohes Eid al-Fitr.

Mögen deine Gebete und deine Hingabe angenommen werden.

Wir wünschen dir Gesundheit, Frieden und wachsenden Erfolg.
`,
  },

  EID_AL_ADHA_MESSAGE: {
    fa: `
🐑 عید سعید قربان مبارک.

باشد که این عید فرخنده، سرشار از خیر، برکت و آرامش براى شما و خانواده محترمتان باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🐑 عید سعید قربان مبارک.

باشد که این عید فرخنده، سرشار از خیر، برکت و آرامش براى شما و خانواده محترمتان باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🐑 د قربان اختر مو مبارک.

دا برکتي اختر دې تاسو او ستاسو درنې کورنۍ لپاره له خیر، برکت او آرامۍ ډک وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🐑 Happy Eid al-Adha.

May this blessed Eid be full of goodness, blessings, and peace for you and your family.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🐑 عيد أضحى سعيد.

نتمنى أن يكون هذا العيد المبارك مليئًا بالخير والبركة والسكينة لكم ولعائلتكم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🐑 Joyeux Aïd al-Adha.

Que cet Aïd béni soit rempli de bonté, de bénédictions et de paix pour vous et votre famille.

💜 La famille NOORBAND Jaghori
`,
    de: `
🐑 Frohes Eid al-Adha.

Möge dieses gesegnete Fest voller Güte, Segen und Frieden für dich und deine Familie sein.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  RATE_US_MESSAGE: {
    fa: `
⭐ نظر شما براى ما بسیار ارزشمند است.

با ثبت دیدگاه خود، ما را در ارائه خدمات بهتر یارى فرمایید.

سپاس از همراهى همیشگى شما.
`,
    prs: `
⭐ نظر شما براى ما بسیار ارزشمند است.

با ثبت دیدگاه خود، ما را در ارائه خدمات بهتر یارى فرمایید.

سپاس از همراهى همیشگى شما.
`,
    ps: `
⭐ ستاسو نظر زموږ لپاره ډیر ارزښتناک دی.

د خپل نظر ثبتولو سره، موږ سره د غوره خدماتو وړاندې کولو کې مرسته وکړئ.

ستاسو له تل ملګرتیا څخه مننه.
`,
    en: `
⭐ Your opinion is very valuable to us.

By leaving a review, you help us provide better service.

Thank you for your continued support.
`,
    ar: `
⭐ رأيك قيّم جدًا بالنسبة لنا.

من خلال تسجيل رأيك، ساعدنا في تقديم خدمة أفضل.

شكرًا على دعمك الدائم.
`,
    fr: `
⭐ Votre avis est très précieux pour nous.

En laissant un avis, vous nous aidez à offrir un meilleur service.

Merci pour votre soutien continu.
`,
    de: `
⭐ Deine Meinung ist uns sehr wichtig.

Mit deiner Bewertung hilfst du uns, einen besseren Service zu bieten.

Danke für deine fortwährende Unterstützung.
`,
  },

  OUT_OF_STOCK_MESSAGE: {
    fa: `
📦 متأسفانه این محصول در حال حاضر ناموجود است.

به محض موجود شدن، از طریق اعلان‌هاى سایت به شما اطلاع داده خواهد شد.
`,
    prs: `
📦 متأسفانه این محصول در حال حاضر ناموجود است.

به محض موجود شدن، از طریق اعلان‌هاى سایت به شما اطلاع داده خواهد شد.
`,
    ps: `
📦 له بده مرغه دا محصول اوس مهال ناموجود دی.

په موجودیدو سره سمدلاسه به د سایټ خبرتیاوو له لارې خبر شئ.
`,
    en: `
📦 Unfortunately, this product is currently out of stock.

You'll be notified through the site's notifications as soon as it's back in stock.
`,
    ar: `
📦 للأسف هذا المنتج غير متوفر حاليًا.

ستُبلَّغ عبر إشعارات الموقع فور توفره.
`,
    fr: `
📦 Malheureusement, ce produit est actuellement en rupture de stock.

Vous serez notifié via les notifications du site dès qu'il sera disponible.
`,
    de: `
📦 Leider ist dieses Produkt derzeit nicht auf Lager.

Sobald es wieder verfügbar ist, wirst du über die Benachrichtigungen der Website informiert.
`,
  },

  LOW_STOCK_MESSAGE: {
    fa: `
⚠️ موجودى این محصول محدود است.

براى ثبت سفارش، فرصت را از دست ندهید.
`,
    prs: `
⚠️ موجودى این محصول محدود است.

براى ثبت سفارش، فرصت را از دست ندهید.
`,
    ps: `
⚠️ د دې محصول موجودي محدوده ده.

د امر ثبتولو لپاره، فرصت له لاسه مه ورکوئ.
`,
    en: `
⚠️ Stock for this product is limited.

Don't miss the chance to place your order.
`,
    ar: `
⚠️ مخزون هذا المنتج محدود.

لا تفوّت فرصة تسجيل طلبك.
`,
    fr: `
⚠️ Le stock de ce produit est limité.

Ne manquez pas l'occasion de passer votre commande.
`,
    de: `
⚠️ Der Bestand dieses Produkts ist begrenzt.

Verpasse nicht die Gelegenheit, deine Bestellung aufzugeben.
`,
  },

  BACK_IN_STOCK_MESSAGE: {
    fa: `
🎉 خبر خوب!

محصول مورد نظر شما مجدداً موجود شده است.

همین حالا مى‌توانید سفارش خود را ثبت نمایید.
`,
    prs: `
🎉 خبر خوب!

محصول مورد نظر شما مجدداً موجود شده است.

همین حالا مى‌توانید سفارش خود را ثبت نمایید.
`,
    ps: `
🎉 ښه خبر!

ستاسو موردنظر محصول بیا موجود شو.

همدا اوس کولی شئ خپله پیرودنه ثبت کړئ.
`,
    en: `
🎉 Good news!

The product you wanted is back in stock.

You can place your order right now.
`,
    ar: `
🎉 خبر سار!

المنتج الذي أردته أصبح متوفرًا مجددًا.

يمكنك تسجيل طلبك الآن.
`,
    fr: `
🎉 Bonne nouvelle !

Le produit que vous vouliez est de nouveau en stock.

Vous pouvez passer votre commande dès maintenant.
`,
    de: `
🎉 Gute Nachricht!

Das gewünschte Produkt ist wieder auf Lager.

Du kannst deine Bestellung jetzt aufgeben.
`,
  },

  DELIVERY_DELAY_MESSAGE: {
    fa: `
🚚 با پوزش، ارسال سفارش شما با اندکى تأخیر همراه شده است.

از شکیبایى و همراهى ارزشمند شما سپاسگزاریم.

تمام تلاش ما، تحویل هرچه سریع‌تر سفارش شما است.
`,
    prs: `
🚚 با پوزش، ارسال سفارش شما با اندکى تأخیر همراه شده است.

از شکیبایى و همراهى ارزشمند شما سپاسگزاریم.

تمام تلاش ما، تحویل هرچه سریع‌تر سفارش شما است.
`,
    ps: `
🚚 بښنه غواړو، ستاسو د پیرودنې لیږد لږ ځنډ سره مخ شوی دی.

ستاسو له ارزښتناک زغم او ملګرتیا څخه مننه کوو.

زموږ ټوله هڅه ستاسو د پیرودنې تر ټولو ژر وسپارل دي.
`,
    en: `
🚚 We apologize, your order's delivery has been slightly delayed.

Thank you for your valuable patience and support.

We're doing everything we can to deliver your order as soon as possible.
`,
    ar: `
🚚 نعتذر، تأخر شحن طلبك قليلاً.

نشكرك على صبرك ودعمك القيّمين.

نبذل قصارى جهدنا لتسليم طلبك في أسرع وقت ممكن.
`,
    fr: `
🚚 Nous nous excusons, la livraison de votre commande a pris un léger retard.

Merci pour votre précieuse patience et votre soutien.

Nous faisons tout notre possible pour livrer votre commande le plus rapidement possible.
`,
    de: `
🚚 Entschuldigung, die Lieferung deiner Bestellung hat sich leicht verzögert.

Danke für deine wertvolle Geduld und Unterstützung.

Wir tun alles, um deine Bestellung so schnell wie möglich zu liefern.
`,
  },

  INSTALL_PWA_MESSAGE: {
    fa: `
📱 براى دسترسى سریع‌تر و تجربه‌اى بهتر، مى‌توانید نوربند جاغوری را بر روى تلفن همراه خود نصب نمایید.

تنها با یک لمس، فروشگاه همیشه در کنار شما خواهد بود.
`,
    prs: `
📱 براى دسترسى سریع‌تر و تجربه‌اى بهتر، مى‌توانید نوربند جاغوری را بر روى تلفن همراه خود نصب نمایید.

تنها با یک لمس، فروشگاه همیشه در کنار شما خواهد بود.
`,
    ps: `
📱 د چټکې لاسرسي او غوره تجربې لپاره، تاسو کولی شئ نوربند جاغوری د خپل ګرځنده تلیفون کې نصب کړئ.

یوازې د یو لمس سره، پلورنځی به تل ستاسو سره وي.
`,
    en: `
📱 For faster access and a better experience, you can install NOORBAND Jaghori on your phone.

With just one tap, the store will always be at your fingertips.
`,
    ar: `
📱 للوصول الأسرع وتجربة أفضل، يمكنك تثبيت نوربند جاغوری على هاتفك.

بلمسة واحدة فقط، سيكون المتجر دائمًا بين يديك.
`,
    fr: `
📱 Pour un accès plus rapide et une meilleure expérience, vous pouvez installer NOORBAND Jaghori sur votre téléphone.

En un seul geste, la boutique sera toujours à portée de main.
`,
    de: `
📱 Für schnelleren Zugriff und ein besseres Erlebnis kannst du NOORBAND Jaghori auf deinem Handy installieren.

Mit nur einem Fingertipp ist der Shop immer griffbereit.
`,
  },

  UPDATE_MESSAGE: {
    fa: `
🚀 نسخه جدید نوربند جاغوری با امکاناتى بیشتر در دسترس قرار گرفت.

از همراهى شما سپاسگزاریم.

امیدواریم تجربه‌اى بهتر و لذت‌بخش‌تر داشته باشید.
`,
    prs: `
🚀 نسخه جدید نوربند جاغوری با امکاناتى بیشتر در دسترس قرار گرفت.

از همراهى شما سپاسگزاریم.

امیدواریم تجربه‌اى بهتر و لذت‌بخش‌تر داشته باشید.
`,
    ps: `
🚀 د نوربند جاغوری نوې نسخه له ډیرو امکاناتو سره شتون ومونده.

ستاسو له ملګرتیا څخه مننه کوو.

هیله لرو غوره او خوندورې تجربه ولرئ.
`,
    en: `
🚀 A new version of NOORBAND Jaghori with more features is now available.

Thank you for your support.

We hope you have a better, more enjoyable experience.
`,
    ar: `
🚀 توفرت نسخة جديدة من نوربند جاغوری بميزات أكثر.

نشكرك على دعمك.

نأمل أن تحظى بتجربة أفضل وأكثر متعة.
`,
    fr: `
🚀 Une nouvelle version de NOORBAND Jaghori avec plus de fonctionnalités est disponible.

Merci pour votre soutien.

Nous espérons que vous aurez une expérience meilleure et plus agréable.
`,
    de: `
🚀 Eine neue Version von NOORBAND Jaghori mit mehr Funktionen ist jetzt verfügbar.

Danke für deine Unterstützung.

Wir hoffen, du hast ein besseres und angenehmeres Erlebnis.
`,
  },

  PUSH_NOTIFICATION_MESSAGE: {
    fa: `
🔔 با فعال‌سازى اعلان‌ها، از جدیدترین محصولات، تخفیف‌ها و پیشنهادهاى ویژه نوربند جاغوری مطلع شوید.
`,
    prs: `
🔔 با فعال‌سازى اعلان‌ها، از جدیدترین محصولات، تخفیف‌ها و پیشنهادهاى ویژه نوربند جاغوری مطلع شوید.
`,
    ps: `
🔔 د خبرتیاوو فعالولو سره، د نوربند جاغوری وروستیو محصولاتو، تخفیفونو او ځانګړو وړاندیزونو څخه خبر شئ.
`,
    en: `
🔔 Turn on notifications to stay updated on NOORBAND Jaghori's latest products, discounts, and special offers.
`,
    ar: `
🔔 بتفعيل الإشعارات، ابقَ على اطلاع بأحدث منتجات وخصومات وعروض نوربند جاغوری الخاصة.
`,
    fr: `
🔔 En activant les notifications, restez informé des derniers produits, remises et offres spéciales de NOORBAND Jaghori.
`,
    de: `
🔔 Aktiviere Benachrichtigungen, um über die neuesten Produkte, Rabatte und Sonderangebote von NOORBAND Jaghori informiert zu bleiben.
`,
  },

  SELLER_MESSAGE: {
    fa: `
🛍 فروشنده گرامى نوربند جاغوری، خوش آمدید.

از تلاش و همراهى ارزشمند شما سپاسگزاریم.

امروز نیز فرصت‌هاى جدیدى براى فروش و موفقیت در انتظار شما است.

براى شما تجارتى پربرکت و سرشار از موفقیت آرزو مى‌کنیم.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🛍 فروشنده گرامى نوربند جاغوری، خوش آمدید.

از تلاش و همراهى ارزشمند شما سپاسگزاریم.

امروز نیز فرصت‌هاى جدیدى براى فروش و موفقیت در انتظار شما است.

براى شما تجارتى پربرکت و سرشار از موفقیت آرزو مى‌کنیم.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🛍 د نوربند جاغوری ګران پلورونکي، ښه راغلاست.

ستاسو له ارزښتناکې هڅې او ملګرتیا څخه مننه کوو.

نن هم د پلور او بریالیتوب نوي فرصتونه ستاسو په تمه دي.

موږ تاسو ته یو برکتي او له بریالیتوب ډک سوداګرۍ هیله کوو.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🛍 Welcome, dear NOORBAND Jaghori seller.

Thank you for your valuable effort and dedication.

New opportunities for sales and success await you today too.

We wish you a prosperous, successful business.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🛍 مرحبًا بائع نوربند جاغوری العزيز.

نشكرك على جهدك ودعمك القيّمين.

فرص جديدة للبيع والنجاح تنتظرك اليوم أيضًا.

نتمنى لك تجارة مباركة ومليئة بالنجاح.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🛍 Bienvenue, cher vendeur NOORBAND Jaghori.

Merci pour votre précieux effort et dévouement.

De nouvelles opportunités de vente et de succès vous attendent aujourd'hui aussi.

Nous vous souhaitons un commerce prospère et florissant.

💜 La famille NOORBAND Jaghori
`,
    de: `
🛍 Willkommen, lieber NOORBAND Jaghori-Verkäufer.

Danke für deinen wertvollen Einsatz und deine Hingabe.

Neue Chancen für Verkauf und Erfolg erwarten dich auch heute.

Wir wünschen dir ein florierendes, erfolgreiches Geschäft.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  ADMIN_MESSAGE: {
    fa: `
⚙️ مدیر گرامى، خوش آمدید.

از همراهى و تلاش شما براى مدیریت بهتر خانواده بزرگ نوربند جاغوری سپاسگزاریم.

NOORBAND AI آماده ارائه گزارش‌ها و اعلان‌هاى مدیریتى به شما است.

💜
`,
    prs: `
⚙️ مدیر گرامى، خوش آمدید.

از همراهى و تلاش شما براى مدیریت بهتر خانواده بزرگ نوربند جاغوری سپاسگزاریم.

NOORBAND AI آماده ارائه گزارش‌ها و اعلان‌هاى مدیریتى به شما است.

💜
`,
    ps: `
⚙️ ګران مدیر، ښه راغلاست.

ستاسو له ملګرتیا او هڅې څخه د نوربند جاغوری لویې کورنۍ د غوره مدیریت لپاره مننه کوو.

NOORBAND AI ستاسو لپاره د راپورونو او مدیریتي خبرتیاوو وړاندې کولو ته چمتو دی.

💜
`,
    en: `
⚙️ Welcome, dear admin.

Thank you for your support and effort in better managing the NOORBAND Jaghori family.

NOORBAND AI is ready to provide you with management reports and notifications.

💜
`,
    ar: `
⚙️ مرحبًا أيها المدير العزيز.

نشكرك على دعمك وجهدك لإدارة عائلة نوربند جاغوری الكبيرة بشكل أفضل.

مساعد نوربند جاغوری الذكي مستعد لتقديم التقارير والإشعارات الإدارية لك.

💜
`,
    fr: `
⚙️ Bienvenue, cher administrateur.

Merci pour votre soutien et vos efforts pour mieux gérer la famille NOORBAND Jaghori.

NOORBAND AI est prêt à vous fournir des rapports et des notifications de gestion.

💜
`,
    de: `
⚙️ Willkommen, lieber Administrator.

Danke für deine Unterstützung und deinen Einsatz für ein besseres Management der NOORBAND Jaghori-Familie.

NOORBAND AI liefert dir gerne Berichte und Management-Benachrichtigungen.

💜
`,
  },

  SUPER_ADMIN_MESSAGE: {
    fa: `
👑 مدیر ارشد گرامى، خوش آمدید.

از تلاش‌هاى ارزشمند شما براى توسعه خانواده بزرگ نوربند جاغوری سپاسگزاریم.

امروز نیز امکانات هوشمند مدیریتى در اختیار شما قرار گرفته است.

آرزومندیم همواره موفق و سربلند باشید.
`,
    prs: `
👑 مدیر ارشد گرامى، خوش آمدید.

از تلاش‌هاى ارزشمند شما براى توسعه خانواده بزرگ نوربند جاغوری سپاسگزاریم.

امروز نیز امکانات هوشمند مدیریتى در اختیار شما قرار گرفته است.

آرزومندیم همواره موفق و سربلند باشید.
`,
    ps: `
👑 ګران لوی مدیر، ښه راغلاست.

ستاسو له ارزښتناکو هڅو څخه د نوربند جاغوری لویې کورنۍ د پراختیا لپاره مننه کوو.

نن هم هوښیار مدیریتي امکانات ستاسو په واک کې دي.

هیله لرو تل بریالي او سرلوړي اوسئ.
`,
    en: `
👑 Welcome, dear super admin.

Thank you for your valuable efforts in growing the NOORBAND Jaghori family.

Smart management tools are available to you today as well.

We wish you continued success.
`,
    ar: `
👑 مرحبًا أيها المدير الأعلى العزيز.

نشكرك على جهودك القيّمة لتطوير عائلة نوربند جاغوری الكبيرة.

أدوات الإدارة الذكية متاحة لك اليوم أيضًا.

نتمنى لك دوام النجاح والفخر.
`,
    fr: `
👑 Bienvenue, cher super administrateur.

Merci pour vos précieux efforts dans le développement de la famille NOORBAND Jaghori.

Des outils de gestion intelligents sont à votre disposition aujourd'hui aussi.

Nous vous souhaitons un succès continu.
`,
    de: `
👑 Willkommen, lieber Super-Administrator.

Danke für deine wertvollen Bemühungen um die Weiterentwicklung der NOORBAND Jaghori-Familie.

Intelligente Management-Tools stehen dir auch heute zur Verfügung.

Wir wünschen dir anhaltenden Erfolg.
`,
  },

  VIP_SPECIAL_MESSAGE: {
    fa: `
🌟 عضو ویژه VIP نوربند جاغوری خوش آمدید.

شما از مزایا و خدمات اختصاصى اعضاى ویژه بهره‌مند خواهید شد.

تخفیف‌هاى اختصاصى و پیشنهادهاى ویژه امروز براى شما فعال شده‌اند.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌟 عضو ویژه VIP نوربند جاغوری خوش آمدید.

شما از مزایا و خدمات اختصاصى اعضاى ویژه بهره‌مند خواهید شد.

تخفیف‌هاى اختصاصى و پیشنهادهاى ویژه امروز براى شما فعال شده‌اند.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌟 د نوربند جاغوری ځانګړي VIP غړي ته ښه راغلاست.

تاسو به د ځانګړو غړو له ګټو او خدماتو څخه برخمن شئ.

نن ورځ ځانګړي تخفیفونه او وړاندیزونه ستاسو لپاره فعال شوي دي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌟 Welcome, special NOORBAND Jaghori VIP member.

You'll enjoy the benefits and exclusive services of special members.

Exclusive discounts and special offers have been activated for you today.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌟 مرحبًا بعضو نوربند جاغوری VIP المميز.

ستستفيد من مزايا وخدمات الأعضاء المميزين.

تم تفعيل خصومات وعروض حصرية لك اليوم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌟 Bienvenue, membre VIP spécial NOORBAND Jaghori.

Vous bénéficierez des avantages et services exclusifs des membres spéciaux.

Des remises et offres exclusives ont été activées pour vous aujourd'hui.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌟 Willkommen, besonderes NOORBAND Jaghori-VIP-Mitglied.

Du profitierst von den Vorteilen und exklusiven Services besonderer Mitglieder.

Heute wurden exklusive Rabatte und Angebote für dich freigeschaltet.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  DAILY_SPECIAL_MESSAGE: {
    fa: `
🎁 هدیه امروز نوربند جاغوری براى شما آماده شده است.

پیشنهادهاى ویژه امروز را از دست ندهید.

امیدواریم تجربه‌اى لذت‌بخش و خاطره‌انگیز داشته باشید.
`,
    prs: `
🎁 هدیه امروز نوربند جاغوری براى شما آماده شده است.

پیشنهادهاى ویژه امروز را از دست ندهید.

امیدواریم تجربه‌اى لذت‌بخش و خاطره‌انگیز داشته باشید.
`,
    ps: `
🎁 د نن ورځې د نوربند جاغوری ډالۍ ستاسو لپاره چمتو شوه.

د نن ورځې ځانګړي وړاندیزونه له لاسه مه ورکوئ.

هیله لرو خوندوره او د یادونې وړ تجربه ولرئ.
`,
    en: `
🎁 Today's NOORBAND Jaghori gift is ready for you.

Don't miss today's special offers.

We hope you have an enjoyable, memorable experience.
`,
    ar: `
🎁 هدية نوربند جاغوری اليوم جاهزة لك.

لا تفوّت عروض اليوم الخاصة.

نتمنى أن تحظى بتجربة ممتعة ولا تُنسى.
`,
    fr: `
🎁 Le cadeau du jour de NOORBAND Jaghori est prêt pour vous.

Ne manquez pas les offres spéciales d'aujourd'hui.

Nous espérons que vous vivrez une expérience agréable et mémorable.
`,
    de: `
🎁 NOORBANDs heutiges Geschenk ist bereit für dich.

Verpasse nicht die heutigen Sonderangebote.

Wir hoffen, du machst ein angenehmes, unvergessliches Erlebnis.
`,
  },

  SMART_SUGGESTION_MESSAGE: {
    fa: `
✨ پیشنهاد هوشمند نوربند جاغوری برای شما آماده شد.

NOORBAND AI با بررسی علاقه‌مندی‌ها و نیازهای شما، بهترین محصولات و پیشنهادهای ویژه را انتخاب کرده است.

امیدواریم تجربه‌ای شیرین و خریدی رضایت‌بخش داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
✨ پیشنهاد هوشمند نوربند جاغوری برای شما آماده شد.

NOORBAND AI با بررسی علاقه‌مندی‌ها و نیازهای شما، بهترین محصولات و پیشنهادهای ویژه را انتخاب کرده است.

امیدواریم تجربه‌ای شیرین و خریدی رضایت‌بخش داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
✨ د نوربند جاغوری هوښیار وړاندیز ستاسو لپاره چمتو شو.

NOORBAND AI ستاسو د علاقو او اړتیاوو په کتلو سره، غوره محصولات او ځانګړي وړاندیزونه غوره کړي دي.

هیله لرو خوږه تجربه او رضایت وړونکې پیرودنه ولرئ.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
✨ NOORBAND Jaghori's smart suggestion is ready for you.

By reviewing your interests and needs, NOORBAND AI has chosen the best products and special offers.

We hope you have a sweet experience and a satisfying purchase.

💜 The NOORBAND Jaghori Family
`,
    ar: `
✨ اقتراح نوربند جاغوری الذكي جاهز لك.

من خلال مراجعة اهتماماتك واحتياجاتك، اختار مساعد نوربند جاغوری الذكي أفضل المنتجات والعروض الخاصة.

نأمل أن تحظى بتجربة ممتعة وشراء مُرضٍ.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
✨ La suggestion intelligente de NOORBAND Jaghori est prête pour vous.

En examinant vos intérêts et besoins, NOORBAND AI a choisi les meilleurs produits et offres spéciales.

Nous espérons que vous vivrez une expérience douce et un achat satisfaisant.

💜 La famille NOORBAND Jaghori
`,
    de: `
✨ NOORBANDs intelligenter Vorschlag ist bereit für dich.

Durch die Prüfung deiner Interessen und Bedürfnisse hat NOORBAND AI die besten Produkte und Sonderangebote ausgewählt.

Wir hoffen auf ein süßes Erlebnis und einen zufriedenstellenden Kauf.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SMART_NOTIFICATION_MESSAGE: {
    fa: `
🔔 NOORBAND AI خبر خوبى براى شما دارد.

بر اساس علایق و خریدهاى پیشین شما، پیشنهادهاى اختصاصى جدیدى آماده شده‌اند.

براى مشاهده پیشنهادها به بخش محصولات مراجعه نمایید.
`,
    prs: `
🔔 NOORBAND AI خبر خوبى براى شما دارد.

بر اساس علایق و خریدهاى پیشین شما، پیشنهادهاى اختصاصى جدیدى آماده شده‌اند.

براى مشاهده پیشنهادها به بخش محصولات مراجعه نمایید.
`,
    ps: `
🔔 NOORBAND AI ستاسو لپاره ښه خبر لري.

ستاسو د پخوانیو علاقو او پیرودنو پر بنسټ، نوي ځانګړي وړاندیزونه چمتو شوي دي.

د وړاندیزونو د لیدو لپاره محصولاتو برخې ته مراجعه وکړئ.
`,
    en: `
🔔 NOORBAND AI has good news for you.

Based on your interests and past purchases, new exclusive offers are ready.

Visit the products section to see them.
`,
    ar: `
🔔 لدى مساعد نوربند جاغوری الذكي خبر سار لك.

بناءً على اهتماماتك ومشترياتك السابقة، أُعدّت عروض حصرية جديدة.

لمشاهدة العروض، يرجى زيارة قسم المنتجات.
`,
    fr: `
🔔 NOORBAND AI a de bonnes nouvelles pour vous.

En fonction de vos intérêts et achats précédents, de nouvelles offres exclusives ont été préparées.

Visitez la section des produits pour les voir.
`,
    de: `
🔔 NOORBAND AI hat gute Neuigkeiten für dich.

Basierend auf deinen bisherigen Interessen und Käufen wurden neue exklusive Angebote vorbereitet.

Besuche den Produktbereich, um sie zu sehen.
`,
  },

  SMART_TRANSLATE_MESSAGE: {
    fa: `
🌍 زبان سایت به صورت هوشمند براساس تنظیمات شما انتخاب گردید.

نوربند جاغوری از چندین زبان زنده دنیا پشتیبانى مى‌کند تا تجربه‌اى بهتر براى شما فراهم شود.
`,
    prs: `
🌍 زبان سایت به صورت هوشمند براساس تنظیمات شما انتخاب گردید.

نوربند جاغوری از چندین زبان زنده دنیا پشتیبانى مى‌کند تا تجربه‌اى بهتر براى شما فراهم شود.
`,
    ps: `
🌍 د سایټ ژبه په هوښیارۍ سره ستاسو تنظیماتو پر بنسټ وټاکل شوه.

نوربند جاغوری د نړۍ له څو ژوندیو ژبو ملاتړ کوي ترڅو تاسو ته غوره تجربه چمتو کړي.
`,
    en: `
🌍 The site's language was intelligently selected based on your settings.

NOORBAND Jaghori supports several major world languages to provide you with a better experience.
`,
    ar: `
🌍 تم اختيار لغة الموقع بذكاء بناءً على إعداداتك.

يدعم نوربند جاغوری عدة لغات عالمية حية لتوفير تجربة أفضل لك.
`,
    fr: `
🌍 La langue du site a été sélectionnée intelligemment selon vos paramètres.

NOORBAND Jaghori prend en charge plusieurs langues mondiales majeures pour vous offrir une meilleure expérience.
`,
    de: `
🌍 Die Sprache der Website wurde intelligent basierend auf deinen Einstellungen ausgewählt.

NOORBAND Jaghori unterstützt mehrere wichtige Weltsprachen, um dir ein besseres Erlebnis zu bieten.
`,
  },

  SMART_THEME_MESSAGE: {
    fa: `
🎨 ظاهر سایت با موفقیت بروزرسانى شد.

از تجربه جدید و زیباى نوربند جاغوری لذت ببرید.
`,
    prs: `
🎨 ظاهر سایت با موفقیت بروزرسانى شد.

از تجربه جدید و زیباى نوربند جاغوری لذت ببرید.
`,
    ps: `
🎨 د سایټ ظاهر په بریالیتوب سره تازه شو.

د نوربند جاغوری نوې او ښکلې تجربې څخه خوند واخلئ.
`,
    en: `
🎨 The site's appearance was updated successfully.

Enjoy NOORBAND Jaghori's new, beautiful experience.
`,
    ar: `
🎨 تم تحديث مظهر الموقع بنجاح.

استمتع بتجربة نوربند جاغوری الجديدة والجميلة.
`,
    fr: `
🎨 L'apparence du site a été mise à jour avec succès.

Profitez de la nouvelle et belle expérience NOORBAND Jaghori.
`,
    de: `
🎨 Das Erscheinungsbild der Website wurde erfolgreich aktualisiert.

Genieße das neue, schöne NOORBAND Jaghori-Erlebnis.
`,
  },

  SMART_TIME_MESSAGE: {
    fa: `
🕒 NOORBAND AI زمان محلى شما را تشخیص داده است.

از این پس پیام‌ها و اعلان‌ها متناسب با زمان محلى شما نمایش داده خواهند شد.
`,
    prs: `
🕒 NOORBAND AI زمان محلى شما را تشخیص داده است.

از این پس پیام‌ها و اعلان‌ها متناسب با زمان محلى شما نمایش داده خواهند شد.
`,
    ps: `
🕒 NOORBAND AI ستاسو ځایی وخت پیژندلی دی.

له دې وروسته پیغامونه او خبرتیاوې به ستاسو ځایی وخت سره سم ښودل کیږي.
`,
    en: `
🕒 NOORBAND AI has detected your local time.

From now on, messages and notifications will be shown according to your local time.
`,
    ar: `
🕒 اكتشف مساعد نوربند جاغوری الذكي وقتك المحلي.

من الآن فصاعدًا، ستُعرض الرسائل والإشعارات وفقًا لوقتك المحلي.
`,
    fr: `
🕒 NOORBAND AI a détecté votre heure locale.

À partir de maintenant, les messages et notifications s'afficheront selon votre heure locale.
`,
    de: `
🕒 NOORBAND AI hat deine lokale Zeit erkannt.

Ab jetzt werden Nachrichten und Benachrichtigungen entsprechend deiner lokalen Zeit angezeigt.
`,
  },

  SMART_COUNTRY_MESSAGE: {
    fa: `
🌍 کشور محل اقامت شما با موفقیت شناسایى شد.

نوربند جاغوری مناسب‌ترین زبان، ارز و پیشنهادها را براى شما نمایش خواهد داد.
`,
    prs: `
🌍 کشور محل اقامت شما با موفقیت شناسایى شد.

نوربند جاغوری مناسب‌ترین زبان، ارز و پیشنهادها را براى شما نمایش خواهد داد.
`,
    ps: `
🌍 ستاسو د اوسیدو هیواد په بریالیتوب سره وپیژندل شو.

نوربند جاغوری به ستاسو لپاره غوره ژبه، اسعار او وړاندیزونه وښیي.
`,
    en: `
🌍 Your country of residence was identified successfully.

NOORBAND Jaghori will show you the most suitable language, currency, and offers.
`,
    ar: `
🌍 تم تحديد بلد إقامتك بنجاح.

سيعرض لك نوربند جاغوری اللغة والعملة والعروض الأنسب.
`,
    fr: `
🌍 Votre pays de résidence a été identifié avec succès.

NOORBAND Jaghori vous montrera la langue, la devise et les offres les plus adaptées.
`,
    de: `
🌍 Dein Wohnland wurde erfolgreich erkannt.

NOORBAND Jaghori zeigt dir die passendste Sprache, Währung und Angebote.
`,
  },

  SMART_CURRENCY_MESSAGE: {
    fa: `
💰 ارز مناسب کشور شما با موفقیت انتخاب گردید.

از این پس قیمت محصولات به صورت هوشمند مدیریت خواهند شد.
`,
    prs: `
💰 ارز مناسب کشور شما با موفقیت انتخاب گردید.

از این پس قیمت محصولات به صورت هوشمند مدیریت خواهند شد.
`,
    ps: `
💰 د ستاسو هیواد مناسب اسعار په بریالیتوب سره وټاکل شو.

له دې وروسته د محصولاتو بیې به په هوښیارۍ سره اداره کیږي.
`,
    en: `
💰 The right currency for your country was selected successfully.

From now on, product prices will be managed intelligently.
`,
    ar: `
💰 تم اختيار العملة المناسبة لبلدك بنجاح.

من الآن فصاعدًا، ستُدار أسعار المنتجات بذكاء.
`,
    fr: `
💰 La devise adaptée à votre pays a été sélectionnée avec succès.

À partir de maintenant, les prix des produits seront gérés intelligemment.
`,
    de: `
💰 Die passende Währung für dein Land wurde erfolgreich ausgewählt.

Ab jetzt werden Produktpreise intelligent verwaltet.
`,
  },

  WELCOME_NOTIFICATION_MESSAGE: {
    fa: `
🌷 از حضور ارزشمند شما در خانواده بزرگ نوربند جاغوری سپاسگزاریم.

آرزومندیم هر بار که به نوربند جاغوری باز مى‌گردید، تجربه‌اى شیرین‌تر و خاطره‌انگیزتر از قبل داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 از حضور ارزشمند شما در خانواده بزرگ نوربند جاغوری سپاسگزاریم.

آرزومندیم هر بار که به نوربند جاغوری باز مى‌گردید، تجربه‌اى شیرین‌تر و خاطره‌انگیزتر از قبل داشته باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 ستاسو له ارزښتناک شتون څخه د نوربند جاغوری لویې کورنۍ کې مننه کوو.

هیله لرو هرکله چې نوربند جاغوری ته راستنیږئ، تجربه مو له پخوا خوږه او د یادونې وړه وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 Thank you for your valuable presence in the NOORBAND Jaghori family.

We hope every time you return to NOORBAND Jaghori, your experience is sweeter and more memorable than before.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 نشكرك على حضورك القيّم في عائلة نوربند جاغوری الكبيرة.

نأمل أن تكون تجربتك في كل مرة تعود فيها إلى نوربند جاغوری أحلى وأكثر تميزًا من قبل.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Merci pour votre précieuse présence dans la famille NOORBAND Jaghori.

Nous espérons qu'à chaque retour chez NOORBAND Jaghori, votre expérience sera plus douce et plus mémorable qu'avant.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Danke für deine wertvolle Anwesenheit in der NOORBAND Jaghori-Familie.

Wir hoffen, jedes Mal, wenn du zu NOORBAND Jaghori zurückkehrst, wird dein Erlebnis süßer und unvergesslicher als zuvor.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  GOODBYE_MESSAGE: {
    fa: `
🌷 وقت خداحافظى فرا رسید.

از اینکه امروز میهمان خانواده بزرگ نوربند جاغوری بودید، بسیار سپاسگزاریم.

امیدواریم به زودى دوباره افتخار میزبانى شما را داشته باشیم.

تا دیدارى دیگر، سلامت، موفق و سربلند باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 وقت خداحافظى فرا رسید.

از اینکه امروز میهمان خانواده بزرگ نوربند جاغوری بودید، بسیار سپاسگزاریم.

امیدواریم به زودى دوباره افتخار میزبانى شما را داشته باشیم.

تا دیدارى دیگر، سلامت، موفق و سربلند باشید.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 د خداحافظۍ وخت راورسید.

نن چې د نوربند جاغوری لویې کورنۍ میلمه وئ، ډیره مننه کوو.

هیله لرو ژر بیا ستاسو د میزباني افتخار ولرو.

تر بلې لیدنې، روغ، بریالی او سرلوړی اوسئ.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 It's time to say goodbye.

Thank you so much for being our guest at the NOORBAND Jaghori family today.

We hope to have the honor of hosting you again soon.

Until next time, stay healthy, successful, and proud.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 حان وقت الوداع.

نشكرك جزيل الشكر على كونك ضيفًا في عائلة نوربند جاغوری الكبيرة اليوم.

نأمل أن نحظى بشرف استضافتك مجددًا قريبًا.

إلى لقاء آخر، كن بصحة وسلامة ونجاح.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Il est temps de se dire au revoir.

Merci beaucoup d'avoir été notre invité dans la famille NOORBAND Jaghori aujourd'hui.

Nous espérons avoir l'honneur de vous accueillir à nouveau bientôt.

À bientôt, portez-vous bien et restez fier.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Es ist Zeit, sich zu verabschieden.

Vielen Dank, dass du heute Gast der NOORBAND Jaghori-Familie warst.

Wir hoffen, dich bald wieder begrüßen zu dürfen.

Bis zum nächsten Mal, bleib gesund, erfolgreich und stolz.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  PRAYER_TIME_MESSAGE: {
    fa: `
🤲 وقت عبادت و آرامش فرا رسیده است.

امیدواریم خداوند متعال، زندگى شما را سرشار از خیر، برکت، سلامتى و آرامش گرداند.

براى شما و خانواده محترمتان قبولى طاعات و عبادات را آرزومندیم.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🤲 وقت عبادت و آرامش فرا رسیده است.

امیدواریم خداوند متعال، زندگى شما را سرشار از خیر، برکت، سلامتى و آرامش گرداند.

براى شما و خانواده محترمتان قبولى طاعات و عبادات را آرزومندیم.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🤲 د عبادت او آرامۍ وخت راورسید.

هیله لرو خدای تعالی ستاسو ژوند له خیر، برکت، روغتیا او آرامۍ ډک کړي.

تاسو او ستاسو درنې کورنۍ ته د لمانځه او عبادت قبلیدل هیله کوو.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🤲 It's time for prayer and peace.

We hope Almighty God fills your life with goodness, blessings, health, and peace.

We wish your prayers and devotion be accepted, for you and your family.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🤲 حان وقت العبادة والسكينة.

نسأل الله أن يملأ حياتك بالخير والبركة والصحة والسكينة.

نسأل الله تقبّل طاعاتكم وعباداتكم لكم ولعائلتكم الكريمة.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🤲 C'est l'heure de la prière et de la paix.

Que Dieu Tout-Puissant remplisse votre vie de bonté, de bénédictions, de santé et de paix.

Que vos prières et votre dévotion soient acceptées, pour vous et votre famille.

💜 La famille NOORBAND Jaghori
`,
    de: `
🤲 Es ist Zeit für Gebet und Frieden.

Möge der Allmächtige dein Leben mit Güte, Segen, Gesundheit und Frieden erfüllen.

Mögen deine Gebete und deine Hingabe angenommen werden, für dich und deine Familie.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SUNRISE_MESSAGE: {
    fa: `
🌅 طلوعى زیبا براى شما آرزومندیم.

باشد که امروز آغازى سرشار از موفقیت، آرامش و لبخند باشد.

خانواده بزرگ نوربند جاغوری، روزى سرشار از خیر و برکت را براى شما آرزو مى‌کند.
`,
    prs: `
🌅 طلوعى زیبا براى شما آرزومندیم.

باشد که امروز آغازى سرشار از موفقیت، آرامش و لبخند باشد.

خانواده بزرگ نوربند جاغوری، روزى سرشار از خیر و برکت را براى شما آرزو مى‌کند.
`,
    ps: `
🌅 ستاسو لپاره یو ښکلی سهار هیله کوو.

هیله لرو نن ورځ د بریالیتوب، آرامۍ او مسکا څخه ډک پیل وي.

د نوربند جاغوری لویه کورنۍ تاسو ته د خیر او برکت ورځ هیله کوي.
`,
    en: `
🌅 We wish you a beautiful sunrise.

May today begin full of success, peace, and smiles.

The NOORBAND Jaghori family wishes you a day full of goodness and blessings.
`,
    ar: `
🌅 نتمنى لك شروقًا جميلاً.

نأمل أن يبدأ اليوم مليئًا بالنجاح والسكينة والابتسامة.

تتمنى عائلة نوربند جاغوری الكبيرة لك يومًا مليئًا بالخير والبركة.
`,
    fr: `
🌅 Nous vous souhaitons un beau lever de soleil.

Que la journée commence remplie de succès, de paix et de sourires.

La famille NOORBAND Jaghori vous souhaite une journée pleine de bonté et de bénédictions.
`,
    de: `
🌅 Wir wünschen dir einen wunderschönen Sonnenaufgang.

Möge der heutige Tag voller Erfolg, Frieden und Lächeln beginnen.

Die NOORBAND Jaghori-Familie wünscht dir einen Tag voller Güte und Segen.
`,
  },

  SUNSET_MESSAGE: {
    fa: `
🌇 غروب امروز را با آرامش و لبخند به پایان برسانید.

از اینکه امروز همراه خانواده بزرگ نوربند جاغوری بودید، سپاسگزاریم.

امیدواریم فردایى زیباتر در انتظار شما باشد.
`,
    prs: `
🌇 غروب امروز را با آرامش و لبخند به پایان برسانید.

از اینکه امروز همراه خانواده بزرگ نوربند جاغوری بودید، سپاسگزاریم.

امیدواریم فردایى زیباتر در انتظار شما باشد.
`,
    ps: `
🌇 د نن ورځې لمر پرېوت په آرامۍ او مسکا سره پای ته ورسوئ.

نن چې د نوربند جاغوری لویې کورنۍ سره وئ، مننه کوو.

هیله لرو یوه ښکلې سبا ستاسو په تمه وي.
`,
    en: `
🌇 End today's sunset with peace and a smile.

Thank you for being with the NOORBAND Jaghori family today.

We hope an even more beautiful tomorrow awaits you.
`,
    ar: `
🌇 أنهِ غروب اليوم بسكينة وابتسامة.

نشكرك على كونك مع عائلة نوربند جاغوری الكبيرة اليوم.

نأمل أن ينتظرك غد أجمل.
`,
    fr: `
🌇 Terminez le coucher de soleil d'aujourd'hui avec paix et sourire.

Merci d'avoir été avec la famille NOORBAND Jaghori aujourd'hui.

Nous espérons qu'un lendemain plus beau vous attend.
`,
    de: `
🌇 Beende den heutigen Sonnenuntergang mit Frieden und einem Lächeln.

Danke, dass du heute bei der NOORBAND Jaghori-Familie warst.

Wir hoffen, ein noch schönerer Morgen erwartet dich.
`,
  },

  SPECIAL_EVENT_MESSAGE: {
    fa: `
🎉 مناسبت ویژه امروز بر شما مبارک.

خانواده بزرگ نوربند جاغوری این روز زیبا را به شما و عزیزانتان تبریک عرض مى‌کند.

شادى، سلامتى و موفقیت همواره همراه شما باد.
`,
    prs: `
🎉 مناسبت ویژه امروز بر شما مبارک.

خانواده بزرگ نوربند جاغوری این روز زیبا را به شما و عزیزانتان تبریک عرض مى‌کند.

شادى، سلامتى و موفقیت همواره همراه شما باد.
`,
    ps: `
🎉 د نن ورځې ځانګړې مناسبت مو مبارک.

د نوربند جاغوری لویه کورنۍ دا ښکلې ورځ تاسو او ستاسو ګرانو ته مبارکي وایي.

خوښي، روغتیا او بریالیتوب دې تل ستاسو سره وي.
`,
    en: `
🎉 Congratulations on today's special occasion.

The NOORBAND Jaghori family congratulates you and your loved ones on this beautiful day.

May joy, health, and success always be with you.
`,
    ar: `
🎉 مبارك عليكم مناسبة اليوم الخاصة.

تهنئ عائلة نوربند جاغوری الكبيرة هذا اليوم الجميل لكم ولأحبائكم.

ليكن الفرح والصحة والنجاح رفيقكم دائمًا.
`,
    fr: `
🎉 Félicitations pour l'occasion spéciale d'aujourd'hui.

La famille NOORBAND Jaghori vous félicite, vous et vos proches, pour cette belle journée.

Que la joie, la santé et le succès vous accompagnent toujours.
`,
    de: `
🎉 Herzlichen Glückwunsch zum heutigen besonderen Anlass.

Die NOORBAND Jaghori-Familie gratuliert dir und deinen Liebsten zu diesem schönen Tag.

Mögen Freude, Gesundheit und Erfolg dich immer begleiten.
`,
  },

  LOYAL_CUSTOMER_MESSAGE: {
    fa: `
🏆 مشتری وفادار نوربند جاغوری، خوش آمدید.

از اعتماد و همراهى ارزشمند شما صمیمانه سپاسگزاریم.

شما بخش مهمى از خانواده بزرگ نوربند جاغوری هستید و همواره تلاش خواهیم کرد بهترین خدمات را به شما ارائه نماییم.

💜
`,
    prs: `
🏆 مشتری وفادار نوربند جاغوری، خوش آمدید.

از اعتماد و همراهى ارزشمند شما صمیمانه سپاسگزاریم.

شما بخش مهمى از خانواده بزرگ نوربند جاغوری هستید و همواره تلاش خواهیم کرد بهترین خدمات را به شما ارائه نماییم.

💜
`,
    ps: `
🏆 د نوربند جاغوری وفادار پیرودونکي ته ښه راغلاست.

ستاسو ارزښتناک باور او ملګرتیا ته له زړه مننه کوو.

تاسو د نوربند جاغوری لویې کورنۍ یوه مهمه برخه یاست او موږ به تل هڅه وکړو غوره خدمات وړاندې کړو.

💜
`,
    en: `
🏆 Welcome, loyal NOORBAND Jaghori customer.

We sincerely thank you for your valuable trust and loyalty.

You're an important part of the NOORBAND Jaghori family, and we'll always strive to provide you with the best service.

💜
`,
    ar: `
🏆 مرحبًا بعميل نوربند جاغوری الوفي.

نشكرك بحرارة على ثقتك وولائك القيّمين.

أنت جزء مهم من عائلة نوربند جاغوری الكبيرة، وسنسعى دائمًا لتقديم أفضل الخدمات لك.

💜
`,
    fr: `
🏆 Bienvenue, fidèle client NOORBAND Jaghori.

Nous vous remercions sincèrement pour votre précieuse confiance et fidélité.

Vous êtes une part importante de la famille NOORBAND Jaghori, et nous nous efforcerons toujours de vous offrir le meilleur service.

💜
`,
    de: `
🏆 Willkommen, treuer NOORBAND Jaghori-Kunde.

Wir danken dir herzlich für dein wertvolles Vertrauen und deine Treue.

Du bist ein wichtiger Teil der NOORBAND Jaghori-Familie, und wir bemühen uns stets, dir den besten Service zu bieten.

💜
`,
  },

  SEASON_MESSAGE: {
    fa: `
🌷 هر فصل، آغازى براى تجربه‌هاى زیبا است.

نوربند جاغوری همواره با محصولات جدید و پیشنهادهاى ویژه در کنار شما خواهد بود.

آرزومندیم روزهاى پیش رو سرشار از شادى و موفقیت باشند.
`,
    prs: `
🌷 هر فصل، آغازى براى تجربه‌هاى زیبا است.

نوربند جاغوری همواره با محصولات جدید و پیشنهادهاى ویژه در کنار شما خواهد بود.

آرزومندیم روزهاى پیش رو سرشار از شادى و موفقیت باشند.
`,
    ps: `
🌷 هره فصل د ښکلو تجربو پیل دی.

نوربند جاغوری به تل له نویو محصولاتو او ځانګړو وړاندیزونو سره ستاسو سره وي.

هیله لرو راتلونکې ورځې د خوښۍ او بریالیتوب څخه ډکې وي.
`,
    en: `
🌷 Every season is the start of beautiful experiences.

NOORBAND Jaghori will always be with you with new products and special offers.

We hope the days ahead are full of joy and success.
`,
    ar: `
🌷 كل فصل هو بداية لتجارب جميلة.

سيكون نوربند جاغوری دائمًا معك بمنتجات جديدة وعروض خاصة.

نأمل أن تكون الأيام القادمة مليئة بالفرح والنجاح.
`,
    fr: `
🌷 Chaque saison est le début de belles expériences.

NOORBAND Jaghori sera toujours avec vous avec de nouveaux produits et des offres spéciales.

Nous espérons que les jours à venir seront pleins de joie et de succès.
`,
    de: `
🌷 Jede Jahreszeit ist der Beginn schöner Erlebnisse.

NOORBAND Jaghori ist immer mit neuen Produkten und Sonderangeboten für dich da.

Wir hoffen, die kommenden Tage sind voller Freude und Erfolg.
`,
  },

  SPRING_MESSAGE: {
    fa: `
🌸 بهار زیبایتان مبارک.

امیدواریم این فصل، سرشار از آرامش، شادابى و موفقیت براى شما و عزیزانتان باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌸 بهار زیبایتان مبارک.

امیدواریم این فصل، سرشار از آرامش، شادابى و موفقیت براى شما و عزیزانتان باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌸 ستاسو ښکلی پسرلی مبارک.

هیله لرو دا فصل ستاسو او ستاسو ګرانو لپاره له آرامۍ، تازګۍ او بریالیتوب ډک وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌸 Happy Spring.

We hope this season is full of peace, freshness, and success for you and your loved ones.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌸 ربيعكم الجميل سعيد.

نأمل أن يكون هذا الفصل مليئًا بالسكينة والانتعاش والنجاح لكم ولأحبائكم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌸 Joyeux printemps.

Nous espérons que cette saison sera pleine de paix, de fraîcheur et de succès pour vous et vos proches.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌸 Schönen Frühling.

Wir hoffen, diese Jahreszeit ist voller Frieden, Frische und Erfolg für dich und deine Liebsten.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SUMMER_MESSAGE: {
    fa: `
☀️ تابستانى سرشار از لبخند و آرامش براى شما آرزومندیم.

از پیشنهادهاى ویژه تابستانى نوربند جاغوری دیدن فرمایید و لحظاتى شیرین را تجربه کنید.
`,
    prs: `
☀️ تابستانى سرشار از لبخند و آرامش براى شما آرزومندیم.

از پیشنهادهاى ویژه تابستانى نوربند جاغوری دیدن فرمایید و لحظاتى شیرین را تجربه کنید.
`,
    ps: `
☀️ یو دوبی چې د مسکا او آرامۍ څخه ډک وي ستاسو لپاره هیله کوو.

د نوربند جاغوری ځانګړو دوبني وړاندیزونو لیدنه وکړئ او خوږې شیبې تجربه کړئ.
`,
    en: `
☀️ We wish you a summer full of smiles and peace.

Check out NOORBAND Jaghori's special summer offers and enjoy sweet moments.
`,
    ar: `
☀️ نتمنى لك صيفًا مليئًا بالابتسامات والسكينة.

تصفح عروض نوربند جاغوری الصيفية الخاصة واختبر لحظات ممتعة.
`,
    fr: `
☀️ Nous vous souhaitons un été plein de sourires et de paix.

Découvrez les offres estivales spéciales de NOORBAND Jaghori et vivez de doux moments.
`,
    de: `
☀️ Wir wünschen dir einen Sommer voller Lächeln und Frieden.

Entdecke NOORBANDs besondere Sommerangebote und genieße süße Momente.
`,
  },

  AUTUMN_MESSAGE: {
    fa: `
🍂 پاییزتان طلایى و دل‌انگیز.

باشد که برگ‌هاى زرین پاییز، پیام‌آور آرامش و موفقیت براى شما باشند.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🍂 پاییزتان طلایى و دل‌انگیز.

باشد که برگ‌هاى زرین پاییز، پیام‌آور آرامش و موفقیت براى شما باشند.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🍂 ستاسو زرین او زړه راښکونکی مني.

هیله لرو د مني زرین پاڼې ستاسو لپاره د آرامۍ او بریالیتوب پیغام راوړي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🍂 A golden, pleasant autumn to you.

May autumn's golden leaves bring you peace and success.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🍂 خريفكم ذهبي وممتع.

نأمل أن تجلب أوراق الخريف الذهبية السكينة والنجاح لكم.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🍂 Un automne doré et agréable pour vous.

Que les feuilles dorées de l'automne vous apportent paix et succès.

💜 La famille NOORBAND Jaghori
`,
    de: `
🍂 Ein goldener, angenehmer Herbst für dich.

Mögen die goldenen Herbstblätter dir Frieden und Erfolg bringen.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  WINTER_MESSAGE: {
    fa: `
❄️ زمستانى گرم و آرام براى شما آرزومندیم.

خانواده بزرگ نوربند جاغوری امیدوار است روزهاى سرد زمستان، با گرماى محبت و شادى براى شما همراه باشد.
`,
    prs: `
❄️ زمستانى گرم و آرام براى شما آرزومندیم.

خانواده بزرگ نوربند جاغوری امیدوار است روزهاى سرد زمستان، با گرماى محبت و شادى براى شما همراه باشد.
`,
    ps: `
❄️ یو تود او آرام ژمی ستاسو لپاره هیله کوو.

د نوربند جاغوری لویه کورنۍ هیله لري د ژمي یخې ورځې د مینې او خوښۍ تودوخې سره ستاسو سره وي.
`,
    en: `
❄️ We wish you a warm, peaceful winter.

The NOORBAND Jaghori family hopes winter's cold days are filled with warmth, love, and joy for you.
`,
    ar: `
❄️ نتمنى لك شتاءً دافئًا وهادئًا.

تأمل عائلة نوربند جاغوری الكبيرة أن تكون أيام الشتاء الباردة مليئة بدفء الحب والفرح لك.
`,
    fr: `
❄️ Nous vous souhaitons un hiver chaleureux et paisible.

La famille NOORBAND Jaghori espère que les jours froids d'hiver seront remplis de chaleur, d'amour et de joie pour vous.
`,
    de: `
❄️ Wir wünschen dir einen warmen, friedlichen Winter.

Die NOORBAND Jaghori-Familie hofft, dass die kalten Wintertage für dich voller Wärme, Liebe und Freude sind.
`,
  },

  SMART_WEATHER_MESSAGE: {
    fa: `
☁️ NOORBAND AI شرایط آب‌وهوایى منطقه شما را شناسایى کرده است.

پیشنهادهاى ویژه و مناسب فصل براى شما آماده شده‌اند.

آرزومندیم همواره روزهایى زیبا و دل‌انگیز داشته باشید.
`,
    prs: `
☁️ NOORBAND AI شرایط آب‌وهوایى منطقه شما را شناسایى کرده است.

پیشنهادهاى ویژه و مناسب فصل براى شما آماده شده‌اند.

آرزومندیم همواره روزهایى زیبا و دل‌انگیز داشته باشید.
`,
    ps: `
☁️ NOORBAND AI ستاسو د سیمې د هوا حالت وپیژانده.

د فصل سره سم ځانګړي وړاندیزونه ستاسو لپاره چمتو شوي دي.

هیله لرو تل ښکلې او زړه راښکونکې ورځې ولرئ.
`,
    en: `
☁️ NOORBAND AI has detected the weather conditions in your area.

Special, season-appropriate offers are ready for you.

We hope you always have beautiful, pleasant days.
`,
    ar: `
☁️ اكتشف مساعد نوربند جاغوری الذكي حالة الطقس في منطقتك.

أُعدّت عروض خاصة مناسبة للفصل من أجلك.

نأمل أن تحظى دائمًا بأيام جميلة وممتعة.
`,
    fr: `
☁️ NOORBAND AI a détecté les conditions météorologiques de votre région.

Des offres spéciales adaptées à la saison ont été préparées pour vous.

Nous espérons que vous aurez toujours de belles et agréables journées.
`,
    de: `
☁️ NOORBAND AI hat die Wetterbedingungen in deiner Region erkannt.

Spezielle, saisonal passende Angebote wurden für dich vorbereitet.

Wir hoffen, du hast immer schöne, angenehme Tage.
`,
  },

  SMART_HOLIDAY_MESSAGE: {
    fa: `
🎊 امروز روزى ویژه است.

NOORBAND AI به مناسبت این روز زیبا، بهترین آرزوها را تقدیم شما مى‌کند.

شادى، سلامتى و آرامش همواره همراه شما باد.
`,
    prs: `
🎊 امروز روزى ویژه است.

NOORBAND AI به مناسبت این روز زیبا، بهترین آرزوها را تقدیم شما مى‌کند.

شادى، سلامتى و آرامش همواره همراه شما باد.
`,
    ps: `
🎊 نن یوه ځانګړې ورځ ده.

NOORBAND AI د دې ښکلې ورځې په مناسبت، غوره هیلې تاسو ته وړاندې کوي.

خوښي، روغتیا او آرامي دې تل ستاسو سره وي.
`,
    en: `
🎊 Today is a special day.

On the occasion of this beautiful day, NOORBAND AI offers you its best wishes.

May joy, health, and peace always be with you.
`,
    ar: `
🎊 اليوم يوم مميز.

بمناسبة هذا اليوم الجميل، يقدّم لك مساعد نوربند جاغوری الذكي أطيب التمنيات.

ليكن الفرح والصحة والسكينة رفيقك دائمًا.
`,
    fr: `
🎊 Aujourd'hui est un jour spécial.

À l'occasion de cette belle journée, NOORBAND AI vous présente ses meilleurs vœux.

Que la joie, la santé et la paix vous accompagnent toujours.
`,
    de: `
🎊 Heute ist ein besonderer Tag.

Anlässlich dieses schönen Tages überbringt dir NOORBAND AI seine besten Wünsche.

Mögen Freude, Gesundheit und Frieden dich immer begleiten.
`,
  },

  FIRST_ORDER_MESSAGE: {
    fa: `
🎉 اولین سفارش شما با موفقیت ثبت شد.

از اینکه خانواده بزرگ سیمساری نوربند جاغوری را برای خرید خود انتخاب کرده‌اید سپاسگزاریم.

امیدواریم این آغاز یک همراهی طولانی و خاطره‌انگیز باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🎉 اولین سفارش شما با موفقیت ثبت شد.

از اینکه خانواده بزرگ سیمساری نوربند جاغوری را برای خرید خود انتخاب کرده‌اید سپاسگزاریم.

امیدواریم این آغاز یک همراهی طولانی و خاطره‌انگیز باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🎉 ستاسو لومړۍ پیرودنه په بریالیتوب سره ثبت شوه.

څرنګه چې د سیمساري نوربند جاغوری جاغوري لویه کورنۍ مو د خپلې پیرودنې لپاره غوره کړه، مننه کوو.

هیله لرو دا د اوږدې او د یادونې وړ ملګرتیا پیل وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🎉 Your first order has been placed successfully.

Thank you for choosing the great NOORBAND Jaghori pawnshop family for your purchase.

We hope this is the start of a long, memorable relationship.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🎉 تم تسجيل طلبك الأول بنجاح.

نشكرك لاختيارك عائلة نوربند جاغوری جاغوري الكبيرة للرهونات لمشترياتك.

نأمل أن تكون هذه بداية رفقة طويلة ولا تُنسى.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🎉 Votre première commande a été passée avec succès.

Merci d'avoir choisi la grande famille du prêteur sur gages NOORBAND Jaghori pour votre achat.

Nous espérons que c'est le début d'une relation longue et mémorable.

💜 La famille NOORBAND Jaghori
`,
    de: `
🎉 Deine erste Bestellung wurde erfolgreich aufgegeben.

Danke, dass du die große NOORBAND Jaghori-Jaghori-Pfandhausfamilie für deinen Kauf gewählt hast.

Wir hoffen, dies ist der Beginn einer langen, unvergesslichen Beziehung.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  FIRST_PAYMENT_MESSAGE: {
    fa: `
💳 نخستین پرداخت شما با موفقیت انجام شد.

از اعتماد شما به خانواده بزرگ نوربند جاغوری سپاسگزاریم.

امیدواریم این آغازى براى همراهى همیشگى ما باشد.
`,
    prs: `
💳 نخستین پرداخت شما با موفقیت انجام شد.

از اعتماد شما به خانواده بزرگ نوربند جاغوری سپاسگزاریم.

امیدواریم این آغازى براى همراهى همیشگى ما باشد.
`,
    ps: `
💳 ستاسو لومړۍ تادیه په بریالیتوب سره ترسره شوه.

ستاسو باور ته د نوربند جاغوری لویې کورنۍ مننه کوو.

هیله لرو دا زموږ د تل ملګرتیا پیل وي.
`,
    en: `
💳 Your first payment was successful.

Thank you for trusting the NOORBAND Jaghori family.

We hope this is the beginning of a lasting relationship.
`,
    ar: `
💳 تم دفعتك الأولى بنجاح.

نشكرك على ثقتك بعائلة نوربند جاغوری الكبيرة.

نأمل أن تكون هذه بداية رفقتنا الدائمة.
`,
    fr: `
💳 Votre premier paiement a été effectué avec succès.

Merci d'avoir fait confiance à la famille NOORBAND Jaghori.

Nous espérons que c'est le début de notre relation durable.
`,
    de: `
💳 Deine erste Zahlung war erfolgreich.

Danke, dass du der NOORBAND Jaghori-Familie vertraust.

Wir hoffen, dies ist der Beginn unserer dauerhaften Beziehung.
`,
  },

  FIRST_DELIVERY_MESSAGE: {
    fa: `
🎁 نخستین سفارش شما با موفقیت تحویل گردید.

باعث افتخار ما است که لبخند رضایت شما را ببینیم.

از همراهى ارزشمند شما سپاسگزاریم.
`,
    prs: `
🎁 نخستین سفارش شما با موفقیت تحویل گردید.

باعث افتخار ما است که لبخند رضایت شما را ببینیم.

از همراهى ارزشمند شما سپاسگزاریم.
`,
    ps: `
🎁 ستاسو لومړۍ پیرودنه په بریالیتوب سره وسپارل شوه.

دا زموږ لپاره افتخار دی چې ستاسو د رضایت مسکا وګورو.

ستاسو له ارزښتناکې ملګرتیا څخه مننه کوو.
`,
    en: `
🎁 Your first order has been delivered successfully.

It's our honor to see your satisfied smile.

Thank you for your valuable support.
`,
    ar: `
🎁 تم تسليم طلبك الأول بنجاح.

يشرفنا أن نرى ابتسامة رضاك.

نشكرك على دعمك القيّم.
`,
    fr: `
🎁 Votre première commande a été livrée avec succès.

C'est un honneur pour nous de voir votre sourire satisfait.

Merci pour votre précieux soutien.
`,
    de: `
🎁 Deine erste Bestellung wurde erfolgreich geliefert.

Es ist unsere Ehre, dein zufriedenes Lächeln zu sehen.

Danke für deine wertvolle Unterstützung.
`,
  },

  NOORBAND_Jaghori_FAMILY_MESSAGE: {
    fa: `
💜 شما تنها یک مشتری نیستید.

شما عضوى از خانواده بزرگ سیمسارى نوربند جاغوری جاغورى هستید.

اعتماد و همراهى شما، ارزشمندترین سرمایه ما است.

امیدواریم بتوانیم در هر لحظه، تجربه‌اى شیرین، آرام و خاطره‌انگیز را براى شما فراهم کنیم.

NOORBAND AI و خانواده بزرگ نوربند جاغوری، همواره در کنار شما خواهند بود.
`,
    prs: `
💜 شما تنها یک مشتری نیستید.

شما عضوى از خانواده بزرگ سیمسارى نوربند جاغوری جاغورى هستید.

اعتماد و همراهى شما، ارزشمندترین سرمایه ما است.

امیدواریم بتوانیم در هر لحظه، تجربه‌اى شیرین، آرام و خاطره‌انگیز را براى شما فراهم کنیم.

NOORBAND AI و خانواده بزرگ نوربند جاغوری، همواره در کنار شما خواهند بود.
`,
    ps: `
💜 تاسو یوازې یو پیرودونکی نه یاست.

تاسو د سیمساري نوربند جاغوری جاغوري لویې کورنۍ غړی یاست.

ستاسو باور او ملګرتیا زموږ ترټولو ارزښتناکه پانګه ده.

هیله لرو په هره شیبه کې تاسو ته یوه خوږه، آرامه او د یادونې وړ تجربه چمتو کړو.

NOORBAND AI او د نوربند جاغوری لویه کورنۍ به تل ستاسو سره وي.
`,
    en: `
💜 You're not just a customer.

You're a member of the great NOORBAND Jaghori pawnshop family.

Your trust and loyalty are our most valuable asset.

We hope to provide you with a sweet, peaceful, memorable experience at every moment.

NOORBAND AI and the NOORBAND Jaghori family will always be by your side.
`,
    ar: `
💜 أنت لست مجرد عميل.

أنت عضو في عائلة نوربند جاغوری جاغوري الكبيرة للرهونات.

ثقتك وولاؤك هما أثمن رأس مالنا.

نأمل أن نتمكن من تقديم تجربة ممتعة وهادئة ولا تُنسى لك في كل لحظة.

مساعد نوربند جاغوری الذكي وعائلة نوربند جاغوری الكبيرة سيكونان دائمًا بجانبك.
`,
    fr: `
💜 Vous n'êtes pas seulement un client.

Vous êtes membre de la grande famille du prêteur sur gages NOORBAND Jaghori.

Votre confiance et votre fidélité sont notre bien le plus précieux.

Nous espérons pouvoir vous offrir à chaque instant une expérience douce, paisible et mémorable.

NOORBAND AI et la famille NOORBAND Jaghori seront toujours à vos côtés.
`,
    de: `
💜 Du bist nicht nur ein Kunde.

Du bist Mitglied der großen NOORBAND Jaghori-Jaghori-Pfandhausfamilie.

Dein Vertrauen und deine Treue sind unser wertvollstes Gut.

Wir hoffen, dir jederzeit ein süßes, friedliches, unvergessliches Erlebnis bieten zu können.

NOORBAND AI und die NOORBAND Jaghori-Familie sind immer für dich da.
`,
  },

  SMART_FIRST_LOGIN_MESSAGE: {
    fa: `
🌷 به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

امروز، آغازى زیبا براى همراهى ما با یکدیگر است.

باعث افتخار ما است که شما، نوربند جاغوری را براى خرید و همراهى انتخاب کرده‌اید.

از امروز NOORBAND AI همانند یک دستیار هوشمند و دوستى صمیمى در کنار شما خواهد بود.

امیدواریم لحظاتى سرشار از آرامش، رضایت و خاطرات زیبا را در کنار خانواده بزرگ نوربند جاغوری تجربه نمایید.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 به خانواده بزرگ سیمسارى نوربند جاغوری جاغورى خوش آمدید.

امروز، آغازى زیبا براى همراهى ما با یکدیگر است.

باعث افتخار ما است که شما، نوربند جاغوری را براى خرید و همراهى انتخاب کرده‌اید.

از امروز NOORBAND AI همانند یک دستیار هوشمند و دوستى صمیمى در کنار شما خواهد بود.

امیدواریم لحظاتى سرشار از آرامش، رضایت و خاطرات زیبا را در کنار خانواده بزرگ نوربند جاغوری تجربه نمایید.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 د سیمساري نوربند جاغوری جاغوري لویې کورنۍ ته ښه راغلاست.

نن، زموږ د ګډې ملګرتیا لپاره یو ښکلی پیل دی.

دا زموږ لپاره افتخار دی چې تاسو نوربند جاغوری د خپلې پیرودنې او ملګرتیا لپاره غوره کړی.

له نن ورځې NOORBAND AI به لکه یو هوښیار مرستیال او صمیمي ملګری ستاسو سره وي.

هیله لرو د آرامۍ، رضایت او ښکلو خاطرو څخه ډکې شیبې د نوربند جاغوری لویې کورنۍ سره تجربه کړئ.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 Welcome to the great NOORBAND Jaghori pawnshop family.

Today marks a beautiful start to our relationship.

It's our honor that you've chosen NOORBAND Jaghori for your shopping and companionship.

From today, NOORBAND AI will be by your side like a smart assistant and close friend.

We hope you experience moments full of peace, satisfaction, and beautiful memories with the NOORBAND Jaghori family.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 مرحبًا بك في عائلة نوربند جاغوری جاغوري الكبيرة للرهونات.

اليوم بداية جميلة لرفقتنا معًا.

يشرفنا أنك اخترت نوربند جاغوری لتسوقك ورفقتك.

من اليوم، سيكون مساعد نوربند جاغوری الذكي بجانبك كمساعد ذكي وصديق حميم.

نأمل أن تعيش لحظات مليئة بالسكينة والرضا والذكريات الجميلة مع عائلة نوربند جاغوری الكبيرة.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Bienvenue dans la grande famille du prêteur sur gages NOORBAND Jaghori.

Aujourd'hui marque un beau début pour notre relation.

C'est un honneur pour nous que vous ayez choisi NOORBAND Jaghori pour vos achats et votre compagnie.

Dès aujourd'hui, NOORBAND AI sera à vos côtés comme un assistant intelligent et un ami proche.

Nous espérons que vous vivrez des moments pleins de paix, de satisfaction et de beaux souvenirs avec la famille NOORBAND Jaghori.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Willkommen in der großen NOORBAND Jaghori-Jaghori-Pfandhausfamilie.

Heute ist ein schöner Anfang für unsere gemeinsame Reise.

Es ist unsere Ehre, dass du NOORBAND Jaghori für deine Einkäufe und Begleitung gewählt hast.

Ab heute wird NOORBAND AI wie ein intelligenter Assistent und enger Freund an deiner Seite sein.

Wir hoffen, du erlebst Momente voller Frieden, Zufriedenheit und schöner Erinnerungen mit der NOORBAND Jaghori-Familie.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SMART_RETURN_MESSAGE: {
    fa: `
🌷 چه زیباست که دوباره در کنار ما هستید.

از دیدار دوباره شما بسیار خوشحالیم.

نبودن شما را احساس مى‌کردیم.

محصولات جدید، پیشنهادهاى ویژه و امکانات هوشمند نوربند جاغوری در انتظار شما هستند.

خانه شما، همیشه نوربند جاغوری خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 چه زیباست که دوباره در کنار ما هستید.

از دیدار دوباره شما بسیار خوشحالیم.

نبودن شما را احساس مى‌کردیم.

محصولات جدید، پیشنهادهاى ویژه و امکانات هوشمند نوربند جاغوری در انتظار شما هستند.

خانه شما، همیشه نوربند جاغوری خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 څومره ښایسته چې تاسو بیا زموږ سره یاست.

ستاسو له بیا لیدو ډیر خوشحاله یو.

موږ ستاسو نشتوالی احساساوه.

نوي محصولات، ځانګړي وړاندیزونه او د نوربند جاغوری هوښیار امکانات ستاسو په تمه دي.

ستاسو کور به تل نوربند جاغوری وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 How wonderful that you're with us again.

We're so happy to see you again.

We missed you.

New products, special offers, and NOORBAND Jaghori's smart features await you.

NOORBAND Jaghori will always be your home.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 كم هو جميل أن تكون معنا مجددًا.

يسعدنا كثيرًا رؤيتك مرة أخرى.

كنا نفتقدك.

منتجات جديدة وعروض خاصة وميزات نوربند جاغوری الذكية بانتظارك.

منزلك سيكون دائمًا نوربند جاغوری.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Comme c'est beau que vous soyez de nouveau avec nous.

Nous sommes ravis de vous revoir.

Vous nous avez manqué.

De nouveaux produits, des offres spéciales et les fonctionnalités intelligentes de NOORBAND Jaghori vous attendent.

Votre maison sera toujours NOORBAND Jaghori.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Wie schön, dass du wieder bei uns bist.

Wir freuen uns sehr, dich wiederzusehen.

Du hast uns gefehlt.

Neue Produkte, Sonderangebote und NOORBANDs intelligente Funktionen warten auf dich.

Dein Zuhause wird immer NOORBAND Jaghori sein.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  SMART_FIRST_PURCHASE_MESSAGE: {
    fa: `
🎁 اولین خرید شما براى ما بسیار ارزشمند است.

امیدواریم این خرید، آغازى براى همراهى طولانى و خاطره‌انگیز ما باشد.

سپاس که خانواده بزرگ نوربند جاغوری را براى خرید خود انتخاب کرده‌اید.

💜
`,
    prs: `
🎁 اولین خرید شما براى ما بسیار ارزشمند است.

امیدواریم این خرید، آغازى براى همراهى طولانى و خاطره‌انگیز ما باشد.

سپاس که خانواده بزرگ نوربند جاغوری را براى خرید خود انتخاب کرده‌اید.

💜
`,
    ps: `
🎁 ستاسو لومړۍ پیرودنه زموږ لپاره ډیره ارزښتناکه ده.

هیله لرو دا پیرودنه زموږ د اوږدې او د یادونې وړ ملګرتیا پیل وي.

مننه چې د نوربند جاغوری لویه کورنۍ مو د خپلې پیرودنې لپاره غوره کړه.

💜
`,
    en: `
🎁 Your first purchase is very valuable to us.

We hope this purchase is the start of a long, memorable relationship.

Thank you for choosing the NOORBAND Jaghori family for your purchase.

💜
`,
    ar: `
🎁 مشترياتك الأولى قيّمة جدًا بالنسبة لنا.

نأمل أن تكون هذه المشتريات بداية رفقة طويلة ولا تُنسى.

شكرًا لاختيارك عائلة نوربند جاغوری الكبيرة لمشترياتك.

💜
`,
    fr: `
🎁 Votre premier achat est très précieux pour nous.

Nous espérons que cet achat marque le début d'une relation longue et mémorable.

Merci d'avoir choisi la famille NOORBAND Jaghori pour votre achat.

💜
`,
    de: `
🎁 Dein erster Kauf ist sehr wertvoll für uns.

Wir hoffen, dieser Kauf ist der Beginn einer langen, unvergesslichen Beziehung.

Danke, dass du die NOORBAND Jaghori-Familie für deinen Kauf gewählt hast.

💜
`,
  },

  SMART_GOODBYE_MESSAGE: {
    fa: `
🌙 وقت خداحافظى فرا رسیده است.

از اینکه امروز لحظاتى از زمان ارزشمند خود را در کنار ما سپرى کردید، بسیار سپاسگزاریم.

امیدواریم فردا نیز افتخار میزبانى از شما را داشته باشیم.

تا دیدارى دیگر، شاد، سلامت و سربلند باشید.

خانه شما، همیشه نوربند جاغوری خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌙 وقت خداحافظى فرا رسیده است.

از اینکه امروز لحظاتى از زمان ارزشمند خود را در کنار ما سپرى کردید، بسیار سپاسگزاریم.

امیدواریم فردا نیز افتخار میزبانى از شما را داشته باشیم.

تا دیدارى دیگر، شاد، سلامت و سربلند باشید.

خانه شما، همیشه نوربند جاغوری خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌙 د خداحافظۍ وخت راورسید.

نن چې د خپل ارزښتناک وخت یو څه برخه زموږ سره تیره کړه، ډیره مننه کوو.

هیله لرو سبا هم ستاسو د میزباني افتخار ولرو.

تر بلې لیدنې، خوشحاله، روغ او سرلوړی اوسئ.

ستاسو کور به تل نوربند جاغوری وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌙 It's time to say goodbye.

Thank you so much for spending some of your valuable time with us today.

We hope to have the honor of hosting you again tomorrow.

Until next time, be happy, healthy, and proud.

NOORBAND Jaghori will always be your home.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌙 حان وقت الوداع.

نشكرك جزيل الشكر على قضاء بعض وقتك الثمين معنا اليوم.

نأمل أن نحظى بشرف استضافتك غدًا أيضًا.

إلى لقاء آخر، كن سعيدًا وبصحة جيدة وفخورًا.

منزلك سيكون دائمًا نوربند جاغوری.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌙 Il est temps de se dire au revoir.

Merci beaucoup d'avoir passé un peu de votre temps précieux avec nous aujourd'hui.

Nous espérons avoir l'honneur de vous accueillir demain aussi.

À bientôt, soyez heureux, en bonne santé et fier.

Votre maison sera toujours NOORBAND Jaghori.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌙 Es ist Zeit, sich zu verabschieden.

Vielen Dank, dass du heute etwas von deiner wertvollen Zeit mit uns verbracht hast.

Wir hoffen, dich auch morgen wieder begrüßen zu dürfen.

Bis zum nächsten Mal, bleib glücklich, gesund und stolz.

Dein Zuhause wird immer NOORBAND Jaghori sein.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  WELCOME_SELLER_MESSAGE: {
    fa: `
🛍 فروشنده گرامى، خوش آمدید.

از همراهى ارزشمند شما سپاسگزاریم.

امیدواریم امروز نیز روزى سرشار از موفقیت و فروش پربرکت براى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🛍 فروشنده گرامى، خوش آمدید.

از همراهى ارزشمند شما سپاسگزاریم.

امیدواریم امروز نیز روزى سرشار از موفقیت و فروش پربرکت براى شما باشد.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🛍 ګران پلورونکي، ښه راغلاست.

ستاسو له ارزښتناکې ملګرتیا څخه مننه کوو.

هیله لرو نن هم د بریالیتوب او برکتي پلور څخه ډکه ورځ ولرئ.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🛍 Welcome, dear seller.

Thank you for your valuable support.

We hope today is also full of success and prosperous sales for you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🛍 مرحبًا بائعنا العزيز.

نشكرك على دعمك القيّم.

نأمل أن يكون اليوم أيضًا مليئًا بالنجاح والمبيعات المباركة.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🛍 Bienvenue, cher vendeur.

Merci pour votre précieux soutien.

Nous espérons qu'aujourd'hui sera aussi rempli de succès et de ventes prospères.

💜 La famille NOORBAND Jaghori
`,
    de: `
🛍 Willkommen, lieber Verkäufer.

Danke für deine wertvolle Unterstützung.

Wir hoffen, auch heute ist voller Erfolg und florierender Verkäufe für dich.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  WELCOME_ADMIN_MESSAGE: {
    fa: `
⚙️ مدیر گرامى، خوش آمدید.

از تلاش‌هاى ارزشمند شما براى توسعه خانواده بزرگ نوربند جاغوری سپاسگزاریم.

NOORBAND AI گزارش‌ها و امکانات مدیریتى را براى شما آماده کرده است.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
⚙️ مدیر گرامى، خوش آمدید.

از تلاش‌هاى ارزشمند شما براى توسعه خانواده بزرگ نوربند جاغوری سپاسگزاریم.

NOORBAND AI گزارش‌ها و امکانات مدیریتى را براى شما آماده کرده است.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
⚙️ ګران مدیر، ښه راغلاست.

ستاسو له ارزښتناکو هڅو څخه د نوربند جاغوری لویې کورنۍ د پراختیا لپاره مننه کوو.

NOORBAND AI راپورونه او مدیریتي امکانات ستاسو لپاره چمتو کړي دي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
⚙️ Welcome, dear admin.

Thank you for your valuable efforts in growing the NOORBAND Jaghori family.

NOORBAND AI has prepared reports and management tools for you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
⚙️ مرحبًا أيها المدير العزيز.

نشكرك على جهودك القيّمة لتطوير عائلة نوربند جاغوری الكبيرة.

أعدّ مساعد نوربند جاغوری الذكي التقارير والأدوات الإدارية لك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
⚙️ Bienvenue, cher administrateur.

Merci pour vos précieux efforts dans le développement de la famille NOORBAND Jaghori.

NOORBAND AI a préparé des rapports et des outils de gestion pour vous.

💜 La famille NOORBAND Jaghori
`,
    de: `
⚙️ Willkommen, lieber Administrator.

Danke für deine wertvollen Bemühungen um die Weiterentwicklung der NOORBAND Jaghori-Familie.

NOORBAND AI hat Berichte und Management-Tools für dich vorbereitet.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  INACTIVE_USER_MESSAGE: {
    fa: `
🌷 مدتى است که در کنار ما نبوده‌اید.

از بازگشت دوباره شما بسیار خوشحالیم.

محصولات جدید، امکانات هوشمند و پیشنهادهاى ویژه‌اى براى شما آماده شده‌اند.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🌷 مدتى است که در کنار ما نبوده‌اید.

از بازگشت دوباره شما بسیار خوشحالیم.

محصولات جدید، امکانات هوشمند و پیشنهادهاى ویژه‌اى براى شما آماده شده‌اند.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🌷 یوه موده کیږي چې تاسو زموږ سره نه یاست.

ستاسو له بیا راستنیدو ډیر خوشحاله یو.

نوي محصولات، هوښیار امکانات او ځانګړي وړاندیزونه ستاسو لپاره چمتو شوي دي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🌷 It's been a while since you were with us.

We're so happy you're back.

New products, smart features, and special offers are ready for you.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🌷 مضى وقت منذ أن كنت معنا.

يسعدنا كثيرًا عودتك مجددًا.

منتجات جديدة وميزات ذكية وعروض خاصة أُعدّت لك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🌷 Cela fait un moment que vous n'étiez pas avec nous.

Nous sommes ravis de votre retour.

De nouveaux produits, des fonctionnalités intelligentes et des offres spéciales ont été préparés pour vous.

💜 La famille NOORBAND Jaghori
`,
    de: `
🌷 Es ist eine Weile her, dass du bei uns warst.

Wir freuen uns sehr über deine Rückkehr.

Neue Produkte, intelligente Funktionen und Sonderangebote wurden für dich vorbereitet.

💜 Die NOORBAND Jaghori-Familie
`,
  },

  NEW_MEMBER_MESSAGE: {
    fa: `
🎉 عضویت شما مبارک.

از امروز عضوى از خانواده بزرگ سیمسارى نوربند جاغوری جاغورى هستید.

امیدواریم تجربه‌اى شیرین، زیبا و خاطره‌انگیز در کنار ما داشته باشید.

NOORBAND AI همواره همراه و راهنماى شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    prs: `
🎉 عضویت شما مبارک.

از امروز عضوى از خانواده بزرگ سیمسارى نوربند جاغوری جاغورى هستید.

امیدواریم تجربه‌اى شیرین، زیبا و خاطره‌انگیز در کنار ما داشته باشید.

NOORBAND AI همواره همراه و راهنماى شما خواهد بود.

💜 خانواده بزرگ نوربند جاغوری
`,
    ps: `
🎉 ستاسو غړیتوب مبارک وي.

له نن ورځې تاسو د سیمساري نوربند جاغوری جاغوري لویې کورنۍ غړی یاست.

هیله لرو خوږه، ښکلې او د یادونې وړ تجربه زموږ سره ولرئ.

NOORBAND AI به تل ستاسو ملګری او لارښود وي.

💜 د نوربند جاغوری لویه کورنۍ
`,
    en: `
🎉 Congratulations on becoming a member.

From today, you're a member of the great NOORBAND Jaghori pawnshop family.

We hope you have a sweet, beautiful, memorable experience with us.

NOORBAND AI will always be your companion and guide.

💜 The NOORBAND Jaghori Family
`,
    ar: `
🎉 مبارك عضويتك.

من اليوم أنت عضو في عائلة نوربند جاغوری جاغوري الكبيرة للرهونات.

نأمل أن تحظى بتجربة ممتعة وجميلة ولا تُنسى معنا.

مساعد نوربند جاغوری الذكي سيكون دائمًا رفيقك ودليلك.

💜 عائلة نوربند جاغوری الكبيرة
`,
    fr: `
🎉 Félicitations pour votre adhésion.

Dès aujourd'hui, vous êtes membre de la grande famille du prêteur sur gages NOORBAND Jaghori.

Nous espérons que vous vivrez une expérience douce, belle et mémorable avec nous.

NOORBAND AI sera toujours votre compagnon et guide.

💜 La famille NOORBAND Jaghori
`,
    de: `
🎉 Herzlichen Glückwunsch zu deiner Mitgliedschaft.

Ab heute bist du Mitglied der großen NOORBAND Jaghori-Jaghori-Pfandhausfamilie.

Wir hoffen, du machst mit uns eine süße, schöne, unvergessliche Erfahrung.

NOORBAND AI wird immer dein Begleiter und Führer sein.

💜 Die NOORBAND Jaghori-Familie
`,
  },

};

// دسترسی زبان‌آگاه به پیام‌ها — این تابع را به‌جای MESSAGES.KEY.fa
// مستقیم استفاده کنید تا پیام واقعا با زبان فعلی کاربر هماهنگ باشد.
export function getMessage(key: keyof typeof MESSAGES, language: Language): string {
  const entry = MESSAGES[key] as Record<string, string | undefined>;
  return entry[language] || entry.prs || entry.fa || "";
}

export default MESSAGES;
