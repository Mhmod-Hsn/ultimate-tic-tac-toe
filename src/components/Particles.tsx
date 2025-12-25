import { useMemo, type FC } from 'react';
import type { Particle } from '../types';

const Particles: FC = () => {
  const particles = useMemo((): Particle[] => {
    return Array.from({ length: 20 }, (_, i): Particle => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
      size: `${4 + Math.random() * 8}px`,
    }));
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
