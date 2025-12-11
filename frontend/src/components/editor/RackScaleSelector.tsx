/**
 * Rack Scale Selector Component
 * Allows separate scale factor for racks independent of floorplan scale
 */

import React from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { SCALE_FACTORS } from '@/constants/scaling';

export const RackScaleSelector: React.FC = () => {
  const { rackScaleFactor, setRackScaleFactor } = useFloorplanStore();

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScale = parseInt(e.target.value, 10);
    setRackScaleFactor(newScale);
  };

  return (
    <div className="mb-3">
      <label htmlFor="rack-scale-selector" className="form-label">
        Rack Scale Factor
      </label>
      <select
        id="rack-scale-selector"
        className="form-select"
        value={rackScaleFactor}
        onChange={handleScaleChange}
      >
        {SCALE_FACTORS.map((factor) => (
          <option key={factor} value={factor}>
            1:{factor}
          </option>
        ))}
      </select>
      <small className="form-text text-muted">
        Controls the size of racks independently from the floorplan scale
      </small>
    </div>
  );
};
