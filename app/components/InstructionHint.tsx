import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InstructionHintProps {
  dismissCount: number;
}

export function InstructionHint({ dismissCount }: InstructionHintProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (dismissCount > 0) {
      setVisible(false);
    }
  }, [dismissCount]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.p
          className="text-center py-3 text-[12px] text-cyber-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          Tap &times; to eliminate
        </motion.p>
      )}
    </AnimatePresence>
  );
}
