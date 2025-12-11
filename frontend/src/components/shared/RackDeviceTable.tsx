/**
 * Rack/Device Table Component
 * Replaces HTMX dynamic tables with React client-side rendering
 */

import React, { useEffect, useState } from 'react';
import type { Rack, Device } from '@/types/floorplan';

interface RackDeviceTableProps {
  floorplanId: number;
  siteId?: number | null;
  locationId?: number | null;
  type: 'rack' | 'device';
  onAddSimple: (item: Rack | Device) => void;
  onAddAdvanced: (item: Rack | Device) => void;
  excludeIds?: number[]; // IDs already on canvas
}

export const RackDeviceTable: React.FC<RackDeviceTableProps> = ({
  floorplanId,
  siteId,
  locationId,
  type,
  onAddSimple,
  onAddAdvanced,
  excludeIds = [],
}) => {
  const [items, setItems] = useState<(Rack | Device)[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Rack | Device)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  // Fetch items from API
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint = type === 'rack'
          ? `/plugins/floorplan/floorplans/racks/?floorplan_id=${floorplanId}`
          : `/plugins/floorplan/floorplans/devices/?floorplan_id=${floorplanId}`;

        // Use full URL for Django view endpoints (not API)
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}s`);
        }

        // Use siteId or locationId to fetch racks/devices
        if (!siteId && !locationId) {
          throw new Error('Either siteId or locationId is required');
        }

        // Use core NetBox API (not plugin API) - fetch directly
        const apiEndpoint = type === 'rack'
          ? `/api/dcim/racks/?${siteId ? `site_id=${siteId}` : `location_id=${locationId}`}&limit=100`
          : `/api/dcim/devices/?${siteId ? `site_id=${siteId}` : `location_id=${locationId}`}&rack_id__isnull=true&limit=100`;

        // Use fetch directly for core NetBox API (not apiClient which has plugin base URL)
        const apiResponse = await fetch(apiEndpoint);
        if (!apiResponse.ok) {
          throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`);
        }
        const data = await apiResponse.json() as { results: (Rack | Device)[] };

        // Filter out items already on canvas
        const available = data.results.filter(
          (item) => !excludeIds.includes(item.id)
        );

        setItems(available);
        setFilteredItems(available);
      } catch (err) {
        console.error(`Error fetching ${type}s:`, err);
        setError(`Failed to load ${type}s`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [floorplanId, type, excludeIds]);

  // Filter items by search text
  useEffect(() => {
    if (!filterText.trim()) {
      setFilteredItems(items);
      return;
    }

    const lowerFilter = filterText.toLowerCase();
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(lowerFilter)
    );
    setFilteredItems(filtered);
  }, [filterText, items]);

  if (isLoading) {
    return (
      <div className="text-center py-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="small text-muted mt-2">Loading {type}s...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning small mb-0" role="alert">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="alert alert-info small mb-0" role="alert">
        No available {type}s found
      </div>
    );
  }

  return (
    <div className="rack-device-table">
      {/* Filter Input */}
      <div className="mb-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={`Filter ${type}s...`}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table table-sm table-hover mb-0">
          <thead className="table-light sticky-top">
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-muted small">
                  No {type}s match filter
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="small">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      {item.name}
                    </a>
                  </td>
                  <td className="small">
                    <span className={`badge bg-${getStatusColor(item.status.value)}`}>
                      {item.status.label}
                    </span>
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onAddSimple(item)}
                        title="Add simple rack/device (name + status)"
                      >
                        Simple
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-info btn-sm"
                        onClick={() => onAddAdvanced(item)}
                        title="Add advanced rack/device (name + status + role + tenant)"
                      >
                        Advanced
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Item count */}
      <div className="small text-muted mt-2">
        Showing {filteredItems.length} of {items.length} {type}s
      </div>
    </div>
  );
};

/**
 * Get Bootstrap color class for status
 */
function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'planned':
      return 'warning';
    case 'offline':
    case 'failed':
      return 'danger';
    case 'staged':
      return 'info';
    default:
      return 'secondary';
  }
}
