import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import type { CelebrityCard as CelebrityCardType } from "../state/types";
import { DismissButton } from "./DismissButton";

interface CelebrityCardProps {
  card: CelebrityCardType;
  index: number;
  isMarked?: boolean;
  onDismiss: () => void;
}

function getInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (
    (parts[0][0]?.toUpperCase() ?? "") +
    (parts[parts.length - 1][0]?.toUpperCase() ?? "")
  );
}

const CelebrityCardComponent = React.memo(function CelebrityCard({
  card,
  index,
  isMarked = false,
  onDismiss,
}: CelebrityCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const [imgError, setImgError] = useState(false);

  function handleDragEnd(
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    const shouldDismiss =
      Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 500;
    if (shouldDismiss) {
      onDismiss();
    }
  }

  return (
    <motion.div
      style={{ x, rotate, touchAction: "none" }}
      drag={card.isChad ? false : "x"}
      dragElastic={0.15}
      dragConstraints={{ left: 0, right: 0 }}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 40 }}
      onDragEnd={card.isChad ? undefined : handleDragEnd}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.06, duration: 0.3, ease: "easeOut" },
      }}
      exit={{
        x: 600,
        opacity: 0,
        rotate: 30,
        transition: { duration: 0.25, ease: "easeIn" },
      }}
      layout
      className={[
        "relative overflow-hidden rounded-lg aspect-[3/4] bg-cyber-panel",
        isMarked
          ? "shadow-[0_0_24px_rgba(255,0,0,0.6)] border-2 border-red-500"
          : [
              "shadow-[0_0_8px_rgba(0,245,255,0.15)] hover:shadow-[0_0_16px_rgba(0,245,255,0.35)]",
              card.isChad
                ? "border border-neon-yellow"
                : "border border-neon-cyan/40 hover:border-neon-cyan",
            ].join(" "),
        "transition-shadow duration-200 cursor-grab active:cursor-grabbing",
      ].join(" ")}
    >
      {/* Profile photo */}
      {!imgError ? (
        <img
          src={card.photoPath}
          alt={card.displayName}
          className="w-full h-[60%] object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-[60%] bg-cyber-surface flex items-center justify-center">
          <span className="text-cyber-muted text-4xl font-bold">
            {getInitials(card.displayName)}
          </span>
        </div>
      )}

      {/* Card body */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-base font-bold text-cyber-text">{card.displayName}</p>
        <p className="text-xs font-bold text-neon-cyan">{card.handle}</p>
        <p className="text-sm text-cyber-text line-clamp-2">{card.bio}</p>
        <p className="text-xs text-cyber-muted">{card.followerCount} followers</p>
      </div>

      {/* Auto-dismiss mark overlay */}
      <AnimatePresence>
        {isMarked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10"
          >
            <span className="text-red-500 text-6xl font-bold drop-shadow-[0_0_12px_rgba(255,0,0,0.8)]">
              ✗
            </span>
            <span className="text-red-400 text-sm font-bold mt-2 uppercase tracking-wider">
              Not a Twitter Celebrity
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dismiss button (not shown for chad) */}
      {!card.isChad && <DismissButton onDismiss={onDismiss} />}
    </motion.div>
  );
});

export { CelebrityCardComponent as CelebrityCard };
