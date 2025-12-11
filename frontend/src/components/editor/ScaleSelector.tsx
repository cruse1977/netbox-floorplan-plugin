/**
 * Scale Selector Component
 * Quick selector for scale factor
 */

import React from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { KonvaCanvasService } from '@/services/canvasKonva';
import { ScalingService } from '@/services/scaling';
import { SCALE_FACTORS } from '@/constants/scaling';

interface ScaleSelectorProps {
  onOpenDimensionsModal: () => void;
  onScaleChange?: () => void;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({ onOpenDimensionsModal, onScaleChange }) => {
  const { scaleFactor, setScaleFactor, width, height, measurementUnit } = useFloorplanStore();

  const handleScaleChange = (newScale: number) => {
    const oldScale = scaleFactor;

    // Scale object positions to maintain relative positioning
    KonvaCanvasService.scaleObjectPositions(oldScale, newScale);

    setScaleFactor(newScale);

    // Update canvas boundary with new scale
    if (width && height && measurementUnit) {
      KonvaCanvasService.setFloorplanBoundary(
        width,
        height,
        measurementUnit,
        newScale
      );
    }

    // Mark as unsaved
    if (onScaleChange) {
      onScaleChange();
    }
  };

  return (
    <div className="mb-3">
      <div className="mb-1">
        <label className="form-label">Scale & Dimensions</label>
        <small className="form-text text-muted d-block">
          Current scale: {ScalingService.formatScale(scaleFactor)}
        </small>
        {width && height && measurementUnit && (
          <small className="form-text text-muted d-block">
            Dimensions: {width} × {height} {measurementUnit}
          </small>
        )}
      </div>

      {/* Quick Scale Selector */}
      <div className="mb-2">
        <label htmlFor="scale-select" className="form-label small">
          Quick Scale Change
        </label>
        <select
          className="form-select form-select-sm"
          id="scale-select"
          value={scaleFactor}
          onChange={(e) => handleScaleChange(parseInt(e.target.value))}
        >
          {SCALE_FACTORS.map((factor) => (
            <option key={factor} value={factor}>
              1:{factor}
            </option>
          ))}
        </select>
      </div>

      {/* Set Dimensions Button */}
      <button
        type="button"
        className="btn btn-outline-primary btn-sm w-100"
        onClick={onOpenDimensionsModal}
      >
        <i className="mdi mdi-ruler"></i> Set Dimensions
      </button>
    </div>
  );
};
