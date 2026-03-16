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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6 p-4 xl:p-8 pt-2">
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
