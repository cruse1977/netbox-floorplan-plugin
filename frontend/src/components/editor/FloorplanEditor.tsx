/**
 * Floorplan Editor Component
 * Main editor interface with canvas and controls
 */

import React, { useEffect, useState } from 'react';
import { useFloorplanStore } from '@/store/floorplanStore';
import { KonvaCanvas } from '@/components/canvas/KonvaCanvas';
import { KonvaCanvasService } from '@/services/canvasKonva';
import { RackDeviceTable } from '@/components/shared/RackDeviceTable';
import { DisplayOptions } from '@/components/editor/DisplayOptions';
import { ColorControls } from '@/components/editor/ColorControls';
import { ZoomControls } from '@/components/shared/ZoomControls';
import { ScaleSelector } from '@/components/editor/ScaleSelector';
import { RackScaleSelector } from '@/components/editor/RackScaleSelector';
import { DeviceScaleSelector } from '@/components/editor/DeviceScaleSelector';
import { DimensionsModal } from '@/components/editor/DimensionsModal';
import { BackgroundImageModal } from '@/components/editor/BackgroundImageModal';
import { ExportDialog } from '@/components/shared/ExportDialog';
import { useExport } from '@/hooks/useExport';
import type { Rack, Device } from '@/types/floorplan';

interface FloorplanEditorProps {
  initialData: {
    floorplanId: number;
    siteId: number | null;
    locationId: number | null;
    recordType: 'site' | 'location';
  };
}

