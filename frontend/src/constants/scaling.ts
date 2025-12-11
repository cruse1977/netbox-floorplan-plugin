/**
 * Scaling Constants
 * Constants for unit conversion and scale factors
 */

export const SCALE_FACTORS = [50, 75, 100, 125, 150, 200] as const;

export const DEFAULT_SCALE_FACTOR = 100;

export const MEASUREMENT_UNITS = {
  FEET: 'ft',
  METERS: 'm',
  INCHES: 'in',
  CENTIMETERS: 'cm',
} as const;

/**
 * Base conversion scale: pixels per meter at 1:100 scale
 * This matches the existing conversion_scale = 100 in edit.js
 */
export const PIXELS_PER_METER_BASE = 100;

/**
 * Physical grid size options (in real-world units)
 */
export const GRID_SIZE_OPTIONS = {
  METRIC: [0.5, 1, 2, 5, 10], // meters
  IMPERIAL: [1, 2, 5, 10, 20], // feet
} as const;

export const DEFAULT_GRID_SIZE = {
  m: 1, // 1 meter
  ft: 5, // 5 feet
} as const;
