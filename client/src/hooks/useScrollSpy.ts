import { useEffect, useRef, useState } from 'react';
import { INTERSECTION_OBSERVER_CONFIG } from '../components/MainLayout/MainLayout.types';

// Constants for scroll spy behavior
const DEBOUNCE_DELAY = 100;
const INTERSECTION_THRESHOLD = 0.5; // 섹션이 50% 이상 보일 때 활성화
const THRESHOLD_STEPS = [0, 0.25, 0.5, 0.75, 1.0];

interface UseScrollSpyProps {
  /** IDs of sections to observe */
  sectionIds: string[];
  /** Callback when active section changes */
  onActiveChange?: (sectionId: string) => void;
}

interface UseScrollSpyReturn {
  /** Refs object for sections */
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>;
  /** Currently visible sections */
  visibleSections: Set<string>;
  /** Currently active section */
  activeSection: string;
}

/**
 * Custom hook for implementing scroll spy functionality
 * 
 * Tracks the visibility of sections and updates the active section
 * based on scroll position using Intersection Observer API.
 */
export const useScrollSpy = ({
  sectionIds,
  onActiveChange,
}: UseScrollSpyProps): UseScrollSpyReturn => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const intersectionRatios = useRef<{ [key: string]: number }>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Initialize intersection ratios
  useEffect(() => {
    sectionIds.forEach(id => {
      intersectionRatios.current[id] = 0;
    });
  }, [sectionIds]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Process all entries first
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (!sectionId) return;

          // Update intersection ratio
          intersectionRatios.current[sectionId] = entry.intersectionRatio;

          setVisibleSections((prev) => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(sectionId);
            } else {
              newSet.delete(sectionId);
              intersectionRatios.current[sectionId] = 0;
            }
            return newSet;
          });
        });

        // Debounce the active section update
        timeoutRef.current = setTimeout(() => {
          let maxRatio = INTERSECTION_THRESHOLD;
          let mostVisibleSection = '';

          // Find section with highest intersection ratio above threshold
          Object.entries(intersectionRatios.current).forEach(([id, ratio]) => {
            if (ratio >= INTERSECTION_THRESHOLD && ratio > maxRatio) {
              maxRatio = ratio;
              mostVisibleSection = id;
            }
          });

          // Update active section if we found a section with sufficient visibility
          if (mostVisibleSection && mostVisibleSection !== activeSection) {
            setActiveSection(mostVisibleSection);
            onActiveChange?.(mostVisibleSection);
          }
        }, DEBOUNCE_DELAY);
      },
      {
        threshold: THRESHOLD_STEPS,
        rootMargin: '-64px 0px 0px 0px', // 헤더 높이만큼 상단 여백 추가
      }
    );

    // Start observing all sections
    sectionIds.forEach((id) => {
      if (sectionRefs.current[id]) {
        observer.observe(sectionRefs.current[id]!);
      }
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      intersectionRatios.current = {};
    };
  }, [sectionIds, onActiveChange, activeSection]);

  return {
    sectionRefs,
    visibleSections,
    activeSection,
  };
};

export default useScrollSpy; 