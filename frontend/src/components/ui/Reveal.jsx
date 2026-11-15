import { motion } from "motion/react";

const tags = {
  div: motion.div,
  section: motion.section,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  li: motion.li,
};

export const Reveal = ({
  children,
  as = "div",
  delay = 0,
  y = 24,
  className,
}) => {
  const MotionTag = tags[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </MotionTag>
  );
};
