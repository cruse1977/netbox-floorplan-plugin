/**
 * Canvas Constants
 * Default values for Fabric.js canvas configuration
 */

export const CANVAS_DEFAULTS = {
  GRID_SIZE: 8,
  SNAP_THRESHOLD: 5, // Reduced from 45 - less aggressive snapping
  SNAP_ANGLE: 15, // Reduced from 45 - less aggressive rotation snapping
  CORNER_SIZE: 15,
  MAX_ZOOM: 20,
  MIN_ZOOM: 0.01,
  DEFAULT_ZOOM: 1,
} as const;

export const DEFAULT_COLORS = {
  WALL: 'red',
  AREA: '#6ea8fe',
  TEXT: '#000000',
  TEXT_RACK: '#6EA8FE',
  STROKE: '#000',
  BACKGROUND: '#ffffff',
} as const;

export const OBJECT_TYPES = {
  RACK: 'rack',
  DEVICE: 'device',
  WALL: 'wall',
  AREA: 'area',
  LABEL: 'label',
  FLOORPLAN_BOUNDARY: 'floorplan_boundry', // Note: matches typo in original code
} as const;

/**
 * Control visibility settings for different object types
 */
export const CONTROLS_VISIBILITY = {
  WALL_AREA: {
    mt: true,
    mb: true,
    ml: true,
    mr: true,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: true,
  },
  RACK_DEVICE: {
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: true, // Rotation only
  },
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD = {
  DELETE: 46,
  BACKSPACE: 8,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
  SHIFT: 16,
  ALT: 18,
} as const;
