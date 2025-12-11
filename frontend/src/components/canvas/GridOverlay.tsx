/**
 * Grid Overlay Component
 * Displays a grid with physical dimensions for visual reference
 */

import React, { useEffect, useState } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { ScalingService } from '@/services/scaling';
import { DEFAULT_GRID_SIZE } from '@/constants/scaling';

interface GridOverlayProps {
  canvasWidth: number;
  canvasHeight: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ canvasWidth, canvasHeight }) => {
  const { measurementUnit, scaleFactor, zoom } = useFloorplanStore();
  const [gridSize, setGridSize] = useState(0);

  useEffect(() => {
    if (!measurementUnit) return;

    // Get default grid size for unit (1m or 5ft)
    const physicalGridSize =
      measurementUnit === 'm' || measurementUnit === 'cm'
        ? DEFAULT_GRID_SIZE.m
        : DEFAULT_GRID_SIZE.ft;

    // Convert to canvas pixels
    const canvasGridSize = ScalingService.getGridSize(
      physicalGridSize,
      measurementUnit,
      scaleFactor
    );

    setGridSize(canvasGridSize * zoom);
  }, [measurementUnit, scaleFactor, zoom]);

  // Always render the SVG container, hide with CSS if grid too small
  const shouldShow = gridSize && gridSize >= 5;

  return (
    <svg
      className="grid-overlay"
      style={{
        position: 'absolute',
        top: 30,
        left: 30,
        width: canvasWidth,
        height: canvasHeight,
        pointerEvents: 'none',
        zIndex: 1,
        display: shouldShow ? 'block' : 'none', // Hide with CSS instead of not rendering
      }}
    >
      {shouldShow && (
        <>
          <defs>
            <pattern
              id="grid-pattern"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="rgba(0, 0, 0, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </>
      )}
    </svg>
  );
};
