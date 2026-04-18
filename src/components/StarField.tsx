import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface StarFieldProps {
  mousePos: { x: number; y: number };
}

const StarField: React.FC<StarFieldProps> = ({ mousePos }) => {
  const stars = useMemo(() => {
    return Array.from({ length: 200 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((star) => {
        const dx = (mousePos.x - window.innerWidth / 2) / (window.innerWidth / 2);
        const dy = (mousePos.y - window.innerHeight / 2) / (window.innerHeight / 2);
        const parallaxX = dx * 8;
        const parallaxY = dy * 8;

        return (
          <motion.div
            key={star.id}
            className="absolute bg-white rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              x: parallaxX,
              y: parallaxY,
            }}
          />
        );
      })}
    </div>
  );
};

export default StarField;
