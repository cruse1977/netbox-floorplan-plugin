/**
 * Canvas Service for Konva
 * High-level operations for canvas management with Konva
 */

import {
  createWall,
  createArea,
  createLabel,
  createSimpleRack,
  createAdvancedRack,
  createSimpleDevice,
  createAdvancedDevice,
  createFloorplanBoundary,
} from '@/utils/konvaHelpers';
import type { CanvasObject } from '@/utils/konvaHelpers';
import { ScalingService } from './scaling';
import type { Rack, Device } from '@/types/floorplan';
import type { MeasurementUnit } from '@/types/canvas';
import { useFloorplanStore } from '@/store/floorplanStore';

export class KonvaCanvasService {
  /**
   * Add a wall to the canvas
   */
  static addWall(): CanvasObject {
    const wall = createWall();
    useFloorplanStore.getState().addCanvasObject(wall);
    return wall;
  }

  /**
   * Add an area to the canvas
   */
  static addArea(): CanvasObject {
    const area = createArea();
    useFloorplanStore.getState().addCanvasObject(area);
    return area;
  }

  /**
   * Add a text label to the canvas
   */
  static addLabel(text: string = 'Label', color?: string): CanvasObject {
    const label = createLabel(text, color);
    useFloorplanStore.getState().addCanvasObject(label);
    return label;
  }

  /**
   * Add a simple rack to the canvas
   */
  static addSimpleRack(
    rack: Rack,
    rackScaleFactor: number = 100,
    color?: string
  ): CanvasObject {
    // Convert rack dimensions from millimeters to canvas pixels
    const dimensions = ScalingService.rackDimensionsToCanvas(
      rack.outer_width || 600,
      rack.outer_depth || 800,
      rackScaleFactor
    );

    const rackObj = createSimpleRack(rack, dimensions, color);
    useFloorplanStore.getState().addCanvasObject(rackObj);
    return rackObj;
  }

  /**
   * Add an advanced rack to the canvas
   */
  static addAdvancedRack(
    rack: Rack,
    rackScaleFactor: number = 100,
    color?: string
  ): CanvasObject {
    const dimensions = ScalingService.rackDimensionsToCanvas(
      rack.outer_width || 600,
      rack.outer_depth || 800,
      rackScaleFactor
    );

    const rackObj = createAdvancedRack(rack, dimensions, color);
    useFloorplanStore.getState().addCanvasObject(rackObj);
    return rackObj;
  }

  /**
   * Add a simple device to the canvas
   */
  static addSimpleDevice(
    device: Device,
    deviceScaleFactor: number = 100,
    color?: string
  ): CanvasObject {
    const widthMM = 482.6; // Standard 19" rack width
    const depthMM = 600; // Default depth

    const dimensions = ScalingService.deviceDimensionsToCanvas(
      widthMM,
      depthMM,
      deviceScaleFactor
    );

    const deviceObj = createSimpleDevice(device, dimensions, color);
    useFloorplanStore.getState().addCanvasObject(deviceObj);
    return deviceObj;
  }

  /**
   * Add an advanced device to the canvas
   */
  static addAdvancedDevice(
    device: Device,
    deviceScaleFactor: number = 100,
    color?: string
  ): CanvasObject {
    const widthMM = 482.6;
    const depthMM = 600;

    const dimensions = ScalingService.deviceDimensionsToCanvas(
      widthMM,
      depthMM,
      deviceScaleFactor
    );

    const deviceObj = createAdvancedDevice(device, dimensions, color);
    useFloorplanStore.getState().addCanvasObject(deviceObj);
    return deviceObj;
  }

  /**
   * Set up floorplan boundary
   */
  static setFloorplanBoundary(
    width: number,
    height: number,
    measurementUnit: MeasurementUnit,
    scaleFactor: number
  ): CanvasObject {
    const store = useFloorplanStore.getState();

    // Remove ALL existing boundaries
    const existingBoundaries = store.canvasObjects.filter(
      (obj) => obj.type === 'floorplan_boundary'
    );

    existingBoundaries.forEach((boundary) => {
      store.removeCanvasObject(boundary.id);
    });

    // Convert physical dimensions to canvas pixels
    const canvasDims = ScalingService.realWorldToCanvas(
      { width, height, unit: measurementUnit },
      scaleFactor
    );

    // Create new boundary
    const boundary = createFloorplanBoundary(canvasDims.width, canvasDims.height);
    store.addCanvasObject(boundary);

    return boundary;
  }

  /**
   * Get all racks on canvas
   */
  static getRacks(): CanvasObject[] {
    return useFloorplanStore.getState().canvasObjects.filter(
      (obj) => obj.type === 'rack'
    );
  }

  /**
   * Get all devices on canvas
   */
  static getDevices(): CanvasObject[] {
    return useFloorplanStore.getState().canvasObjects.filter(
      (obj) => obj.type === 'device'
    );
  }

  /**
   * Get mapped rack IDs (racks already on canvas)
   */
  static getMappedRackIds(): number[] {
    return this.getRacks()
      .map((obj: any) => obj.rackId)
      .filter((id): id is number => typeof id === 'number');
  }

  /**
   * Get mapped device IDs (devices already on canvas)
   */
  static getMappedDeviceIds(): number[] {
    return this.getDevices()
      .map((obj: any) => obj.deviceId)
      .filter((id): id is number => typeof id === 'number');
  }

  /**
   * Scale all object positions when floorplan scale changes
   * This maintains the relative position of objects to the boundary
   */
  static scaleObjectPositions(oldScale: number, newScale: number): void {
    const store = useFloorplanStore.getState();
    // Lower scale number = larger display (1:50 is larger than 1:100)
    // So going from 100 to 50 means 2x larger, ratio = 100/50 = 2
    const ratio = oldScale / newScale;

    // Create a new array with updated positions
    const updatedObjects = store.canvasObjects.map((obj) => {
      if (obj.type !== 'floorplan_boundary') {
        const newX = obj.x * ratio;
        const newY = obj.y * ratio;
        return { ...obj, x: newX, y: newY };
      }
      return obj;
    });

    // Replace all objects at once to trigger React re-render
    store.setCanvasObjects(updatedObjects);
  }
}
