import { invitationCopy, type InvitationLocale } from "./invitation-copy";

export const WEDDING_DATE = new Date("2026-11-12T18:00:00+03:00");

export function createWeddingCalendar(locale: InvitationLocale, now = new Date()) {
  const copy = invitationCopy[locale];
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//Yahya and Dalia//Wedding Invitation//${locale.toUpperCase()}`,
    "BEGIN:VEVENT",
    "UID:yahya-dalia-2026@invitation",
    `DTSTAMP:${now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    "DTSTART:20261112T150000Z",
    "DTEND:20261112T180000Z",
    `SUMMARY:${copy.calendarTitle}`,
    `LOCATION:${copy.calendarLocation}`,
    `DESCRIPTION:${copy.calendarDescription}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
