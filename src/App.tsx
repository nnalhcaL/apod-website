import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import CoronalRainCanvas from './components/CoronalRainCanvas';
import FloatingOrbs from './components/FloatingOrbs';
import StarField from './components/StarField';
import { REPORT_ORBS } from './content/reportOrbs';
import { OrbData } from './types';
import { getSunArcLayout } from './utils/sunArcLayout';

const DEFAULT_VOLUME = 0.5;
const BACKGROUND_AUDIO_SRC = new URL('../spaceMusic.mp3', import.meta.url).href;

function renderFigureBlock(selectedOrb: OrbData) {
  if (!selectedOrb.figure) {
    return null;
  }

  const { figure } = selectedOrb;

  return (
    <figure className="overflow-hidden rounded-[10px] bg-black/35">
      <div className="relative aspect-[16/9] overflow-hidden bg-black/45">
        <p className="absolute top-4 left-4 z-10 rounded-[6px] bg-black/65 px-2.5 py-1 font-sans text-[11px] uppercase tracking-[0.18em] text-accent-orange/80">
          {figure.label}
        </p>

        {figure.videoSrc ? (
          <video
            key={figure.videoSrc}
            className="h-full w-full bg-black object-contain"
            autoPlay
            controls
            muted
            playsInline
            preload="metadata"
            src={figure.videoSrc}
          />
        ) : figure.imageSrc ? (
          <img
            className="h-full w-full bg-black object-contain"
            src={figure.imageSrc}
            alt={figure.caption}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="mt-8 font-sans text-sm text-white/70">
              {figure.placeholder}
            </p>
          </div>
        )}
      </div>
      <figcaption className="px-5 py-4 font-sans text-[12px] leading-6 text-white/65">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });
  const [selectedOrb, setSelectedOrb] = useState<OrbData | null>(null);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === 'undefined' ? 1440 : window.innerWidth,
  );
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const sunArcLayout = getSunArcLayout(viewportWidth);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = DEFAULT_VOLUME;

    let cancelled = false;

    const attemptAutoplay = async () => {
      try {
        await audio.play();
        if (cancelled) {
          audio.pause();
          return;
        }
        setAutoplayBlocked(false);
      } catch {
        if (!cancelled) {
          setAutoplayBlocked(true);
          setIsPlaying(false);
        }
      }
    };

    void attemptAutoplay();

    return () => {
      cancelled = true;
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (!autoplayBlocked || isPlaying) {
      return;
    }

    const audio = audioRef.current;
    if (!audio || audioError) {
      return;
    }

    let active = true;

    const unlockAutoplay = async () => {
      if (!active) {
        return;
      }

      try {
        await audio.play();
        if (!active) {
          audio.pause();
          return;
        }
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    };

    const handleFirstInteraction = () => {
      void unlockAutoplay();
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      active = false;
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioError, autoplayBlocked, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const modalBody = modalBodyRef.current;
    if (!modalBody || !selectedOrb) {
      return;
    }

    modalBody.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [selectedOrb]);

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || audioError) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const navigateOrb = (direction: -1 | 1) => {
    if (!selectedOrb) {
      return;
    }

    const currentIndex = REPORT_ORBS.findIndex((orb) => orb.id === selectedOrb.id);
    if (currentIndex === -1) {
      return;
    }

    const nextIndex = (currentIndex + direction + REPORT_ORBS.length) % REPORT_ORBS.length;
    setSelectedOrb(REPORT_ORBS[nextIndex]);
  };

  const selectedOrbIndex = selectedOrb
    ? REPORT_ORBS.findIndex((orb) => orb.id === selectedOrb.id)
    : -1;
  const previousOrb =
    selectedOrbIndex === -1
      ? null
      : REPORT_ORBS[(selectedOrbIndex - 1 + REPORT_ORBS.length) % REPORT_ORBS.length];
  const nextOrb =
    selectedOrbIndex === -1
      ? null
      : REPORT_ORBS[(selectedOrbIndex + 1) % REPORT_ORBS.length];

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = nextVolume;
    }
  };

  const AudioIcon = volume === 0 ? VolumeX : Volume2;
  const playbackLabel = audioError
    ? 'Background audio unavailable'
    : autoplayBlocked && !isPlaying
      ? 'Autoplay was blocked. Press to start background music'
      : isPlaying
        ? 'Pause background music'
        : 'Play background music';

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black selection:bg-accent-orange/30">
      <audio
        ref={audioRef}
        className="hidden"
        autoPlay
        src={BACKGROUND_AUDIO_SRC}
        loop
        playsInline
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setAudioError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setAudioError(true);
          setAutoplayBlocked(false);
          setIsPlaying(false);
        }}
      />

      {/* Background Layers */}
      <StarField mousePos={mousePos} />
      <CoronalRainCanvas mousePos={mousePos} />

      <div className="fixed top-4 right-4 z-[45] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[10px] border border-accent-orange/30 bg-black/65 px-3 py-2 text-white shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:top-5 sm:right-5 lg:top-4 lg:right-4 lg:gap-2 lg:px-2.5 lg:py-1.5">
        <button
          type="button"
          onClick={() => void handleTogglePlayback()}
          disabled={audioError}
          aria-label={playbackLabel}
          title={playbackLabel}
          className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/12 bg-white/5 text-white transition-colors hover:border-accent-orange/50 hover:text-accent-orange disabled:cursor-not-allowed disabled:border-white/8 disabled:text-white/30 lg:h-8 lg:w-8"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-[1px]" />}
        </button>

        <div className="flex items-center gap-2">
          <AudioIcon size={16} className="shrink-0 text-white/70" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={audioError}
            aria-label="Background music volume"
            className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-white/15 accent-accent-orange disabled:cursor-not-allowed disabled:opacity-40 sm:w-32 lg:h-1 lg:w-28"
          />
          <span className="w-10 text-right font-sans text-[11px] tracking-[0.08em] text-white/65 lg:text-[10px]">
            {audioError ? '--' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-30 flex flex-col items-center pt-[42vh] pointer-events-none lg:pt-[44vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-glow font-display text-[72px] leading-none font-medium tracking-[-1.5px] text-white uppercase sm:text-[88px] lg:text-[96px] xl:text-[100px] 2xl:text-[104px]">
            Coronal Rain
          </h1>
          <p className="mt-[10px] font-sans text-[15px] font-light tracking-[0.1em] text-[#CCCCCC] uppercase sm:text-[17px] lg:text-[16px] xl:text-[17px]">
            A phenomenon of the Sun's outer atmosphere.
          </p>
        </motion.div>
      </div>

      {/* Floating Interactive Orbs */}
      <FloatingOrbs mousePos={mousePos} onOrbClick={setSelectedOrb} />

      {/* Sun Arc */}
      <div
        className="fixed left-1/2 z-20 -translate-x-1/2 pointer-events-none"
        style={{ bottom: `${sunArcLayout.bottomOffset}px` }}
      >
        <div
          className="relative rounded-full"
          style={{
            height: `${sunArcLayout.diameter}px`,
            background: 'radial-gradient(circle, #FFE5A0 0%, #FFA726 30%, #E65100 60%, rgba(230, 81, 0, 0.3) 80%, transparent 100%)',
            boxShadow: '0 0 150px rgba(255, 140, 40, 0.5)',
            width: `${sunArcLayout.diameter}px`,
          }}
        >
          {/* Plasma Flare Tendrils */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 left-1/2 origin-bottom"
              style={{
                width: 2,
                height: 100 + Math.random() * 150,
                background: 'linear-gradient(to top, #E65100, #FFB74D, transparent)',
                left: `${50 + (Math.random() * 40 - 20)}%`,
                top: `${Math.random() * 10}%`,
                filter: 'blur(4px)',
                opacity: 0.6,
              }}
              animate={{
                rotate: [Math.random() * 20 - 10, Math.random() * 20 - 10],
                scaleY: [1, 1.2, 1],
                skewX: [0, 10, -10, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrb && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrb(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-modal relative z-10 h-[93vh] w-[calc(100vw-0.75rem)] overflow-hidden sm:h-[91vh] sm:w-[min(96vw,1320px)] lg:h-[88vh] lg:w-[min(92vw,1180px)] xl:w-[min(90vw,1240px)]"
            >
              <div className="flex h-full min-h-0">
                <div className="flex w-12 shrink-0 items-center justify-center bg-black/20 sm:w-14 lg:w-[52px]">
                  <button
                    type="button"
                    onClick={() => navigateOrb(-1)}
                    aria-label={previousOrb ? `Go to previous module: ${previousOrb.modalTitle}` : 'Go to previous module'}
                    title={previousOrb ? `Previous: ${previousOrb.modalTitle}` : 'Previous module'}
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-accent-orange/35 bg-black/70 text-accent-orange transition-colors hover:bg-accent-orange hover:text-black sm:h-9 sm:w-9 lg:h-8 lg:w-8"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="shrink-0 px-6 pt-6 pb-5 sm:px-7 sm:pt-7 sm:pb-5 lg:px-7 lg:pt-7 lg:pb-5">
                    <h2 className="font-display text-[23px] font-semibold leading-tight text-white sm:text-[25px] lg:text-[24px] xl:text-[25px]">
                      {selectedOrb.id}. {selectedOrb.modalTitle}
                    </h2>
                    <div className="mt-4 h-1 w-10 bg-accent-orange lg:mt-3.5" />
                  </div>

                  <div ref={modalBodyRef} className="flex-1 overflow-y-auto px-6 py-6 sm:px-7 sm:py-6 lg:px-7 lg:py-6">
                    <div className="space-y-5">
                      {selectedOrb.figure && selectedOrb.figure.insertAfterParagraph === undefined && renderFigureBlock(selectedOrb)}

                      {selectedOrb.paragraphs.map((paragraph, index) => (
                        <div key={`${selectedOrb.id}-${index}`} className="space-y-5">
                          <p className="font-sans text-[15px] leading-8 text-[#DDDDDD] sm:text-[16px] lg:text-[15px] lg:leading-7">
                            {paragraph}
                          </p>

                          {selectedOrb.figure?.insertAfterParagraph === index && renderFigureBlock(selectedOrb)}
                        </div>
                      ))}

                      {selectedOrb.sourceNote && (
                        <p className="pt-4 font-sans text-[14px] leading-7 text-white/60 sm:text-[15px] lg:text-[14px] lg:leading-6">
                          {selectedOrb.sourceNote}
                        </p>
                      )}

                      {selectedOrb.references && (
                        <div className="pt-5">
                          <h3 className="font-sans text-[11px] uppercase tracking-[0.18em] text-accent-orange/75">
                            Reference List
                          </h3>
                          <div className="mt-4 space-y-3">
                            {selectedOrb.references.map((reference, index) => (
                              <p
                                key={`${selectedOrb.id}-reference-${index}`}
                                className="font-sans text-[14px] leading-7 text-[#D7D7D7] sm:text-[15px] lg:text-[14px] lg:leading-6"
                              >
                                {reference}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setSelectedOrb(null)}
                        className="rounded-[8px] border border-accent-orange/30 px-5 py-2 text-xs font-medium tracking-[0.14em] text-accent-orange transition-colors hover:bg-accent-orange hover:text-black"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex w-12 shrink-0 flex-col items-center bg-black/20 px-1 py-4 sm:w-14 sm:px-1.5 sm:py-4 lg:w-[52px] lg:px-1 lg:py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrb(null)}
                    aria-label="Close module"
                    title="Close module"
                    className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-accent-orange/35 bg-black/70 text-white/65 transition-colors hover:border-accent-orange hover:text-accent-orange sm:h-9 sm:w-9 lg:h-8 lg:w-8"
                  >
                    <X size={16} />
                  </button>

                  <div className="flex flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => navigateOrb(1)}
                      aria-label={nextOrb ? `Go to next module: ${nextOrb.modalTitle}` : 'Go to next module'}
                      title={nextOrb ? `Next: ${nextOrb.modalTitle}` : 'Next module'}
                      className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-accent-orange/35 bg-black/70 text-accent-orange transition-colors hover:bg-accent-orange hover:text-black sm:h-9 sm:w-9 lg:h-8 lg:w-8"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-40" />
    </div>
  );
}
