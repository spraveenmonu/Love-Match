import { useEffect, useRef } from 'react';
import '../styles/FloatingHearts.css';

/**
 * Romantic ambient floating particles + interactive pointer sparkle trail.
 */
export default function FloatingHearts() {
  const containerRef = useRef(null);
  const lastSpawnTime = useRef(0);

  useEffect(() => {
    // Dynamic interactive sparkle trail on cursor movement and tap bursts
    const spawnParticle = (x, y, isClick = false) => {
      const container = containerRef.current;
      if (!container) return;

      const count = isClick ? 5 : 1;
      const symbols = ['💖', '💕', '✨', '🌸', '🤍', '💗', '⭐'];

      for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'interactive-sparkle';
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];

        const offsetX = (Math.random() - 0.5) * (isClick ? 36 : 14);
        const offsetY = (Math.random() - 0.5) * (isClick ? 36 : 14);
        const scale = 0.65 + Math.random() * 0.6;
        const driftX = (Math.random() - 0.5) * 50;

        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;
        particle.style.setProperty('--scale', scale);
        particle.style.setProperty('--drift-x', `${driftX}px`);

        container.appendChild(particle);
        setTimeout(() => {
          particle.remove();
        }, 850);
      }
    };

    const handlePointerMove = (e) => {
      const now = performance.now();
      if (now - lastSpawnTime.current < 65) return; // throttle for buttery 60fps
      lastSpawnTime.current = now;
      spawnParticle(e.clientX, e.clientY, false);
    };

    const handlePointerDown = (e) => {
      spawnParticle(e.clientX, e.clientY, true);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const ambientItems = [
    { emoji: '🌸', className: 'p1 sway-left' },
    { emoji: '💖', className: 'p2 sway-right' },
    { emoji: '✨', className: 'p3 sway-left' },
    { emoji: '💗', className: 'p4 sway-right' },
    { emoji: '💕', className: 'p5 sway-left' },
    { emoji: '🌷', className: 'p6 sway-right' },
    { emoji: '💘', className: 'p7 sway-left' },
    { emoji: '🤍', className: 'p8 sway-right' },
    { emoji: '💖', className: 'p9 sway-left' },
    { emoji: '✨', className: 'p10 sway-right' },
    { emoji: '🌸', className: 'p11 sway-left' },
    { emoji: '💕', className: 'p12 sway-right' },
  ];

  return (
    <div className="floating-hearts-container" ref={containerRef} aria-hidden="true">
      {/* Dreamy ambient bokeh glow orbs */}
      <div className="ambient-glow glow-1" />
      <div className="ambient-glow glow-2" />
      <div className="ambient-glow glow-3" />

      {/* Floating particles with organic sways */}
      {ambientItems.map((item, i) => (
        <span key={i} className={`floating-heart-item ${item.className}`}>
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
