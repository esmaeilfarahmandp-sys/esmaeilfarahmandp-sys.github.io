/* ارسانه: راه‌انداز آمار بازدید بدون کوکی.
 * ابتدا در https://counter.dev/ حساب بسازید؛ سپس شناسهٔ data-id اختصاصی
 * را در مقدار COUNTER_SITE_ID وارد کنید. تا پیش از آن، هیچ داده‌ای ارسال نمی‌شود.
 * رمز عبور و اطلاعات شخصی را در این فایل قرار ندهید.
 */
(() => {
  "use strict";
  const COUNTER_SITE_ID = ""; // شناسهٔ عمومی UUID از داشبورد Counter.dev
  const SITE_HOST = "esmaeilfarahmandp-sys.github.io";
  const validID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!validID.test(COUNTER_SITE_ID)) return; // پیش‌فرض: بدون ردیابی
  if (location.hostname !== SITE_HOST || location.protocol !== "https:") return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
  const script = document.createElement("script");
  script.src = "https://cdn.counter.dev/script.js";
  script.async = true;
  script.dataset.id = COUNTER_SITE_ID;
  script.referrerPolicy = "strict-origin-when-cross-origin";
  document.head.appendChild(script);
})();
