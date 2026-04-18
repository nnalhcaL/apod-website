import React, { useEffect, useRef } from 'react';

interface TrailPoint {
  x: number;
  y: number;
}

interface Particle {
  thetaStart: number;
  thetaEnd: number;
  apexHeight: number;
  progress: number;
  duration: number;
  thetaDriftAmplitude: number;
  thetaDriftFrequency: number;
  thetaDriftPhase: number;
  lineWidth: number;
  color: string;
  alphaScale: number;
  isHotspot: boolean;
  trail: TrailPoint[];
  trailBudget: number;
  wobbleAmplitude: number;
  wobbleFrequency: number;
  wobblePhase: number;
}

interface CoronalRainCanvasProps {
  mousePos: { x: number; y: number };
}

const SUN_RADIUS = 450;
const SUN_CENTER_OFFSET_Y = 180;
const ARC_START = Math.PI + 0.411;
const ARC_END = 2 * Math.PI - 0.411;
const ACTIVATION_BAND = 140;

const AMBIENT_EMISSION_RATE = 9.1;
const HOTSPOT_EXTRA_EMISSION_RATE = 15.2;
const AMBIENT_VISIBLE_CAP = 26;
const MAX_ACTIVE_PARTICLES = 58;

const HOTSPOT_DIRECTIONAL_WEIGHT = 0.71;
const HOTSPOT_ANGLE_WINDOW = 0.22;

const AMBIENT_SPAN_MIN = 0.24;
const AMBIENT_SPAN_MAX = 0.44;
const HOTSPOT_SPAN_MIN = 0.18;
const HOTSPOT_SPAN_MAX = 0.34;

const AMBIENT_APEX_MIN = 120;
const AMBIENT_APEX_MAX = 225;
const HOTSPOT_APEX_MIN = 170;
const HOTSPOT_APEX_MAX = 285;

const AMBIENT_DURATION_MIN = 2.3;
const AMBIENT_DURATION_MAX = 3.1;
const HOTSPOT_DURATION_MIN = 1.8;
const HOTSPOT_DURATION_MAX = 2.5;

const WOBBLE_MIN = 7;
const WOBBLE_MAX = 16;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const randomRange = (min: number, max: number) =>
  min + Math.random() * (max - min);

const normalizeTheta = (theta: number) => {
  if (theta < 0) {
    return theta + 2 * Math.PI;
  }

  if (theta >= 2 * Math.PI) {
    return theta - 2 * Math.PI;
  }

  return theta;
};

const isVisibleArcTheta = (theta: number) => theta >= ARC_START && theta <= ARC_END;

const getPosOnArc = (theta: number, width: number, height: number) => {
  const centerX = width / 2;
  const centerY = height + SUN_CENTER_OFFSET_Y;

  return {
    x: centerX + SUN_RADIUS * Math.cos(theta),
    y: centerY + SUN_RADIUS * Math.sin(theta),
  };
};

const easeInOutSine = (progress: number) => -(Math.cos(Math.PI * progress) - 1) / 2;

const createParticle = (hotSpotTheta: number | null): Particle => {
  const isHotspot =
    hotSpotTheta !== null && Math.random() < HOTSPOT_DIRECTIONAL_WEIGHT;
  const loopSpan = isHotspot
    ? randomRange(HOTSPOT_SPAN_MIN, HOTSPOT_SPAN_MAX)
    : randomRange(AMBIENT_SPAN_MIN, AMBIENT_SPAN_MAX);
  const halfSpan = loopSpan / 2;
  const minCenter = ARC_START + halfSpan;
  const maxCenter = ARC_END - halfSpan;

  const loopCenter = isHotspot && hotSpotTheta !== null
    ? clamp(
        hotSpotTheta + randomRange(-HOTSPOT_ANGLE_WINDOW, HOTSPOT_ANGLE_WINDOW),
        minCenter,
        maxCenter,
      )
    : randomRange(minCenter, maxCenter);

  return {
    thetaStart: loopCenter - halfSpan,
    thetaEnd: loopCenter + halfSpan,
    apexHeight: isHotspot
      ? randomRange(HOTSPOT_APEX_MIN, HOTSPOT_APEX_MAX)
      : randomRange(AMBIENT_APEX_MIN, AMBIENT_APEX_MAX),
    progress: 0,
    duration: isHotspot
      ? randomRange(HOTSPOT_DURATION_MIN, HOTSPOT_DURATION_MAX)
      : randomRange(AMBIENT_DURATION_MIN, AMBIENT_DURATION_MAX),
    thetaDriftAmplitude: isHotspot
      ? randomRange(0.025, 0.06)
      : randomRange(0.035, 0.08),
    thetaDriftFrequency: randomRange(0.8, 1.5),
    thetaDriftPhase: randomRange(0, Math.PI * 2),
    lineWidth: isHotspot ? randomRange(2.6, 3.4) : randomRange(1.8, 2.5),
    color: isHotspot
      ? (Math.random() > 0.5 ? '#FFD36A' : '#FFC14D')
      : (Math.random() > 0.5 ? '#FF8A33' : '#FFB347'),
    alphaScale: isHotspot ? randomRange(0.92, 1) : randomRange(0.5, 0.62),
    isHotspot,
    trail: [],
    trailBudget: Math.round(isHotspot ? randomRange(18, 24) : randomRange(12, 16)),
    wobbleAmplitude: randomRange(WOBBLE_MIN, WOBBLE_MAX),
    wobbleFrequency: randomRange(0.5, 1),
    wobblePhase: randomRange(0, Math.PI * 2),
  };
};

