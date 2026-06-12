'use client';
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  /** 兄弟要素をずらして出すときの遅延 (秒) */
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

/** スクロールで画面に入ったとき、一度だけふわっと立ち上がるラッパー */
const Reveal = ({ delay = 0, className, children }: RevealProps) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
