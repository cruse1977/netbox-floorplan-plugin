/**
 * Display Options Component
 * Controls visibility of status, role, and tenant on advanced racks/devices
 */

import React from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';

export const DisplayOptions: React.FC = () => {
  const { showStatus, showRole, showTenant, setDisplayOptions } = useFloorplanStore();

  const handleToggle = (field: 'status' | 'role' | 'tenant', checked: boolean) => {
    // Update store (affects new objects)
    if (field === 'status') setDisplayOptions({ showStatus: checked });
    if (field === 'role') setDisplayOptions({ showRole: checked });
    if (field === 'tenant') setDisplayOptions({ showTenant: checked });
  };

  return (
    <div className="mb-3">
      <div className="mb-1">
        <label className="form-label">Rack/Device Display Options</label>
        <small className="form-text text-muted d-block">
          Controls which labels are shown on advanced racks/devices
        </small>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="show_status"
          checked={showStatus}
          onChange={(e) => handleToggle('status', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="show_status">
          Status
        </label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="show_role"
          checked={showRole}
          onChange={(e) => handleToggle('role', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="show_role">
          Role
        </label>
      </div>

      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="show_tenant"
          checked={showTenant}
          onChange={(e) => handleToggle('tenant', e.target.checked)}
        />
        <label className="form-check-label" htmlFor="show_tenant">
          Tenant
        </label>
      </div>
    </div>
  );
};
