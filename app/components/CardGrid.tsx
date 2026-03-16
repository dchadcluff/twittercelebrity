import { AnimatePresence } from "framer-motion";
import type { CelebrityCard } from "../state/types";
import { CelebrityCard as CelebrityCardComponent } from "./CelebrityCard";

interface CardGridProps {
  cards: CelebrityCard[];
  dismissed: Set<string>;
  markedId: string | null;
  onDismiss: (id: string) => void;
}

export function CardGrid({ cards, dismissed, markedId, onDismiss }: CardGridProps) {
  const visibleCards = cards.filter((c) => !dismissed.has(c.id));

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 xl:grid-cols-8 gap-2 xl:gap-3 p-2 xl:p-4 pt-2">
      <AnimatePresence mode="popLayout">
        {visibleCards.map((card, idx) => (
          <CelebrityCardComponent
            key={card.id}
            card={card}
            index={idx}
            isMarked={card.id === markedId}
            onDismiss={() => onDismiss(card.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
