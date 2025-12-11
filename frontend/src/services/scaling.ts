/**
 * Scaling Service
 * Handles unit conversions and real-world to canvas pixel calculations
 */

import type { MeasurementUnit, PhysicalDimensions, CanvasDimensions } from '@/types/canvas';
import { PIXELS_PER_METER_BASE } from '@/constants/scaling';

export class ScalingService {
  /**
   * Convert real-world dimensions to canvas pixels
   *
   * @param physical - Physical dimensions with unit
   * @param scaleFactor - Scale factor (e.g., 100 for 1:100)
   * @returns Canvas dimensions in pixels
   *
   * @example
   * // Convert 50ft x 30ft at 1:100 scale
   * realWorldToCanvas({ width: 50, height: 30, unit: 'ft' }, 100)
   * // Returns: { width: 1524, height: 914.4 }
   */
  static realWorldToCanvas(
    physical: PhysicalDimensions,
    scaleFactor: number = 100
  ): CanvasDimensions {
    // First convert to meters (normalized unit)
    const widthInMeters = this.toMeters(physical.width, physical.unit);
    const heightInMeters = this.toMeters(physical.height, physical.unit);

    // Calculate display scale based on scale factor
    // At 1:100, 1 meter = 100 pixels
    // At 1:50, 1 meter = 200 pixels (larger scale, more pixels per meter)
    const displayScale = PIXELS_PER_METER_BASE * (100 / scaleFactor);

    return {
      width: parseFloat((widthInMeters * displayScale).toFixed(2)),
      height: parseFloat((heightInMeters * displayScale).toFixed(2)),
    };
  }

  /**
   * Convert canvas pixels to real-world dimensions
   *
   * @param canvas - Canvas dimensions in pixels
   * @param targetUnit - Desired output unit
   * @param scaleFactor - Scale factor (e.g., 100 for 1:100)
   * @returns Physical dimensions in target unit
   */
  static canvasToRealWorld(
    canvas: CanvasDimensions,
    targetUnit: MeasurementUnit,
    scaleFactor: number = 100
  ): PhysicalDimensions {
    const displayScale = PIXELS_PER_METER_BASE * (100 / scaleFactor);

    // Convert pixels to meters first
    const widthInMeters = canvas.width / displayScale;
    const heightInMeters = canvas.height / displayScale;

    // Convert to target unit
    return {
      width: parseFloat(this.fromMeters(widthInMeters, targetUnit).toFixed(2)),
      height: parseFloat(this.fromMeters(heightInMeters, targetUnit).toFixed(2)),
      unit: targetUnit,
    };
  }

  /**
   * Convert any unit to meters (normalized)
   *
   * @param value - Value in original unit
   * @param unit - Original unit
   * @returns Value in meters
   */
  static toMeters(value: number, unit: MeasurementUnit): number {
    switch (unit) {
      case 'm':
        return value;
      case 'ft':
        return value / 3.28084;
      case 'in':
        return value * 0.0254;
      case 'cm':
        return value / 100;
      default:
        console.warn(`Unknown unit: ${unit}, treating as meters`);
        return value;
    }
  }

  /**
   * Convert meters to any unit
   *
   * @param meters - Value in meters
   * @param targetUnit - Target unit
   * @returns Value in target unit
   */
  static fromMeters(meters: number, targetUnit: MeasurementUnit): number {
    switch (targetUnit) {
      case 'm':
        return meters;
      case 'ft':
        return meters * 3.28084;
      case 'in':
        return meters / 0.0254;
      case 'cm':
        return meters * 100;
      default:
        console.warn(`Unknown unit: ${targetUnit}, returning meters`);
        return meters;
    }
  }

