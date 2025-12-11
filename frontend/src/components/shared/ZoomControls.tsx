/**
 * Zoom Controls Component
 * Zoom slider and reset button
 */

import React, { useEffect, useState } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';

interface ZoomControlsProps {
  onResetZoom?: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({ onResetZoom }) => {
  const { canvas, zoom, setZoom } = useFloorplanStore();
  const [localZoom, setLocalZoom] = useState(1);

  // Sync local zoom with store
  useEffect(() => {
    setLocalZoom(zoom);
  }, [zoom]);

  const handleZoomChange = (value: number) => {
    setLocalZoom(value);
    setZoom(value);
    if (canvas) {
      canvas.scale({ x: value, y: value });
    }
  };

  const handleResetZoom = () => {
    if (onResetZoom) {
      onResetZoom();
    }
  };

  return (
    <div className="mb-3">
      <div className="mb-1">
        <label className="form-label">View & Zoom</label>
      </div>

      {/* Zoom Slider */}
      <div className="mb-2">
        <label htmlFor="zoom-slider" className="form-label small">
          Zoom: {(localZoom * 100).toFixed(0)}%
        </label>
        <input
          type="range"
          className="form-range"
          id="zoom-slider"
          min="0.1"
          max="2"
          step="0.01"
          value={localZoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
        />
      </div>

      {/* Zoom Buttons */}
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm w-100"
          onClick={handleResetZoom}
          title="Reset zoom to 100% and center canvas"
        >
          <i className="mdi mdi-fit-to-page"></i> Reset Zoom
        </button>
      </div>
    </div>
  );
};
