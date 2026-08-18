const CACHE_NAME = "NOORBAND-V1";

const urls = ["/", "/offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urls)));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        return response || caches.match("/offline.html");
      });
    })
  );
});

// ------------------------------------------------------------------
// PUSH NOTIFICATIONS — قبلا این service worker اصلا رویداد push را
// مدیریت نمی‌کرد، یعنی حتی اگر یک پیام Push از سرور می‌رسید، هیچ
// اعلانی به کاربر نشان داده نمی‌شد.
// ------------------------------------------------------------------

self.addEventListener("push", (event) => {
  let data = { title: "سیمساری نوربند جاغوری", body: "اعلان جدید دارید." };

  try {
    if (event.data) data = event.data.json();
  } catch {
    // اگر داده متنی ساده بود
    data.body = event.data?.text() || data.body;
  }

  // نکته: آیکون‌های واقعی PWA در ریشه public/ هستند (/icon-192.png)،
  // نه زیرپوشه‌ی /icons/ که اینجا قبلا نوشته شده بود — یعنی این آدرس
  // همیشه 404 می‌داد و اعلان Push بدون آیکون (یا اصلا بدون نمایش، در
  // برخی مرورگرها) نشان داده می‌شد.
  event.waitUntil(
    self.registration.showNotification(data.title || "سیمساری نوربند جاغوری", {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
