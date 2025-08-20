import { useState, useCallback, useEffect, useRef } from 'react';
import { CAROUSEL_AUTO_PLAY_INTERVAL, ANIMATION_DURATION_STANDARD } from '../../../constants/animations';

export interface UseCarouselSlideResult {
  currentIndex: number;
  direction: number;
  isAnimating: boolean;
  handleNext: () => void;
  handlePrev: () => void;
  goToSlide: (index: number) => void;
}

export interface UseCarouselSlideOptions {
  totalItems: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  animationDuration?: number;
}

/**
 * Carousel slide management hook
 * Following @frontend.mdc guidelines: Abstract complex logic into dedicated components/hooks
 */
export const useCarouselSlide = ({
  totalItems,
  autoPlay = true,
  autoPlayInterval = CAROUSEL_AUTO_PLAY_INTERVAL,
  animationDuration = ANIMATION_DURATION_STANDARD,
}: UseCarouselSlideOptions): UseCarouselSlideResult => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear animation state after duration
  const clearAnimationState = useCallback(() => {
    const timeoutId = setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration * 1000);

    return () => clearTimeout(timeoutId);
  }, [animationDuration]);

  // Navigate to next slide
  const handleNext = useCallback(() => {
    if (isAnimating || totalItems <= 1) return;
    
    setDirection(1);
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
    clearAnimationState();
  }, [totalItems, isAnimating, clearAnimationState]);

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    if (isAnimating || totalItems <= 1) return;
    
    setDirection(-1);
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
    clearAnimationState();
  }, [totalItems, isAnimating, clearAnimationState]);

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex || index < 0 || index >= totalItems) return;
    
    setDirection(index > currentIndex ? 1 : -1);
    setIsAnimating(true);
    setCurrentIndex(index);
    clearAnimationState();
  }, [currentIndex, isAnimating, totalItems, clearAnimationState]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalItems <= 1) return;

    // Clear existing timer
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
    }

    // Set new timer
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    // Cleanup on unmount or dependency change
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [autoPlay, totalItems, autoPlayInterval, handleNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, []);

  return {
    currentIndex,
    direction,
    isAnimating,
    handleNext,
    handlePrev,
    goToSlide,
  };
}; 