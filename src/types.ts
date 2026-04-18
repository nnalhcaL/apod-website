export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  trail: { x: number; y: number }[];
}

export interface OrbFigure {
  label: string;
  caption: string;
  placeholder: string;
  insertAfterParagraph?: number;
  imageSrc?: string;
  videoSrc?: string;
}

export interface OrbData {
  id: number;
  orbLabel: string;
  modalTitle: string;
  paragraphs: string[];
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
  figure?: OrbFigure;
  sourceNote?: string;
  references?: string[];
}
