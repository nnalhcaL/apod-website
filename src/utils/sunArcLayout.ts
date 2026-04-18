export interface SunArcLayout {
  bottomOffset: number;
  centerOffsetY: number;
  diameter: number;
  radius: number;
}

export const getSunArcLayout = (viewportWidth: number): SunArcLayout => {
  if (viewportWidth >= 1280) {
    return {
      bottomOffset: -670,
      centerOffsetY: 240,
      diameter: 860,
      radius: 430,
    };
  }

  if (viewportWidth >= 1024) {
    return {
      bottomOffset: -630,
      centerOffsetY: 220,
      diameter: 820,
      radius: 410,
    };
  }

  if (viewportWidth >= 640) {
    return {
      bottomOffset: -570,
      centerOffsetY: 180,
      diameter: 780,
      radius: 390,
    };
  }

  return {
    bottomOffset: -520,
    centerOffsetY: 160,
    diameter: 720,
    radius: 360,
  };
};
