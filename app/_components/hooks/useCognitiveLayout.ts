'use client';

import { useCognitive } from '../CognitiveProvider';
import { LayoutMode, VisualComplexity, InformationDensity } from '@/app/_domain/entities/UserPreferences';

export type ColumnId = 'active' | 'paused' | 'done';

export interface CognitiveLayoutConfig {
  // Controle estrutural
  visibleColumns: ColumnId[];
  isFullScreen: boolean;
  showNavigation: boolean;
  
  // Controle de densidade informacional
  showTimer: boolean;
  showSteps: boolean;
  showMetadata: boolean;
  showStepDetails: boolean;
  
  // Controle de ações
  maxActions: number;
  showSecondaryActions: boolean;
  
  // Controle visual
  reduceVisualNoise: boolean;
  simplifyCards: boolean;
}

function getVisibleColumns(mode: LayoutMode): ColumnId[] {
  switch (mode) {
    case 'list':
      return ['active'];
    case 'complete':
      return ['active', 'paused', 'done'];
    case 'custom':
      return ['active']; // Custom columns handled separately
    default:
      return ['active', 'paused', 'done'];
  }
}

function getDensityConfig(density: InformationDensity) {
  switch (density) {
    case 'essential':
      return {
        showTimer: false,
        showSteps: false,
        showMetadata: false,
        showStepDetails: false,
      };
    case 'complete':
      return {
        showTimer: true,
        showSteps: true,
        showMetadata: true,
        showStepDetails: true,
      };
    default:
      return {
        showTimer: true,
        showSteps: true,
        showMetadata: true,
        showStepDetails: true,
      };
  }
}

function getActionsConfig(complexity: VisualComplexity) {
  switch (complexity) {
    case 'minimal':
      return {
        maxActions: 1,
        showSecondaryActions: false,
      };
    case 'balanced':
      return {
        maxActions: 3,
        showSecondaryActions: true,
      };
    case 'informative':
      return {
        maxActions: 5,
        showSecondaryActions: true,
      };
    default:
      return {
        maxActions: 3,
        showSecondaryActions: true,
      };
  }
}

function getVisualConfig(complexity: VisualComplexity) {
  switch (complexity) {
    case 'minimal':
      return {
        reduceVisualNoise: true,
        simplifyCards: true,
      };
    case 'balanced':
      return {
        reduceVisualNoise: false,
        simplifyCards: false,
      };
    case 'informative':
      return {
        reduceVisualNoise: false,
        simplifyCards: false,
      };
    default:
      return {
        reduceVisualNoise: false,
        simplifyCards: false,
      };
  }
}

export function useCognitiveLayout(): CognitiveLayoutConfig {
  const { preferences } = useCognitive();

  if (!preferences) {
    return {
      visibleColumns: ['active', 'paused', 'done'],
      isFullScreen: false,
      showNavigation: true,
      showTimer: true,
      showSteps: true,
      showMetadata: false,
      showStepDetails: false,
      maxActions: 3,
      showSecondaryActions: true,
      reduceVisualNoise: false,
      simplifyCards: false,
    };
  }

  const visibleColumns = getVisibleColumns(preferences.layoutMode);
  const densityConfig = getDensityConfig(preferences.informationDensity);
  const actionsConfig = getActionsConfig(preferences.visualComplexity);
  const visualConfig = getVisualConfig(preferences.visualComplexity);

  return {
    visibleColumns,
    isFullScreen: preferences.layoutMode === 'list',
    showNavigation: true,
    ...densityConfig,
    ...actionsConfig,
    ...visualConfig,
  };
}
