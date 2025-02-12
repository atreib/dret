"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  messages: string[];
};

export function RotatingLoadingMessage({ messages }: Props) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessageIndex}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-base font-semibold"
        >
          {messages[currentMessageIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
