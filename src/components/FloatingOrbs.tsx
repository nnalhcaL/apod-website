import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { REPORT_ORBS } from '../content/reportOrbs';
import { OrbData } from '../types';

interface FloatingOrbsProps {
  mousePos: { x: number; y: number };
  onOrbClick: (orb: OrbData) => void;
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ mousePos, onOrbClick }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [idleTimer, setIdleTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const isDesktop = viewportWidth >= 1024;
  const orbScale = viewportWidth >= 1440 ? 0.82 : isDesktop ? 0.88 : 1;
  const motionScale = viewportWidth >= 1440 ? 0.76 : isDesktop ? 0.86 : 1;
  const labelMaxWidth = viewportWidth >= 1440 ? 152 : isDesktop ? 160 : viewportWidth >= 640 ? 176 : 148;
  const labelFontSize = isDesktop ? 12 : 13;
  const labelLineHeight = isDesktop ? 1.22 : 1.28;
  const labelNumberFontSize = isDesktop ? 10 : 11;

  useEffect(() => {
    if (idleTimer) clearTimeout(idleTimer);
    setIsIdle(false);
    const timer = setTimeout(() => setIsIdle(true), 400);
    setIdleTimer(timer);
    return () => clearTimeout(timer);
  }, [mousePos]);

  const nearestNeighbors = useMemo(() => {
    if (!hoveredId || !isIdle) return [];
    const current = REPORT_ORBS.find((orb) => orb.id === hoveredId);
    if (!current) return [];

    return REPORT_ORBS
      .filter((orb) => orb.id !== hoveredId)
      .map((orb) => ({
        ...orb,
        dist: Math.sqrt(Math.pow(orb.x - current.x, 2) + Math.pow(orb.y - current.y, 2)),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2);
  }, [hoveredId, isIdle]);

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      <svg className="absolute inset-0 h-full w-full">
        <AnimatePresence>
          {hoveredId && isIdle && nearestNeighbors.map((neighbor) => {
            const current = REPORT_ORBS.find((orb) => orb.id === hoveredId);
            if (!current) {
              return null;
            }

            return (
              <motion.line
                key={`${hoveredId}-${neighbor.id}`}
                x1={`${current.x}%`}
                y1={`${current.y}%`}
                x2={`${neighbor.x}%`}
                y2={`${neighbor.y}%`}
                stroke="rgba(255, 138, 51, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {REPORT_ORBS.map((orb) => {
        const orbX = (orb.x / 100) * window.innerWidth;
        const orbY = (orb.y / 100) * window.innerHeight;
        const distToMouse = Math.sqrt(Math.pow(mousePos.x - orbX, 2) + Math.pow(mousePos.y - orbY, 2));
        const proximityGlow = Math.max(0, 1 - distToMouse / 200);
        const duration = 8 + (orb.id % 3) * 3;
        const range = (30 + (orb.id % 2) * 20) * motionScale;
        const visualSize = orb.size * orbScale;
        const labelAlignmentClass =
          orb.x > 82 ? 'items-end text-right' : orb.x < 18 ? 'items-start text-left' : 'items-center text-center';

        return (
          <motion.div
            key={orb.id}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center pointer-events-auto"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: hoveredId === orb.id ? 1.15 : 1,
              x: [0, range, 0, -range, 0],
              y: [0, range / 2, range, range / 2, 0],
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { type: 'spring', stiffness: 300, damping: 20 },
              x: { duration, repeat: Infinity, ease: 'linear' },
              y: { duration: duration * 0.8, repeat: Infinity, ease: 'linear' },
            }}
            onHoverStart={() => setHoveredId(orb.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => onOrbClick(orb)}
          >
            <motion.div
              className="relative rounded-full"
              style={{
                width: visualSize,
                height: visualSize,
                background: 'radial-gradient(circle, #FFF3E0 0%, #FF8A33 60%, transparent 100%)',
                boxShadow: `0 0 ${20 + proximityGlow * 40}px ${hoveredId === orb.id ? 'rgba(255, 213, 79, 0.8)' : 'rgba(255, 138, 51, 0.4)'}`,
              }}
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 0 20px rgba(255, 138, 51, 0.4)',
                  '0 0 30px rgba(255, 138, 51, 0.6)',
                  '0 0 20px rgba(255, 138, 51, 0.4)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {proximityGlow > 0.5 && (
                <motion.div
                  className="absolute inset-0 rounded-full border border-accent-gold"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>

            <div
              className={`mt-3 flex flex-col gap-1 sm:mt-4 ${labelAlignmentClass}`}
              style={{ maxWidth: labelMaxWidth }}
            >
              <span
                className="font-sans font-medium leading-none tracking-[0.04em] text-white/45"
                style={{ fontSize: labelNumberFontSize }}
              >
                {orb.id}.
              </span>
              <motion.span
                className="relative block text-balance font-sans font-medium tracking-[0.01em]"
                style={{ fontSize: labelFontSize, lineHeight: labelLineHeight }}
                animate={{
                  color: hoveredId === orb.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.76)',
                }}
              >
                {orb.orbLabel}
                {hoveredId === orb.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-accent-orange"
                  />
                )}
              </motion.span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingOrbs;
