'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  /** Tong so slides */
  total: number;
  /** Tu dong chuyen slide sau interval (ms). 0 = tat auto */
  autoInterval?: number;
  /** Render noi dung slide theo index */
  renderSlide: (index: number) => React.ReactNode;
  /** Class cho wrapper */
  className?: string;
  /** Hien dots navigation */
  showDots?: boolean;
  /** Hien arrows khi hover */
  showArrows?: boolean;
  /** Vi tri dots: 'bottom' | 'bottom-right' */
  dotsPosition?: 'bottom' | 'bottom-right';
  /** Style cho arrows */
  arrowStyle?: 'circle' | 'plain';
  /** Class cho dot active */
  dotActiveClass?: string;
  /** Class cho dot inactive */
  dotInactiveClass?: string;
}

export default function Carousel({
  total,
  autoInterval = 3000,
  renderSlide,
  className = '',
  showDots = true,
  showArrows = true,
  dotsPosition = 'bottom',
  arrowStyle = 'circle',
  dotActiveClass = 'bg-white',
  dotInactiveClass = 'bg-white/40',
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Khong can carousel neu chi co 1 slide
  const shouldAutoPlay = total > 1 && autoInterval > 0;

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play: chi chay khi > 1 slide va autoInterval > 0
  useEffect(() => {
    if (!shouldAutoPlay) return;

    timerRef.current = setInterval(goNext, autoInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [shouldAutoPlay, autoInterval, goNext]);

  // Reset timer khi user click next/prev
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (shouldAutoPlay) {
      timerRef.current = setInterval(goNext, autoInterval);
    }
  }, [shouldAutoPlay, autoInterval, goNext]);

  const handleNext = () => {
    goNext();
    resetTimer();
  };

  const handlePrev = () => {
    goPrev();
    resetTimer();
  };

  const handleDotClick = (index: number) => {
    setCurrent(index);
    resetTimer();
  };

  if (total === 0) return null;

  const arrowBaseClass =
    arrowStyle === 'circle'
      ? 'w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/20 transition-all backdrop-blur-sm'
      : 'w-8 h-8 flex items-center justify-center hover:bg-black/20 rounded transition-all';

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slide content */}
      {renderSlide(current)}

      {/* Arrows — hien khi hover va co nhieu hon 1 slide */}
      {showArrows && total > 1 && (
        <div
          className={`absolute inset-0 flex items-center justify-between px-3 z-30 pointer-events-none transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Slide trước"
            className={`${arrowBaseClass} pointer-events-auto text-white cursor-pointer`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Slide tiếp"
            className={`${arrowBaseClass} pointer-events-auto text-white cursor-pointer`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Dots */}
      {showDots && total > 1 && (
        <div
          className={`absolute z-30 flex gap-2 ${
            dotsPosition === 'bottom-right'
              ? 'bottom-4 right-4'
              : 'bottom-4 left-1/2 -translate-x-1/2'
          }`}
        >
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                i === current ? dotActiveClass : dotInactiveClass
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
