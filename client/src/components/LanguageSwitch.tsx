import type { InvitationLocale } from "@/lib/invitation-copy";

export default function LanguageSwitch({ locale }: { locale: InvitationLocale }) {
  const toEnglish = locale === "ar";
  return (
    <a
      className="language-switch"
      href={toEnglish ? "/en/" : "/"}
      hrefLang={toEnglish ? "en" : "ar"}
      lang={toEnglish ? "en" : "ar"}
      dir={toEnglish ? "ltr" : "rtl"}
      aria-label={toEnglish ? "Switch to English" : "التبديل إلى العربية"}
    >
      {toEnglish ? "English" : "العربية"}
    </a>
  );
}
