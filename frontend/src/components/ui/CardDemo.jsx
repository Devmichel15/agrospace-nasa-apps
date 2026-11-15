import { motion } from "motion/react";

const colorMap = {
  green: { stripe: "#22c55e", badgeBg: "#f0fdf4", badgeBorder: "#86efac", badgeText: "#166534", dot: "#22c55e" },
  orange: { stripe: "#f97316", badgeBg: "#fff7ed", badgeBorder: "#fdba74", badgeText: "#9a3412", dot: "#f97316" },
  red: { stripe: "#ef4444", badgeBg: "#fef2f2", badgeBorder: "#fca5a5", badgeText: "#991b1b", dot: "#ef4444" },
  gray: { stripe: "#9ca3af", badgeBg: "#f9fafb", badgeBorder: "#d1d5db", badgeText: "#374151", dot: "#9ca3af" },
};

const AlertIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3.333L2.5 16.667h15L10 3.333z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8.333v3.334" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="13.333" r="0.833" fill={color} />
  </svg>
);

export const CardDemo = ({ active, states }) => {
  const state = states.find((s) => s.key === active) || states[2];
  const colors = colorMap[state.color];

  return (
    <div className="bg-[#F5F5EF] rounded-2xl sm:rounded-[24px] w-full max-w-[520px] mx-auto overflow-hidden shadow-none">
      <motion.div
        className="w-full h-[10px]"
        animate={{ backgroundColor: colors.stripe }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertIcon color={colors.dot} />
          <span className="text-base font-semibold text-gray-900 capitalize">
            {state.label}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 leading-tight sm:leading-snug mb-3">
          {state.title}
        </h3>

        <p className="text-base text-gray-700 leading-7 sm:leading-8 mb-6">
          {state.description}
        </p>

        <div className="w-full h-px bg-gray-300/70 mb-6" />

        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">
            O que fazer
          </p>
          <p className="text-base text-gray-900 leading-7">{state.advice}</p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="text-xs px-3 py-1 rounded-full border border-dashed font-display"
            style={{
              backgroundColor: colors.badgeBg,
              borderColor: colors.badgeBorder,
              color: colors.badgeText,
            }}
          >
            {state.source}
          </div>
          <p className="text-sm text-gray-600">{state.confidence}</p>
        </div>
      </motion.div>
    </div>
  );
};
