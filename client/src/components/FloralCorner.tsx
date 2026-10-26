import laceCorner from "@/assets/images/lace-corner.webp";

/** Reusable lace/pearl corner ornament, cropped from the invitation frame art. */
export function FloralSprig({ className = "" }: { className?: string }) {
  return <img src={laceCorner} alt="" className={className} draggable={false} loading="lazy" />;
}
