/**
 * Floorplan Viewer Component
 * Read-only view of floorplan with basic zoom/pan
 */

import React, { useEffect, useState } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { KonvaCanvas } from '@/components/canvas/KonvaCanvas';

interface FloorplanViewerProps {
  initialData: {
    floorplanId: number;
  };
}

export const FloorplanViewer: React.FC<FloorplanViewerProps> = ({ initialData }) => {
  const { loadFloorplan, floorplan, isLoading, error } = useFloorplanStore();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load floorplan data
  useEffect(() => {
    if (!hasInitialized && initialData.floorplanId) {
      loadFloorplan(initialData.floorplanId);
      setHasInitialized(true);
    }
  }, [hasInitialized, initialData.floorplanId, loadFloorplan]);

  if (isLoading) {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-12 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading floorplan...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Construct edit URL from floorplan ID
  const getEditUrl = () => {
    if (!floorplan) return '#';
    return `/plugins/floorplan/floorplans/${floorplan.id}/edit/`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Floorplan View</h5>
          <div>
            {floorplan && (
              <a
                href={getEditUrl()}
                className="btn btn-primary btn-sm"
              >
                <i className="mdi mdi-pencil"></i> Edit
              </a>
            )}
          </div>
        </div>
        <div className="card-body">
          {/* Read-only Konva Canvas */}
          <KonvaCanvas
            readonly={true}
            enableZoomPan={true}
            enableKeyboard={false}
          />
        </div>
      </div>
    </div>
  );
};
