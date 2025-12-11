/**
 * Device Scale Selector Component
 * Allows separate scale factor for devices independent of floorplan scale
 */

import React from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { SCALE_FACTORS } from '@/constants/scaling';

export const DeviceScaleSelector: React.FC = () => {
  const { deviceScaleFactor, setDeviceScaleFactor } = useFloorplanStore();

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScale = parseInt(e.target.value, 10);
    setDeviceScaleFactor(newScale);
  };

  return (
    <div className="mb-3">
      <label htmlFor="device-scale-selector" className="form-label">
        Device Scale Factor
      </label>
      <select
        id="device-scale-selector"
        className="form-select"
        value={deviceScaleFactor}
        onChange={handleScaleChange}
      >
        {SCALE_FACTORS.map((factor) => (
          <option key={factor} value={factor}>
            1:{factor}
          </option>
        ))}
      </select>
      <small className="form-text text-muted">
        Controls the size of devices independently from the floorplan scale
      </small>
    </div>
  );
};
