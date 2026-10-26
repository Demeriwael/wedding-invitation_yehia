import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Check,
  Clock3,
  Heart,
  MapPin,
  MessageCircleHeart,
  RotateCcw,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import bismillah from "@/assets/images/bismillah.webp";
import daliaName from "@/assets/images/dalia-name.webp";
import yahyaName from "@/assets/images/yahya-name.webp";
import { FloralSprig } from "@/components/FloralCorner";
import EnvelopeIntro from "@/components/EnvelopeIntro";

type IntroStage = "closed" | "opening" | "gone";
type Attendance = "yes" | "declined" | null;

const ENVELOPE_OPEN_DURATION = 1900;

const MAPS_URL = "https://maps.app.goo.gl/Br6ykea6Nz7f8EaX8";
const WHATSAPP_NUMBER = "962789319676";
const APOLOGY_MESSAGE =
  "السلام عليكم، يؤسفني إبلاغكم أنه لن يتسنى لي حضور حفل زفاف يحيى وداليا، أعتذر عن عدم الحضور وأتمنى لهما دوام السعادة.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(APOLOGY_MESSAGE)}`;
const CONFIRMATION_MESSAGE = "السلام عليكم، يسعدني تأكيد حضوري حفل زفاف يحيى وداليا. بارك الله لهما وبارك عليهما وجمع بينهما في خير.";
const CONFIRMATION_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(CONFIRMATION_MESSAGE)}`;
const WEDDING_DATE = new Date("2026-11-12T18:00:00+03:00");

const schedule = [
  { time: "٥:٠٠ م", title: "زفة", note: "عند بيت العروس" },
  { time: "٦:٠٠ م", title: "استقبال الأحبة", note: "في الصالة" },
];

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
function toArabicDigits(value: number) {
  return String(value)
    .padStart(2, "0")
    .split("")
    .map((char) => ARABIC_DIGITS[Number(char)] ?? char)
    .join("");
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 72" fill="none" aria-hidden="true">
      <path d="M99 65C97 43 78 20 53 8C39 2 23 2 9 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M101 65C103 43 122 20 147 8C161 2 177 2 191 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M76 42C66 31 52 28 43 29C48 38 58 45 70 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M124 42C134 31 148 28 157 29C152 38 142 45 130 45" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M100 64V10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M100 24C90 17 82 17 77 19C82 27 90 29 99 27" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M100 35C110 28 118 28 123 30C118 38 110 40 101 38" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [introStage, setIntroStage] = useState<IntroStage>("closed");
  const [isScrolled, setIsScrolled] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>(null);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(WEDDING_DATE));
  const envelopeTimer = useRef<number | null>(null);
  const brandButton = useRef<HTMLButtonElement>(null);
  const overlayActive = introStage !== "gone";

  useEffect(() => {
    if (introStage === "gone") brandButton.current?.focus({ preventScroll: true });
  }, [introStage]);

  useEffect(() => {
    document.body.style.overflow = overlayActive ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayActive]);

  useEffect(() => () => {
    if (envelopeTimer.current) clearTimeout(envelopeTimer.current);
  }, []);

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 34);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeLeft(WEDDING_DATE)), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const replayEnvelope = () => {
    if (envelopeTimer.current) clearTimeout(envelopeTimer.current);
    setIntroStage("closed");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openEnvelope = () => {
    if (introStage !== "closed") return;
    window.scrollTo({ top: 0, behavior: "instant" });
    setIntroStage("opening");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    envelopeTimer.current = window.setTimeout(
      () => setIntroStage("gone"),
      reducedMotion ? 160 : ENVELOPE_OPEN_DURATION,
    );
  };

  const saveTheDate = () => {
    const event = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Yahya and Dalia//Wedding Invitation//AR",
      "BEGIN:VEVENT",
      "UID:yahya-dalia-2026@invitation",
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
      "DTSTART:20261112T150000Z",
      "DTEND:20261112T180000Z",
      "SUMMARY:زفاف يحيى وداليا",
      "LOCATION:قاعات النعمان - القاعة الملوكية",
      "DESCRIPTION:ننتظركم لمشاركتنا فرحتنا.",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "yahya-dalia-wedding.ics";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success("تم تحميل موعد الحفل", { description: "افتح الملف لإضافته إلى تقويمك." });
  };

  const shareInvitation = async () => {
    const shareData = {
      title: "دعوة زفاف يحيى وداليا",
      text: "يسعدنا دعوتكم لمشاركتنا فرحة زفاف يحيى وداليا",
      url: `${window.location.origin}${window.location.pathname}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("تم نسخ رابط الدعوة");
      }
    } catch {
      // Closing a native share sheet is intentionally silent.
    }
  };

  const respondYes = () => {
    setAttendance("yes");
    toast("يسعدنا حضوركم", { description: "أرسل الرسالة الجاهزة في واتساب لتأكيد حضورك." });
  };

  const respondDecline = () => {
    setAttendance("declined");
    toast("نعتذر لغيابكم، شكرًا لتواصلكم معنا", { description: "سيتم تحويلكم إلى واتساب لإرسال اعتذاركم." });
  };

  return (
    <div className="invitation-page" dir="rtl">
      <header inert={overlayActive} className={`topbar ${isScrolled ? "topbar-scrolled" : ""}`}>
        <button ref={brandButton} className="brand-mark" onClick={() => window.scrollTo({ top: 0, behavior: "auto" })} aria-label="العودة إلى البداية">
          ي د
        </button>
        <div className="topbar-actions">
          <a className="header-rsvp" href="#rsvp">تأكيد الحضور</a>
          <button className="icon-action" onClick={replayEnvelope} aria-label="إعادة الدعوة" title="إعادة الدعوة"><RotateCcw size={17} strokeWidth={1.75} /></button>
          <button className="icon-action" onClick={shareInvitation} aria-label="مشاركة الدعوة" title="مشاركة الدعوة"><Share2 size={18} strokeWidth={1.75} /></button>
        </div>
      </header>

      <main inert={overlayActive}>
        <section className="hero-section" id="start">
          <div className="hero-frame">
            <FloralSprig className="hero-floral hero-floral-tl" />
            <FloralSprig className="hero-floral hero-floral-br" />
            <div className="hero-frame-content">
              <img className="eyebrow-image" src={bismillah} alt="بسم الله الرحمن الرحيم" />
              <p className="verse">الحمدلله الذي تتم بنعمه الصالحات</p>

              <div className="parents-invite">
                <div className="parent-col">
                  <span className="parent-title">السيد</span>
                  <strong className="parent-name">اسماعيل داقور</strong>
                </div>
                <div className="parent-col">
                  <span className="parent-title">السيد</span>
                  <strong className="parent-name">يحيى الدميري</strong>
                </div>
              </div>
              <p className="invite-phrase">يتشرفان بدعوتكم لحضور حفل زفاف</p>
              <div className="relation-labels">
                <span className="relation-label">ابنه</span>
                <span className="relation-label">شقيقته</span>
              </div>
              <h1 className="relation-names" aria-label="زفاف يحيى وداليا">
                <img className="relation-name-img" src={yahyaName} alt="يحيى" />
                <img className="relation-name-img" src={daliaName} alt="داليا" />
              </h1>

              <p className="hero-willing">وذلك بمشيئة الله تعالى</p>
              <div className="hero-details-row">
                <div className="hero-detail">
                  <CalendarDays size={16} strokeWidth={1.6} />
                  <span>١٢ نوفمبر</span>
                </div>
                <span className="hero-detail-sep" aria-hidden="true" />
                <div className="hero-detail">
                  <Clock3 size={16} strokeWidth={1.6} />
                  <span>٦:٠٠ م</span>
                </div>
                <span className="hero-detail-sep" aria-hidden="true" />
                <a className="hero-detail hero-detail-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <MapPin size={16} strokeWidth={1.6} />
                  <span>قاعات النعمان</span>
                </a>
              </div>
              <p className="hero-closing">وبحضوركم يتم لنا الفرح والسرور</p>
              <Ornament className="hero-ornament" />
            </div>
          </div>
          <div className="hero-actions">
            <a className="hero-map-action" href={MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> موقع الحفل</a>
            <a className="hero-rsvp-action" href="#rsvp"><Heart size={17} /> تأكيد الحضور</a>
          </div>
          <button className="scroll-cue" onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "auto" })}>
            <span>تفاصيل الأمسية</span>
            <ArrowDown size={17} />
          </button>
        </section>

        <section className="details-section" id="details">
          <FloralSprig className="section-floral section-floral-tl" />
          <FloralSprig className="section-floral section-floral-br" />
          <div className="content-column">
            <div className="details-heading reveal">
              <p className="mini-kicker">تفاصيل الأمسية</p>
              <h2>نلتقي على الفرح</h2>
            </div>

            <div className="details-card reveal">
              <div className="detail-trio">
                <div className="detail-chip">
                  <span className="detail-chip-icon"><Clock3 size={18} /></span>
                  <small>الوقت</small>
                  <strong>السادسة مساءً</strong>
                </div>
                <span className="detail-chip-sep" aria-hidden="true" />
                <div className="detail-chip">
                  <span className="detail-chip-icon"><MapPin size={18} /></span>
                  <small>المكان</small>
                  <strong>قاعات النعمان</strong>
                  <em>القاعة الملوكية</em>
                </div>
                <span className="detail-chip-sep" aria-hidden="true" />
                <div className="detail-chip">
                  <span className="detail-chip-icon"><CalendarDays size={18} /></span>
                  <small>التاريخ</small>
                  <strong>الخميس</strong>
                  <em>١٢ نوفمبر ٢٠٢٦</em>
                </div>
              </div>
              <div className="detail-trio-foot">
                <a className="map-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">عرض الموقع على خرائط جوجل</a>
              </div>
              <button className="calendar-button" onClick={saveTheDate}>
                <CalendarDays size={17} /> <span>أضف الموعد إلى تقويمك</span>
              </button>
            </div>

            <div className="venue-notice reveal">
              <p>عذرًا، الدعوة لا تشمل اصطحاب الأطفال</p>
              <p>يُرجى التكرم بعدم التصوير داخل القاعة</p>
            </div>

            <div className="countdown-card reveal">
              <p className="countdown-title">الوقت المتبقي حتى الفرح</p>
              <div className="countdown-grid">
                <div className="countdown-box"><strong>{toArabicDigits(timeLeft.days)}</strong><span>يوم</span></div>
                <div className="countdown-box"><strong>{toArabicDigits(timeLeft.hours)}</strong><span>ساعة</span></div>
                <div className="countdown-box"><strong>{toArabicDigits(timeLeft.minutes)}</strong><span>دقيقة</span></div>
                <div className="countdown-box"><strong>{toArabicDigits(timeLeft.seconds)}</strong><span>ثانية</span></div>
              </div>
            </div>

            <div className="timeline reveal">
              {schedule.map((item, index) => (
                <div className="timeline-item" key={item.time}>
                  <div className="timeline-dot"><span>{index + 1}</span></div>
                  <div className="timeline-content"><time>{item.time}</time><h3>{item.title}</h3><p>{item.note}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="note-section">
          <FloralSprig className="section-floral section-floral-tl" />
          <FloralSprig className="section-floral section-floral-br" />
          <div className="note-quote reveal">
            <span className="quote-mark">“</span>
            <p>وجودكم حولنا هو الهدية التي ننتظرها،<br />فكونوا معنا لنصنع ذكرى تُحكى.</p>
            <span className="signature">يحيى وداليا</span>
          </div>
          <Ornament className="note-ornament reveal" />
        </section>

        <section className="rsvp-section" id="rsvp">
          <div className="content-column">
            <div className="rsvp-card reveal">
              <div className="rsvp-icon"><MessageCircleHeart size={24} /></div>
              <p className="mini-kicker">ننتظركم</p>
              <h2>هل ستشاركوننا الفرح؟</h2>
              <p className="rsvp-copy">يسعدنا تأكيد حضوركم أو اعتذاركم برسالة عبر واتساب.</p>
              <div className="rsvp-actions">
                <a className={`primary-rsvp ${attendance === "yes" ? "selected" : ""}`} href={CONFIRMATION_URL} target="_blank" rel="noopener noreferrer" onClick={respondYes}>
                  {attendance === "yes" ? <Check size={18} /> : <Heart size={17} fill="currentColor" />} سأكون معكم
                </a>
                <a
                  className={`secondary-rsvp ${attendance === "declined" ? "selected" : ""}`}
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={respondDecline}
                >
                  لن أتمكن من الحضور
                </a>
              </div>
              <p className="rsvp-hint">اختر ردّك، ثم أرسل الرسالة الجاهزة في واتساب</p>
            </div>
          </div>
        </section>
      </main>

      <footer inert={overlayActive}>
        <Ornament className="footer-ornament" />
        <p>بكل الحب، ننتظركم</p>
        <span>يحيى × داليا</span>
      </footer>

      {introStage !== "gone" && (
        <EnvelopeIntro opening={introStage === "opening"} onOpen={openEnvelope} />
      )}
    </div>
  );
}
