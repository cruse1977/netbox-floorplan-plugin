// Canvas-specific types

import * as fabric from 'fabric';

export type MeasurementUnit = 'ft' | 'm' | 'in' | 'cm';

export interface ScaleConfig {
  measurementUnit: MeasurementUnit;
  realWorldWidth: number;  // e.g., 50 ft
  realWorldHeight: number; // e.g., 30 ft
  scaleFactor: number;     // e.g., 100 = 1:100 scale
  displayScale: number;    // Conversion factor to canvas pixels
}

export interface PhysicalDimensions {
  width: number;
  height: number;
  unit: MeasurementUnit;
}

export interface CanvasDimensions {
  width: number;  // pixels
  height: number; // pixels
}

export interface CanvasObject {
  id: string;
  type: 'rack' | 'device' | 'wall' | 'area' | 'label' | 'floorplan_boundry';
  fabricObject: fabric.Object;
  metadata: {
    objectId?: number;
    objectName?: string;
    objectUrl?: string;
    status?: string;
    role?: string;
    tenant?: string;
  };
}

export interface ZoomPanState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
}

export interface SelectionState {
  selectedObjectIds: string[];
  activeObject: fabric.Object | null;
  activeSelection: fabric.ActiveSelection | null;
}