export const FloorplanEditor: React.FC<FloorplanEditorProps> = ({ initialData }) => {
  const {
    initialize,
    loadFloorplan,
    saveFloorplan,
    canvas,
    floorplan,
    canvasObjects,
    siteId,
    locationId,
    rackScaleFactor,
    deviceScaleFactor,
    objectColor,
    textColor,
    isLoading,
    isSaving,
    error,
    setZoom,
  } = useFloorplanStore();

  const [hasInitialized, setHasInitialized] = useState(false);
  const [mappedRackIds, setMappedRackIds] = useState<number[]>([]);
  const [mappedDeviceIds, setMappedDeviceIds] = useState<number[]>([]);
  const [isDimensionsModalOpen, setIsDimensionsModalOpen] = useState(false);
  const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [activeRackDeviceTab, setActiveRackDeviceTab] = useState<'rack' | 'device'>('rack');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Export hook
  const { handleExport } = useExport();

  // Initialize store with data from Django template
  useEffect(() => {
    if (!hasInitialized) {
      initialize(initialData);
      setHasInitialized(true);
    }
  }, [initialize, initialData, hasInitialized]);

  // Load floorplan data once initialized
  useEffect(() => {
    if (hasInitialized && initialData.floorplanId) {
      loadFloorplan(initialData.floorplanId);
    }
  }, [hasInitialized, initialData.floorplanId, loadFloorplan]);

  // Update mapped IDs when canvasObjects changes
  useEffect(() => {
    const rackIds = KonvaCanvasService.getMappedRackIds();
    const deviceIds = KonvaCanvasService.getMappedDeviceIds();
    setMappedRackIds(rackIds);
    setMappedDeviceIds(deviceIds);
  }, [canvasObjects]);

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleObjectDeleted = () => {
    setHasUnsavedChanges(true);
  };

  const handleObjectModified = () => {
    // Ignore if we're panning (isDragging state is true during Alt+drag pan)
    const store = useFloorplanStore.getState();
    if (store.isDragging) {
      return;
    }

    setHasUnsavedChanges(true);
  };

  const handleAddWall = () => {
    KonvaCanvasService.addWall();
    setHasUnsavedChanges(true);
  };

  const handleAddArea = () => {
    KonvaCanvasService.addArea();
    setHasUnsavedChanges(true);
  };

  const handleAddLabel = () => {
    KonvaCanvasService.addLabel('Label', textColor);
    setHasUnsavedChanges(true);
  };

  const handleAddSimpleRack = (item: Rack | Device) => {
    const rack = item as Rack;
    KonvaCanvasService.addSimpleRack(rack, rackScaleFactor, objectColor);
    setMappedRackIds([...mappedRackIds, rack.id]);
    setHasUnsavedChanges(true);
  };

  const handleAddAdvancedRack = (item: Rack | Device) => {
    const rack = item as Rack;
    KonvaCanvasService.addAdvancedRack(rack, rackScaleFactor, objectColor);
    setMappedRackIds([...mappedRackIds, rack.id]);
    setHasUnsavedChanges(true);
  };

  const handleAddSimpleDevice = (item: Rack | Device) => {
    const device = item as Device;
    KonvaCanvasService.addSimpleDevice(device, deviceScaleFactor, objectColor);
    setMappedDeviceIds([...mappedDeviceIds, device.id]);
    setHasUnsavedChanges(true);
  };

  const handleAddAdvancedDevice = (item: Rack | Device) => {
    const device = item as Device;
    KonvaCanvasService.addAdvancedDevice(device, deviceScaleFactor, objectColor);
    setMappedDeviceIds([...mappedDeviceIds, device.id]);
    setHasUnsavedChanges(true);
  };

  const handleResetZoom = () => {
    if (canvas) {
      // Reset zoom for Konva
      canvas.scale({ x: 1, y: 1 });
      canvas.position({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const handleSave = async () => {
    try {
      await saveFloorplan();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
      // Keep hasUnsavedChanges as true if save failed
    }
  };

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

  return (
    <div style={{ padding: '20px' }}>
      {/* TEMP: Test without Bootstrap grid */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Control Panel - Left Side */}
        <div style={{ flex: '0 0 400px' }}>
          <div className="card">
            <h5 className="card-header">Controls</h5>
            <div className="card-body">
              {/* Floorplan Status */}
              {!floorplan && (
                <div className="mb-3">
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span className="text-muted">Loading floorplan data...</span>
                </div>
              )}

              <hr />

              {/* Scale & Dimensions */}
              <ScaleSelector
                onOpenDimensionsModal={() => setIsDimensionsModalOpen(true)}
                onScaleChange={() => setHasUnsavedChanges(true)}
              />

              {/* Rack Scale */}
              <RackScaleSelector />

              {/* Device Scale */}
              <DeviceScaleSelector />

              {/* Background Image */}
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setIsBackgroundModalOpen(true)}
                >
                  Set Background Image
                </button>
                {floorplan?.assigned_image && (
                  <small className="form-text text-muted d-block mt-1">
                    Current: {floorplan.assigned_image.name}
                  </small>
                )}
              </div>

              <hr />

              {/* Rack/Device Management */}
              <div className="mb-3">
                <label className="form-label">Rack/Device Add/Delete</label>
                <small className="form-text text-muted d-block mb-2">
                  <strong>Simple:</strong> Shows name + status only<br />
                  <strong>Advanced:</strong> Shows name + status + role + tenant
                </small>

                {/* Tabs - React controlled, no Bootstrap JS */}
                <ul className="nav nav-tabs" role="tablist">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeRackDeviceTab === 'rack' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setActiveRackDeviceTab('rack')}
                    >
                      Racks
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeRackDeviceTab === 'device' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setActiveRackDeviceTab('device')}
                    >
                      Un-Racked Devices
                    </button>
                  </li>
                </ul>

                {/* Tab Content - React conditional rendering */}
                <div className="border border-top-0 p-2">
                  {activeRackDeviceTab === 'rack' && floorplan && (
                    <RackDeviceTable
                      floorplanId={floorplan.id}
                      siteId={siteId}
                      locationId={locationId}
                      type="rack"
                      onAddSimple={handleAddSimpleRack}
                      onAddAdvanced={handleAddAdvancedRack}
                      excludeIds={mappedRackIds}
                    />
                  )}
                  {activeRackDeviceTab === 'device' && floorplan && (
                    <RackDeviceTable
                      floorplanId={floorplan.id}
                      siteId={siteId}
                      locationId={locationId}
                      type="device"
                      onAddSimple={handleAddSimpleDevice}
                      onAddAdvanced={handleAddAdvancedDevice}
                      excludeIds={mappedDeviceIds}
                    />
                  )}
                </div>
              </div>

              <hr />

              {/* Supplementary Objects */}
              <div className="mb-3">
                <label className="form-label">Supplementary Objects</label>
                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={handleAddWall}
                  >
                    Add Wall
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={handleAddArea}
                  >
                    Add Area
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success btn-sm"
                    onClick={handleAddLabel}
                  >
                    Add Label
                  </button>
                </div>
              </div>

              <hr />

              {/* Color Controls */}
              <ColorControls />

              <hr />

              {/* Display Options */}
              <DisplayOptions />

              <hr />

              {/* Zoom Controls */}
              <ZoomControls onResetZoom={handleResetZoom} />

              <hr />

              {/* Export Button */}
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm w-100"
                  onClick={() => setIsExportDialogOpen(true)}
                >
                  <i className="mdi mdi-download"></i> Export Floorplan
                </button>
              </div>

              <hr />

              {/* Save Button */}
              <div className="mb-3">
                {hasUnsavedChanges && (
                  <div className="alert alert-warning py-2 mb-2">
                    <small><strong>⚠️ Unsaved changes</strong></small>
                  </div>
                )}
                <button
                  type="button"
                  className={`btn w-100 ${hasUnsavedChanges ? 'btn-warning' : 'btn-primary'}`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      {hasUnsavedChanges ? '⚠️ Save Changes' : '✓ Saved'}
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="alert alert-info mt-3">
                <h6>Keyboard Shortcuts:</h6>
                <ul className="mb-0 small">
                  <li><kbd>Delete</kbd> - Delete selected object</li>
                  <li><kbd>Arrow Keys</kbd> - Move object</li>
                  <li><kbd>Shift</kbd> + <kbd>Arrows</kbd> - Rotate object</li>
                  <li><kbd>Alt</kbd> + <kbd>Drag</kbd> - Pan canvas</li>
                  <li><kbd>Mouse Wheel</kbd> - Zoom</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas - Right Side */}
        <div style={{ flex: '1' }}>
          <div className="card">
            <div className="card-body" id="content-container">
              {/* Konva Canvas */}
              <KonvaCanvas
                readonly={false}
                onObjectDeleted={handleObjectDeleted}
                onObjectModified={handleObjectModified}
                enableZoomPan={true}
                enableKeyboard={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dimensions Modal */}
      <DimensionsModal
        isOpen={isDimensionsModalOpen}
        onClose={() => setIsDimensionsModalOpen(false)}
        onSave={() => setHasUnsavedChanges(true)}
      />

      {/* Background Image Modal */}
      <BackgroundImageModal
        isOpen={isBackgroundModalOpen}
        onClose={() => setIsBackgroundModalOpen(false)}
      />

      {/* Export Dialog */}
      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
};
