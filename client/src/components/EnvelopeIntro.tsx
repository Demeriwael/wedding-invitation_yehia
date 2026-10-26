import { useId } from "react";
import "./envelope-intro.css";
import envelopeArtwork from "@/assets/images/embossed-envelope.webp";
import envelopeReference from "@/assets/images/envelope-reference.jpg";
import bismillah from "@/assets/images/bismillah.webp";
import yahyaName from "@/assets/images/yahya-name.webp";
import daliaName from "@/assets/images/dalia-name.webp";

// The two matching edges divide the artwork into a hinged flap and a pocket.
const SCALLOPED_EDGE = `
  C .982 .269 .974 .271 .961 .275
  C .953 .311 .935 .318 .910 .320
  C .889 .351 .845 .365 .779 .370
  C .769 .400 .728 .416 .666 .422
  C .646 .456 .602 .475 .549 .486
  C .524 .493 .510 .500 .500 .509
  C .490 .500 .476 .493 .451 .486
  C .398 .475 .354 .456 .334 .422
  C .272 .416 .231 .400 .221 .370
  C .155 .365 .111 .351 .090 .320
  C .065 .318 .047 .311 .039 .275
  C .026 .271 .018 .269 0 .255
`;

export default function EnvelopeIntro({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  const id = useId().replace(/:/g, "");
  const flapId = `${id}-flap`;
  const pocketId = `${id}-pocket`;
  const sealId = `${id}-seal`;
  const noteId = `${id}-note`;

  return (
    <div className={`envelope-screen ${opening ? "is-opening" : ""}`} aria-busy={opening}>
      <svg className="envelope-clip-definitions" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id={flapId} clipPathUnits="objectBoundingBox">
            <path d={`M 0 0 H 1 V .255 ${SCALLOPED_EDGE} Z`} />
          </clipPath>
          <clipPath id={pocketId} clipPathUnits="objectBoundingBox">
            <path d={`M 1 .255 ${SCALLOPED_EDGE} V 1 H 1 Z`} />
          </clipPath>
          <clipPath id={sealId}>
            <path d="M360 542 C384 539 401 550 419 558 C441 566 451 588 465 610 C478 630 482 648 479 667 C476 686 468 703 464 723 C460 744 442 756 422 763 C404 771 388 781 367 780 C348 782 328 775 309 770 C288 764 274 749 262 732 C250 714 246 692 243 674 C238 654 240 636 247 617 C254 597 270 581 286 569 C307 554 334 547 360 542 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="envelope-scene">
        <button
          type="button"
          className="reference-envelope"
          onClick={onOpen}
          disabled={opening}
          aria-label="افتح الظرف لاستكشاف الدعوة"
          aria-describedby={noteId}
        >
          <span className="envelope-liner" aria-hidden="true" />
          <span className="envelope-glow" aria-hidden="true" />
          <span className="envelope-letter" aria-hidden="true">
            <img className="envelope-letter-bismillah" src={bismillah} alt="" />
            <small>بكل الحب ندعوكم لمشاركتنا فرحتنا</small>
            <span className="envelope-letter-names">
              <img src={yahyaName} alt="" />
              <i>و</i>
              <img src={daliaName} alt="" />
            </span>
            <span className="envelope-letter-rule" />
            <small>١٢ نوفمبر ٢٠٢٦</small>
          </span>
          <span className="envelope-pocket" style={{ clipPath: `url(#${pocketId})` }} aria-hidden="true">
            <img src={envelopeArtwork} alt="" draggable={false} />
          </span>
          <span className="envelope-flap" style={{ clipPath: `url(#${flapId})` }} aria-hidden="true">
            <img src={envelopeArtwork} alt="" draggable={false} />
          </span>
          <span className="envelope-seal" aria-hidden="true">
            <svg viewBox="232 532 260 260" fill="none">
              <image href={envelopeReference} width="720" height="1280" clipPath={`url(#${sealId})`} />
            </svg>
          </span>
          <span className="envelope-kicker" aria-hidden="true">دعوة خاصة لك</span>
          <span className="envelope-caption" aria-hidden="true">
            <span lang="en" dir="ltr">Tap to open</span>
          </span>
        </button>

        <div className="entry-note" id={noteId} role="note" aria-label="تنويه الحضور">
          <strong>هذه الدعوة مخصصة لشخصين فقط</strong>
          <span>نعتذر عن اصطحاب الأطفال</span>
        </div>
      </div>
    </div>
  );
}
