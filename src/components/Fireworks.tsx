import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const COLORS = ['#fde68a', '#f9a8d4', '#a5b4fc', '#93c5fd', '#c4b5fd', '#ffffff', '#fdba74'];

const Fireworks = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let particles: Particle[] = [];
    let frame = 0;
    let raf = 0;

    const burst = () => {
      const x = canvas.width * (0.15 + Math.random() * 0.7);
      const y = canvas.height * (0.12 + Math.random() * 0.4);
      const base = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 70;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 1.5 + Math.random() * 3.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: Math.random() > 0.3 ? base : COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 1.5 + Math.random() * 1.5,
        });
      }
    };

    burst();

    const tick = () => {
      frame++;
      if (frame % 45 === 0) burst();

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.04;
        p.life -= 0.012;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default Fireworks;