const getHotSpotTheta = (
  mousePos: { x: number; y: number },
  width: number,
  height: number,
) => {
  if (mousePos.x === -1 || mousePos.y === -1) {
    return null;
  }

  const centerX = width / 2;
  const centerY = height + SUN_CENTER_OFFSET_Y;
  const dx = mousePos.x - centerX;
  const dy = mousePos.y - centerY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const theta = normalizeTheta(Math.atan2(dy, dx));

  if (!isVisibleArcTheta(theta)) {
    return null;
  }

  if (Math.abs(dist - SUN_RADIUS) > ACTIVATION_BAND) {
    return null;
  }

  return theta;
};

const CoronalRainCanvas: React.FC<CoronalRainCanvasProps> = ({ mousePos }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const mousePosRef = useRef(mousePos);
  const lastTimestampRef = useRef(0);
  const emissionCarryRef = useRef(0);

  useEffect(() => {
    mousePosRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particlesRef.current = [];
      emissionCarryRef.current = 0;
      lastTimestampRef.current = 0;
    };

    const animate = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      if (lastTimestampRef.current === 0) {
        lastTimestampRef.current = timestamp;
      }

      const deltaSeconds = Math.min(
        (timestamp - lastTimestampRef.current) / 1000,
        0.05,
      );
      lastTimestampRef.current = timestamp;

      const { width, height } = canvas;
      const hotSpotTheta = getHotSpotTheta(mousePosRef.current, width, height);
      const emissionRate =
        AMBIENT_EMISSION_RATE +
        (hotSpotTheta === null ? 0 : HOTSPOT_EXTRA_EMISSION_RATE);
      const activeCap =
        hotSpotTheta === null ? AMBIENT_VISIBLE_CAP : MAX_ACTIVE_PARTICLES;

      emissionCarryRef.current = Math.min(
        emissionCarryRef.current + deltaSeconds * emissionRate,
        2.5,
      );
      while (
        emissionCarryRef.current >= 1 &&
        particlesRef.current.length < activeCap
      ) {
        particlesRef.current.push(createParticle(hotSpotTheta));
        emissionCarryRef.current -= 1;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const nextParticles: Particle[] = [];

      for (const particle of particlesRef.current) {
        particle.progress += deltaSeconds / particle.duration;
        if (particle.progress >= 1) {
          continue;
        }

        const easedProgress = easeInOutSine(particle.progress);
        const baseTheta =
          particle.thetaStart +
          (particle.thetaEnd - particle.thetaStart) * easedProgress;
        const currentTheta = clamp(
          baseTheta +
            Math.sin(
              particle.progress * Math.PI * 2 * particle.thetaDriftFrequency +
                particle.thetaDriftPhase,
            ) * particle.thetaDriftAmplitude,
          ARC_START,
          ARC_END,
        );
        const basePos = getPosOnArc(currentTheta, width, height);
        const arcOffset = Math.sin(Math.PI * easedProgress) * particle.apexHeight;
        const radialX = Math.cos(currentTheta);
        const radialY = Math.sin(currentTheta);
        const tangentX = -Math.sin(currentTheta);
        const tangentY = Math.cos(currentTheta);
        const wobble =
          Math.sin(
            particle.progress * Math.PI * 2 * particle.wobbleFrequency +
              particle.wobblePhase,
          ) * particle.wobbleAmplitude;

        const x = basePos.x + radialX * arcOffset + tangentX * wobble;
        const y = basePos.y + radialY * arcOffset + tangentY * wobble;

        particle.trail.push({ x, y });
        if (particle.trail.length > particle.trailBudget) {
          particle.trail.shift();
        }

        const alpha = Math.sin(Math.PI * particle.progress) * particle.alphaScale;

        if (particle.trail.length > 1 && alpha > 0.02) {
          ctx.beginPath();
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.lineWidth;
          ctx.globalAlpha = alpha;
          ctx.moveTo(particle.trail[0].x, particle.trail[0].y);

          for (let i = 1; i < particle.trail.length; i += 1) {
            ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
          }

          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        nextParticles.push(particle);
      }

      particlesRef.current = nextParticles;
      requestRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(requestRef.current);
      particlesRef.current = [];
      emissionCarryRef.current = 0;
      lastTimestampRef.current = 0;
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none" />;
};

export default CoronalRainCanvas;
