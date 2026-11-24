// === عدل بيانات الدعوة هنا فقط ===
const birthdayName = "Mohamed";
const eventDateText = "10/1/2027";
const eventTimeText = "5:00 pm ";
const eventVenueText = "unlocated yet";

// التاريخ والوقت المكتوبان أعلاه هما موعد المناسبة:
// 10 يناير 2027 الساعة 5:00 مساءً بتوقيت مصر (+02:00)
const countdownTarget = new Date("2027-01-10T17:00:00+02:00");

// عناصر الصفحة التي سنغير نصوصها عند تبديل اللغة
const languageToggle = document.getElementById("languageToggle");
const languageLabel = document.getElementById("languageLabel");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const backgroundMusic = document.getElementById("backgroundMusic");
const musicStatus = document.getElementById("musicStatus");
const rsvpButton = document.getElementById("rsvpButton");
const rsvpDialog = document.getElementById("rsvpDialog");
const rsvpArrow = document.getElementById("rsvpArrow");

// ضع بيانات المناسبة في أماكنها من جافاسكربت
document.getElementById("birthdayName").textContent = birthdayName;
document.getElementById("eventDate").textContent = eventDateText;
document.getElementById("eventTime").textContent = eventTimeText;
document.getElementById("eventVenue").textContent = eventVenueText;

function updateMusicButton() {
  const isArabic = document.documentElement.lang === "ar";
  const isPlaying = !backgroundMusic.paused;
  musicLabel.textContent = isArabic
    ? (isPlaying ? "إيقاف الأغنية" : "تشغيل الأغنية")
    : (isPlaying ? "Pause music" : "Play music");
  musicToggle.setAttribute("aria-label", musicLabel.textContent);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.querySelector(".music-icon").textContent = isPlaying ? "❚❚" : "▶";
}

// يحول كل العناصر ذات خاصية data-ar و data-en عند الضغط على زر اللغة
function setLanguage(language) {
  const isArabic = language === "ar";
  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
    element.textContent = isArabic ? element.dataset.ar : element.dataset.en;
  });

  languageLabel.textContent = isArabic ? "English" : "العربية";
  languageToggle.setAttribute(
    "aria-label",
    isArabic ? "Switch to English" : "التبديل إلى العربية"
  );
  document.querySelector(".language-icon").textContent = isArabic ? "ع" : "EN";
  rsvpArrow.textContent = isArabic ? "←" : "→";
  document.title = isArabic ? "دعوة عيد ميلاد محمد" : "Mohamed's Birthday Invitation";
  updateMusicButton();

  // يحفظ اختيار الزائر ويستعيده عند فتح الصفحة مرة أخرى
  try {
    localStorage.setItem("invitationLanguage", language);
  } catch {
    // تستمر الصفحة بالعمل إذا منع المتصفح الوصول إلى التخزين المحلي
  }
}

languageToggle.addEventListener("click", () => {
  const nextLanguage = document.documentElement.lang === "ar" ? "en" : "ar";
  setLanguage(nextLanguage);
});

// استعادة اختيار الزائر المحفوظ، أو استخدام الإنجليزية كافتراضي
let savedLanguage = null;
try {
  savedLanguage = localStorage.getItem("invitationLanguage");
} catch {
  savedLanguage = null;
}
setLanguage(savedLanguage === "ar" ? "ar" : "en");

musicToggle.addEventListener("click", async () => {
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
    return;
  }

  try {
    await backgroundMusic.play();
    musicStatus.textContent = "";
  } catch {
    musicStatus.textContent = document.documentElement.lang === "ar"
      ? "تعذّر تشغيل الأغنية. تأكد من وجود الملف داخل مجلد sounds."
      : "Music could not be played. Check that the audio file exists in the sounds folder.";
  }
});

backgroundMusic.addEventListener("play", updateMusicButton);
backgroundMusic.addEventListener("pause", updateMusicButton);
backgroundMusic.addEventListener("error", () => {
  musicStatus.textContent = document.documentElement.lang === "ar"
    ? "تعذّر تحميل الأغنية من مجلد sounds."
    : "The song could not be loaded from the sounds folder.";
});

backgroundMusic.play().catch(() => {
  const isArabic = document.documentElement.lang === "ar";
  musicStatus.textContent = backgroundMusic.error
    ? (isArabic
      ? "تعذّر تحميل الأغنية من مجلد sounds."
      : "The song could not be loaded from the sounds folder.")
    : (isArabic
      ? "قد يمنع المتصفح التشغيل التلقائي. اضغط زر تشغيل الأغنية للبدء."
      : "Your browser may block autoplay. Press Play music to start.");
});

// عداد تنازلي لحساب الأيام والساعات والدقائق والثواني
function updateCountdown() {
  const now = new Date();
  const remaining = countdownTarget.getTime() - now.getTime();

  if (remaining <= 0) {
    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// تحديث العداد فور العودة للصفحة بعد قفل الشاشة أو تبديل التطبيقات
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateCountdown();
  }
});

window.addEventListener("resize", updateCountdown);

// فتح نافذة تأكيد الحضور
rsvpButton.addEventListener("click", () => {
  if (typeof rsvpDialog.showModal === "function") {
    rsvpDialog.showModal();
  } else {
    rsvpDialog.setAttribute("open", "");
  }
});