  /**
   * Calculate grid size for snapping (in pixels)
   *
   * @param physicalGridSize - Grid size in real-world units (e.g., 1 meter, 5 feet)
   * @param physicalUnit - Unit of physical grid size
   * @param scaleFactor - Scale factor
   * @returns Grid size in pixels
   */
  static getGridSize(
    physicalGridSize: number,
    physicalUnit: MeasurementUnit,
    scaleFactor: number
  ): number {
    const gridInMeters = this.toMeters(physicalGridSize, physicalUnit);
    const displayScale = PIXELS_PER_METER_BASE * (100 / scaleFactor);
    return gridInMeters * displayScale;
  }

  /**
   * Convert rack/device dimensions from millimeters to canvas pixels
   * This matches the existing conversion logic in edit.js lines 292-308
   *
   * @param widthMM - Width in millimeters
   * @param heightMM - Height in millimeters or depth
   * @param scaleFactor - Scale factor
   * @returns Dimensions in pixels
   */
  static rackDimensionsToCanvas(
    widthMM: number,
    heightMM: number,
    scaleFactor: number = 100
  ): { width: number; height: number } {
    // Convert mm to meters
    const widthM = widthMM / 1000;
    const heightM = heightMM / 1000;

    const displayScale = PIXELS_PER_METER_BASE * (100 / scaleFactor);

    return {
      width: widthM * displayScale,
      height: heightM * displayScale,
    };
  }

  /**
   * Convert device dimensions from millimeters to canvas pixels using device-specific scale
   *
   * @param widthMM - Width in millimeters
   * @param heightMM - Height in millimeters or depth
   * @param deviceScaleFactor - Device-specific scale factor (independent from floorplan scale)
   * @returns Dimensions in pixels
   */
  static deviceDimensionsToCanvas(
    widthMM: number,
    heightMM: number,
    deviceScaleFactor: number = 100
  ): { width: number; height: number } {
    // Convert mm to meters
    const widthM = widthMM / 1000;
    const heightM = heightMM / 1000;

    const displayScale = PIXELS_PER_METER_BASE * (100 / deviceScaleFactor);

    return {
      width: widthM * displayScale,
      height: heightM * displayScale,
    };
  }

  /**
   * Format dimension for display
   *
   * @param value - Numeric value
   * @param unit - Unit
   * @param precision - Decimal places
   * @returns Formatted string (e.g., "50 ft" or "15.24 m")
   */
  static formatDimension(
    value: number,
    unit: MeasurementUnit,
    precision: number = 2
  ): string {
    return `${value.toFixed(precision)} ${unit}`;
  }

  /**
   * Get scale factor display string
   *
   * @param scaleFactor - Scale factor
   * @returns Display string (e.g., "1:100")
   */
  static formatScale(scaleFactor: number): string {
    return `1:${scaleFactor}`;
  }

  /**
   * Calculate optimal scale factor based on canvas size and physical dimensions
   * Useful for auto-fitting floorplans to viewport
   *
   * @param canvasWidth - Available canvas width in pixels
   * @param canvasHeight - Available canvas height in pixels
   * @param physical - Physical dimensions
   * @returns Suggested scale factor
   */
  static calculateOptimalScale(
    canvasWidth: number,
    canvasHeight: number,
    physical: PhysicalDimensions
  ): number {
    const widthInMeters = this.toMeters(physical.width, physical.unit);
    const heightInMeters = this.toMeters(physical.height, physical.unit);

    // Calculate scale factor that fits both dimensions
    const scaleForWidth = (widthInMeters * PIXELS_PER_METER_BASE * 100) / canvasWidth;
    const scaleForHeight = (heightInMeters * PIXELS_PER_METER_BASE * 100) / canvasHeight;

    // Use the larger scale factor (smaller display) to ensure both fit
    const suggestedScale = Math.max(scaleForWidth, scaleForHeight);

    // Round to nearest standard scale factor
    const standardScales = [50, 75, 100, 125, 150, 200];
    return standardScales.reduce((prev, curr) =>
      Math.abs(curr - suggestedScale) < Math.abs(prev - suggestedScale) ? curr : prev
    );
  }
}
