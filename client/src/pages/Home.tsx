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
import LanguageSwitch from "@/components/LanguageSwitch";
import { invitationCopy, type InvitationLocale } from "@/lib/invitation-copy";
import { createWeddingCalendar, WEDDING_DATE } from "@/lib/wedding-event";

type IntroStage = "closed" | "opening" | "gone";
type Attendance = "yes" | "declined" | null;

const ENVELOPE_OPEN_DURATION = 1900;

const MAPS_URL = "https://maps.app.goo.gl/Br6ykea6Nz7f8EaX8";
const WHATSAPP_NUMBER = "962789319676";

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

export default function Home({ locale = "ar" }: { locale?: InvitationLocale } = {}) {
  const copy = invitationCopy[locale];
  const confirmationUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.confirmationMessage)}`;
  const declineUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(copy.declineMessage)}`;
  const formatDigits = (value: number) => locale === "ar" ? toArabicDigits(value) : String(value).padStart(2, "0");
  const [introStage, setIntroStage] = useState<IntroStage>("closed");
  const [isScrolled, setIsScrolled] = useState(false);
  const [attendance, setAttendance] = useState<Attendance>(null);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(WEDDING_DATE));
  const envelopeTimer = useRef<number | null>(null);
  const brandButton = useRef<HTMLButtonElement>(null);
  const overlayActive = introStage !== "gone";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = copy.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy.description);
  }, [locale, copy]);

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
    const event = createWeddingCalendar(locale);
    const blob = new Blob([event], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = locale === "en" ? "yahya-dalia-wedding-en.ics" : "yahya-dalia-wedding.ics";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    toast.success(copy.calendarToast, { description: copy.calendarToastDescription });
  };

  const shareInvitation = async () => {
    const shareData = {
      title: copy.shareTitle,
      text: copy.shareText,
      url: `${window.location.origin}${locale === "en" ? "/en/" : "/"}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success(copy.copied);
      }
    } catch {
      // Closing a native share sheet is intentionally silent.
    }
  };

  const respondYes = () => {
    setAttendance("yes");
    toast(copy.yesToast, { description: copy.yesToastDescription });
  };

  const respondDecline = () => {
    setAttendance("declined");
    toast(copy.noToast, { description: copy.noToastDescription });
  };

  return (
    <div className="invitation-page" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <header inert={overlayActive} className={`topbar ${isScrolled ? "topbar-scrolled" : ""}`}>
        <button ref={brandButton} className="brand-mark" onClick={() => window.scrollTo({ top: 0, behavior: "auto" })} aria-label={copy.backToStart}>
          {copy.brand}
        </button>
        <div className="topbar-actions">
          <LanguageSwitch locale={locale} />
          <a className="header-rsvp" href="#rsvp">{copy.rsvpAction}</a>
          <button className="icon-action" onClick={replayEnvelope} aria-label={copy.replay} title={copy.replay}><RotateCcw size={17} strokeWidth={1.75} /></button>
          <button className="icon-action" onClick={shareInvitation} aria-label={copy.share} title={copy.share}><Share2 size={18} strokeWidth={1.75} /></button>
        </div>
      </header>

      <main inert={overlayActive}>
        <section className="hero-section" id="start">
          <div className="hero-frame">
            <FloralSprig className="hero-floral hero-floral-tl" />
            <FloralSprig className="hero-floral hero-floral-br" />
            <div className="hero-frame-content">
              <img className="eyebrow-image" src={bismillah} alt={locale === "en" ? "" : copy.invocationAlt} />
              {copy.invocationTranslation && <p className="english-invocation">{copy.invocationTranslation}</p>}
              <p className="verse">{copy.verse}</p>

              <div className="parents-invite">
                <div className="parent-col">
                  <span className="parent-title">{copy.firstHostTitle}</span>
                  <strong className="parent-name">{copy.firstHostName}</strong>
                </div>
                <div className="parent-col">
                  <span className="parent-title">{copy.secondHostTitle}</span>
                  <strong className="parent-name">{copy.secondHostName}</strong>
                </div>
              </div>
              <p className="invite-phrase">{copy.invitePhrase}</p>
              <div className="relation-labels">
                <span className="relation-label">{copy.firstRelation}</span>
                <span className="relation-label">{copy.secondRelation}</span>
              </div>
              <h1 className="relation-names" aria-label={copy.coupleLabel}>
                {locale === "ar" ? <>
                  <img className="relation-name-img" src={yahyaName} alt={copy.firstName} />
                  <img className="relation-name-img" src={daliaName} alt={copy.secondName} />
                </> : <>
                  <span className="relation-name-text">{copy.firstName}</span>
                  <span className="relation-name-text">{copy.secondName}</span>
                </>}
              </h1>

              <p className="hero-willing">{copy.willing}</p>
              <div className="hero-details-row">
                <div className="hero-detail">
                  <CalendarDays size={16} strokeWidth={1.6} />
                  <span>{copy.shortDate}</span>
                </div>
                <span className="hero-detail-sep" aria-hidden="true" />
                <div className="hero-detail">
                  <Clock3 size={16} strokeWidth={1.6} />
                  <span>{copy.shortTime}</span>
                </div>
                <span className="hero-detail-sep" aria-hidden="true" />
                <a className="hero-detail hero-detail-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                  <MapPin size={16} strokeWidth={1.6} />
                  <span>{copy.venue}</span>
                </a>
              </div>
              <p className="hero-closing">{copy.closing}</p>
              <Ornament className="hero-ornament" />
            </div>
          </div>
          <div className="hero-actions">
            <a className="hero-map-action" href={MAPS_URL} target="_blank" rel="noopener noreferrer"><MapPin size={17} /> {copy.venueAction}</a>
            <a className="hero-rsvp-action" href="#rsvp"><Heart size={17} /> {copy.rsvpAction}</a>
          </div>
          <button className="scroll-cue" onClick={() => document.getElementById("details")?.scrollIntoView({ behavior: "auto" })}>
            <span>{copy.detailsKicker}</span>
            <ArrowDown size={17} />
          </button>
        </section>

        <section className="details-section" id="details">
          <FloralSprig className="section-floral section-floral-tl" />
          <FloralSprig className="section-floral section-floral-br" />
          <div className="content-column">
            <div className="details-heading reveal">
              <p className="mini-kicker">{copy.detailsKicker}</p>
              <h2>{copy.detailsHeading}</h2>
            </div>

            <div className="details-card reveal">
              <div className="detail-trio">
                <div className="detail-chip">
                  <span className="detail-chip-icon"><Clock3 size={18} /></span>
                  <small>{copy.timeLabel}</small>
                  <strong>{copy.time}</strong>
                </div>
                <span className="detail-chip-sep" aria-hidden="true" />
                <div className="detail-chip">
                  <span className="detail-chip-icon"><MapPin size={18} /></span>
                  <small>{copy.venueLabel}</small>
                  <strong>{copy.venue}</strong>
                  <em>{copy.hall}</em>
                </div>
                <span className="detail-chip-sep" aria-hidden="true" />
                <div className="detail-chip">
                  <span className="detail-chip-icon"><CalendarDays size={18} /></span>
                  <small>{copy.dateLabel}</small>
                  <strong>{copy.weekday}</strong>
                  <em>{copy.fullDate}</em>
                </div>
              </div>
              <div className="detail-trio-foot">
                <a className="map-link" href={MAPS_URL} target="_blank" rel="noopener noreferrer">{copy.mapAction}</a>
              </div>
              <button className="calendar-button" onClick={saveTheDate}>
                <CalendarDays size={17} /> <span>{copy.calendarAction}</span>
              </button>
            </div>

            <div className="venue-notice reveal">
              <p>{copy.childrenNotice}</p>
              <p>{copy.photographyNotice}</p>
            </div>

            <div className="countdown-card reveal">
              <p className="countdown-title">{copy.countdownTitle}</p>
              <div className="countdown-grid">
                {[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((value, index) => (
                  <div className="countdown-box" key={copy.countdownLabels[index]}><strong>{formatDigits(value)}</strong><span>{copy.countdownLabels[index]}</span></div>
                ))}
              </div>
            </div>

            <div className="timeline reveal">
              {copy.schedule.map((item, index) => (
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
            <p>{copy.quoteFirst}<br />{copy.quoteSecond}</p>
            <span className="signature">{copy.signature}</span>
          </div>
          <Ornament className="note-ornament reveal" />
        </section>

        <section className="rsvp-section" id="rsvp">
          <div className="content-column">
            <div className="rsvp-card reveal">
              <div className="rsvp-icon"><MessageCircleHeart size={24} /></div>
              <p className="mini-kicker">{copy.rsvpKicker}</p>
              <h2>{copy.rsvpHeading}</h2>
              <p className="rsvp-copy">{copy.rsvpCopy}</p>
              <div className="rsvp-actions">
                <a className={`primary-rsvp ${attendance === "yes" ? "selected" : ""}`} href={confirmationUrl} target="_blank" rel="noopener noreferrer" onClick={respondYes}>
                  {attendance === "yes" ? <Check size={18} /> : <Heart size={17} fill="currentColor" />} {copy.rsvpYes}
                </a>
                <a
                  className={`secondary-rsvp ${attendance === "declined" ? "selected" : ""}`}
                  href={declineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={respondDecline}
                >
                  {copy.rsvpNo}
                </a>
              </div>
              <p className="rsvp-hint">{copy.rsvpHint}</p>
            </div>
          </div>
        </section>
      </main>

      <footer inert={overlayActive}>
        <Ornament className="footer-ornament" />
        <p>{copy.footerMessage}</p>
        <span>{copy.footerNames}</span>
      </footer>

      {introStage !== "gone" && (
        <EnvelopeIntro opening={introStage === "opening"} onOpen={openEnvelope} locale={locale} />
      )}
    </div>
  );
}
