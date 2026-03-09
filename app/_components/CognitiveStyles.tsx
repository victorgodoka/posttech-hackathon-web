'use client';

import { useEffect } from 'react';
import { useCognitive } from './CognitiveProvider';

export function CognitiveStyles() {
  const { preferences } = useCognitive();

  useEffect(() => {
    if (!preferences) return;

    const root = document.documentElement;

    // Font Size
    const fontSizes = {
      small: '15px',
      medium: '17px',
      large: '19px',
    };
    root.style.setProperty('--base-font-size', fontSizes[preferences.textSize]);

    // Visual Complexity
    root.classList.remove('visual-minimal', 'visual-balanced', 'visual-informative');
    root.classList.add(`visual-${preferences.visualComplexity}`);

    // Layout Mode
    root.classList.remove('layout-list', 'layout-complete', 'layout-custom');
    root.classList.add(`layout-${preferences.layoutMode}`);

    // Animations adaptativas baseadas em visualComplexity
    const animationDurations = {
      minimal: '100ms',
      balanced: '200ms',
      informative: '300ms',
    };
    root.style.setProperty('--animation-duration', animationDurations[preferences.visualComplexity]);

  }, [preferences]);

  return null;
}
