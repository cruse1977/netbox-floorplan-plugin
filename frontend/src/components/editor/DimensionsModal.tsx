/**
 * Dimensions Modal Component
 * Modal for setting floorplan physical dimensions and scale
 */

import React, { useState, useEffect } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { KonvaCanvasService } from '@/services/canvasKonva';
import { SCALE_FACTORS } from '@/constants/scaling';
import type { MeasurementUnit } from '@/types/canvas';

interface DimensionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const DimensionsModal: React.FC<DimensionsModalProps> = ({ isOpen, onClose, onSave }) => {
  const { floorplanId, width, height, measurementUnit, scaleFactor, setDimensions, setScaleFactor } = useFloorplanStore();

  const [localWidth, setLocalWidth] = useState(width || 50);
  const [localHeight, setLocalHeight] = useState(height || 50);
  const [localUnit, setLocalUnit] = useState<MeasurementUnit>(measurementUnit || 'ft');
  const [localScale, setLocalScale] = useState(scaleFactor);

  // Update local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalWidth(width || 50);
      setLocalHeight(height || 50);
      setLocalUnit(measurementUnit || 'ft');
      setLocalScale(scaleFactor);
    }
  }, [isOpen, width, height, measurementUnit, scaleFactor]);

  const handleSave = async () => {
    if (!floorplanId) {
      alert('Error: Floorplan ID not found. The floorplan must be saved before setting dimensions.');
      return;
    }

    // Update dimensions in store only - don't save to API yet
    setDimensions(localWidth, localHeight, localUnit);
    setScaleFactor(localScale);

    // Update canvas boundary
    KonvaCanvasService.setFloorplanBoundary(
      localWidth,
      localHeight,
      localUnit,
      localScale
    );

    // Mark as unsaved
    if (onSave) {
      onSave();
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: 'block', zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Set Floorplan Dimensions</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="alert alert-info">
                <strong>Tip:</strong> Set the real-world dimensions of your floorplan area.
                The scale factor determines how these dimensions are displayed on the canvas.
              </div>

              {/* Width */}
              <div className="mb-3">
                <label htmlFor="dimension-width" className="form-label">
                  Width
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="dimension-width"
                  value={localWidth}
                  onChange={(e) => setLocalWidth(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                />
              </div>

              {/* Height */}
              <div className="mb-3">
                <label htmlFor="dimension-height" className="form-label">
                  Height
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="dimension-height"
                  value={localHeight}
                  onChange={(e) => setLocalHeight(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                />
              </div>

              {/* Unit */}
              <div className="mb-3">
                <label htmlFor="dimension-unit" className="form-label">
                  Measurement Unit
                </label>
                <select
                  className="form-select"
                  id="dimension-unit"
                  value={localUnit}
                  onChange={(e) => setLocalUnit(e.target.value as MeasurementUnit)}
                >
                  <option value="ft">Feet (ft)</option>
                  <option value="m">Meters (m)</option>
                  <option value="in">Inches (in)</option>
                  <option value="cm">Centimeters (cm)</option>
                </select>
              </div>

              {/* Scale Factor */}
              <div className="mb-3">
                <label htmlFor="dimension-scale" className="form-label">
                  Scale Factor
                </label>
                <select
                  className="form-select"
                  id="dimension-scale"
                  value={localScale}
                  onChange={(e) => setLocalScale(parseInt(e.target.value))}
                >
                  {SCALE_FACTORS.map((factor) => (
                    <option key={factor} value={factor}>
                      1:{factor}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  Scale factor determines canvas size. Lower = larger canvas.
                  Common: 1:100 (1 meter = 1 pixel at base scale)
                </small>
              </div>

              {/* Preview */}
              <div className="alert alert-secondary">
                <strong>Preview:</strong><br />
                Real-world: {localWidth} × {localHeight} {localUnit}<br />
                Scale: 1:{localScale}
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
