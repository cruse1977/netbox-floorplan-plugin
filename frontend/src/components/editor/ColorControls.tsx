/**
 * Color Controls Component
 * Controls for object and text colors
 */

import React, { useState } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';

export const ColorControls: React.FC = () => {
  const { objectColor, textColor, setObjectColor, setTextColor } = useFloorplanStore();
  const [localObjectColor, setLocalObjectColor] = useState(objectColor);
  const [localTextColor, setLocalTextColor] = useState(textColor);

  const handleObjectColorChange = (color: string) => {
    setLocalObjectColor(color);
    setObjectColor(color);
  };

  const handleTextColorChange = (color: string) => {
    setLocalTextColor(color);
    setTextColor(color);
  };

  return (
    <>
      {/* Object Color */}
      <div className="mb-3">
        <label htmlFor="selected_color" className="form-label">Set Object Color</label>
        <div className="input-group">
          <input
            type="color"
            className="form-control form-control-color"
            id="selected_color"
            value={localObjectColor}
            onChange={(e) => handleObjectColorChange(e.target.value)}
            title="Choose object color for new objects"
          />
          <span className="input-group-text">{localObjectColor}</span>
        </div>
        <small className="form-text text-muted">
          Sets color for new objects (racks, devices, walls, areas)
        </small>
      </div>

      {/* Text Color */}
      <div className="mb-3">
        <label htmlFor="selected_text_color" className="form-label">Set Text Color</label>
        <div className="input-group">
          <input
            type="color"
            className="form-control form-control-color"
            id="selected_text_color"
            value={localTextColor}
            onChange={(e) => handleTextColorChange(e.target.value)}
            title="Choose text color for new labels"
          />
          <span className="input-group-text">{localTextColor}</span>
        </div>
        <small className="form-text text-muted">
          Sets color for new labels
        </small>
      </div>
    </>
  );
};
