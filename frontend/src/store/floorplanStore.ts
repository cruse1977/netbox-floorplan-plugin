/**
 * Floorplan Store
 * Central state management using Zustand
 */

import { create } from 'zustand';
import type Konva from 'konva';
import type { Floorplan } from '@/types/floorplan';
import type { MeasurementUnit } from '@/types/canvas';
import type { CanvasObject } from '@/utils/konvaHelpers';
import { apiClient } from '@/services/api';

interface FloorplanState {
  // Core data
  floorplanId: number | null;
  floorplan: Floorplan | null;
  canvas: Konva.Stage | null;
  canvasObjects: CanvasObject[];
  siteId: number | null;
  locationId: number | null;
  recordType: 'site' | 'location' | null;

  // Dimensions & Scaling
  width: number | null;
  height: number | null;
  measurementUnit: MeasurementUnit;
  scaleFactor: number;
  rackScaleFactor: number; // Separate scale factor for racks
  deviceScaleFactor: number; // Separate scale factor for devices

  // UI State
  selectedObjectIds: string[];
  zoom: number;
  isDragging: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Display options (for advanced racks/devices)
  showStatus: boolean;
  showRole: boolean;
  showTenant: boolean;

  // Color selections
  objectColor: string;
  textColor: string;

  // Actions
  setFloorplan: (floorplan: Floorplan) => void;
  setCanvas: (canvas: Konva.Stage | null) => void;
  addCanvasObject: (object: CanvasObject) => void;
  removeCanvasObject: (id: string) => void;
  updateCanvasObject: (id: string, updates: Partial<CanvasObject>) => void;
  clearCanvasObjects: () => void;
  setCanvasObjects: (objects: CanvasObject[]) => void;
  setSelectedObjects: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  setDimensions: (width: number, height: number, unit: MeasurementUnit) => void;
  setScaleFactor: (factor: number) => void;
  setRackScaleFactor: (factor: number) => void;
  setDeviceScaleFactor: (factor: number) => void;
  setDisplayOptions: (options: {
    showStatus?: boolean;
    showRole?: boolean;
    showTenant?: boolean;
  }) => void;
  setObjectColor: (color: string) => void;
  setTextColor: (color: string) => void;
  setIsDragging: (isDragging: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  loadFloorplan: (id: number) => Promise<void>;
  saveFloorplan: () => Promise<void>;
  updateDimensions: (
    width: number,
    height: number,
    unit: MeasurementUnit
  ) => Promise<void>;
  updateBackground: (imageId: number | null) => Promise<void>;

  // Initialization
  initialize: (data: {
    floorplanId: number;
    siteId: number | null;
    locationId: number | null;
    recordType: 'site' | 'location';
  }) => void;
}

export const useFloorplanStore = create<FloorplanState>((set, get) => ({
  // Initial state
  floorplanId: null,
  floorplan: null,
  canvas: null,
  canvasObjects: [],
  siteId: null,
  locationId: null,
  recordType: null,

  width: null,
  height: null,
  measurementUnit: 'm',
  scaleFactor: 100,
  rackScaleFactor: 100,
  deviceScaleFactor: 100,

  selectedObjectIds: [],
  zoom: 1,
  isDragging: false,
  isLoading: false,
  isSaving: false,
  error: null,

  showStatus: true,
  showRole: true,
  showTenant: true,

  objectColor: '#000000',
  textColor: '#000000',

  // Simple setters
  setFloorplan: (floorplan) => {
    set({
      floorplan,
      floorplanId: floorplan.id,
      width: floorplan.width,
      height: floorplan.height,
      measurementUnit: floorplan.measurement_unit,
    });
  },

  setCanvas: (canvas) => set({ canvas }),

  addCanvasObject: (object) =>
    set((state) => ({ canvasObjects: [...state.canvasObjects, object] })),

  removeCanvasObject: (id) =>
    set((state) => ({
      canvasObjects: state.canvasObjects.filter((obj) => obj.id !== id),
    })),

  updateCanvasObject: (id, updates) =>
    set((state) => ({
      canvasObjects: state.canvasObjects.map((obj) =>
        obj.id === id ? ({ ...obj, ...updates } as CanvasObject) : obj
      ),
    })),

  clearCanvasObjects: () => set({ canvasObjects: [] }),

  setCanvasObjects: (objects) => set({ canvasObjects: objects }),

  setSelectedObjects: (ids) => set({ selectedObjectIds: ids }),

  setZoom: (zoom) => set({ zoom }),

  setDimensions: (width, height, unit) =>
    set({ width, height, measurementUnit: unit }),

  setScaleFactor: (factor) => set({ scaleFactor: factor }),

  setRackScaleFactor: (factor) => set({ rackScaleFactor: factor }),

  setDeviceScaleFactor: (factor) => set({ deviceScaleFactor: factor }),

  setDisplayOptions: (options) => set(options),

  setObjectColor: (color) => set({ objectColor: color }),

  setTextColor: (color) => set({ textColor: color }),

  setIsDragging: (isDragging) => set({ isDragging }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  // Initialize with data from Django template
  initialize: (data) => {
    set({
      floorplanId: data.floorplanId,
      siteId: data.siteId,
      locationId: data.locationId,
      recordType: data.recordType,
    });
  },

  // Load floorplan data from API
  loadFloorplan: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{ results: Floorplan[] }>(
        `/floorplans/?id=${id}`
      );

      if (response.results && response.results.length > 0) {
        const floorplan = response.results[0];

        // Parse canvas objects if they exist
        let loadedObjects: CanvasObject[] = [];
        if (floorplan.canvas) {
          try {
            // Canvas can be either a string or object
            const canvasData = typeof floorplan.canvas === 'string'
              ? JSON.parse(floorplan.canvas)
              : floorplan.canvas;

            // Extract objects array
            if (canvasData && canvasData.objects && Array.isArray(canvasData.objects)) {
              loadedObjects = canvasData.objects as CanvasObject[];
            }
          } catch (parseError) {
            console.error('Failed to parse canvas JSON:', parseError);
          }
        }

        set({
          floorplan,
          floorplanId: floorplan.id,
          width: floorplan.width,
          height: floorplan.height,
          measurementUnit: floorplan.measurement_unit,
          canvasObjects: loadedObjects,
          isLoading: false,
        });
      } else {
        throw new Error('Floorplan not found');
      }
    } catch (error) {
      console.error('Failed to load floorplan:', error);
      set({
        error: 'Failed to load floorplan',
        isLoading: false,
      });
      throw error;
    }
  },

  // Save floorplan canvas and dimensions to API
  saveFloorplan: async () => {
    const { canvasObjects, floorplanId, width, height, measurementUnit } = get();

    if (!floorplanId) {
      console.warn('Cannot save: floorplanId is null');
      return;
    }

    set({ isSaving: true, error: null });

    try {
      // Serialize canvas objects as JSON
      // Convert to a format compatible with the backend
      const canvasJSON = {
        version: '6.0.0', // Maintain compatibility with Fabric format
        objects: canvasObjects,
      };


      // Build payload with canvas and dimensions
      const payload: any = {
        canvas: canvasJSON,
      };

      // Include dimensions if they exist
      if (width && height && measurementUnit) {
        payload.width = width;
        payload.height = height;
        payload.measurement_unit = measurementUnit;
      }

      await apiClient.patch(`/floorplans/${floorplanId}/`, payload);

      set({ isSaving: false });
    } catch (error) {
      console.error('Failed to save floorplan:', error);
      set({
        error: 'Failed to save floorplan',
        isSaving: false,
      });
      throw error;
    }
  },

  // Update floorplan dimensions
  updateDimensions: async (
    width: number,
    height: number,
    unit: MeasurementUnit
  ) => {
    const { floorplanId, canvasObjects } = get();

    if (!floorplanId) {
      console.warn('Cannot update dimensions: floorplanId is null');
      return;
    }

    set({ isSaving: true, error: null });

    try {
      // Serialize canvas objects
      const canvasJSON = {
        version: '6.0.0',
        objects: canvasObjects,
      };

      await apiClient.patch(`/floorplans/${floorplanId}/`, {
        width,
        height,
        measurement_unit: unit,
        canvas: canvasJSON,
      });

      set({
        width,
        height,
        measurementUnit: unit,
        isSaving: false,
      });
    } catch (error: any) {
      console.error('Failed to update dimensions:', error);
      console.error('API Error Response:', error.response?.data);
      set({
        error: 'Failed to update dimensions',
        isSaving: false,
      });
      throw error;
    }
  },

  // Update background image
  updateBackground: async (imageId: number | null) => {
    const { floorplanId, canvasObjects } = get();

    if (!floorplanId) {
      console.warn('Cannot update background: floorplanId is null');
      return;
    }

    set({ isSaving: true, error: null });

    try {
      // Include canvas to prevent validation errors
      const canvasJSON = {
        version: '6.0.0',
        objects: canvasObjects,
      };

      await apiClient.patch(`/floorplans/${floorplanId}/`, {
        assigned_image: imageId,
        canvas: canvasJSON,
      });

      set({ isSaving: false });

      // Reload floorplan to get updated background
      await get().loadFloorplan(floorplanId);
    } catch (error) {
      console.error('Failed to update background:', error);
      set({
        error: 'Failed to update background',
        isSaving: false,
      });
      throw error;
    }
  },
}));
