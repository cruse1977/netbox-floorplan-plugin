/**
 * Konva Helper Functions
 * Functions to create Konva object configurations
 */

import type { Rack, Device } from '@/types/floorplan';

// Object types for type discrimination
export type CanvasObjectType =
  | 'wall'
  | 'area'
  | 'label'
  | 'rack'
  | 'device'
  | 'floorplan_boundary';

// Base interface for all canvas objects
export interface BaseCanvasObject {
  id: string;
  type: CanvasObjectType;
  x: number;
  y: number;
  draggable: boolean;
}

// Wall object
export interface WallObject extends BaseCanvasObject {
  type: 'wall';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

// Area object
export interface AreaObject extends BaseCanvasObject {
  type: 'area';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
}

// Label object
export interface LabelObject extends BaseCanvasObject {
  type: 'label';
  text: string;
  fontSize: number;
  fill: string;
  fontFamily: string;
}

// Rack object
export interface RackObject extends BaseCanvasObject {
  type: 'rack';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rackId: number;
  rackName: string;
  rackData: Rack;
  labels: {
    name: string;
    status?: string;
    role?: string;
    tenant?: string;
  };
}

// Device object
export interface DeviceObject extends BaseCanvasObject {
  type: 'device';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  deviceId: number;
  deviceName: string;
  deviceData: Device;
  labels: {
    name: string;
    status?: string;
    role?: string;
    tenant?: string;
  };
}

// Boundary object
export interface BoundaryObject extends BaseCanvasObject {
  type: 'floorplan_boundary';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  draggable: boolean;
}

// Union type of all canvas objects
export type CanvasObject =
  | WallObject
  | AreaObject
  | LabelObject
  | RackObject
  | DeviceObject
  | BoundaryObject;

// Helper to generate unique IDs
let idCounter = 0;
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${idCounter++}`;
}

// Default colors
export const DEFAULT_COLORS = {
  WALL: '#6c757d',
  AREA: '#0d6efd',
  TEXT: '#000000',
  RACK: '#28a745',
  DEVICE: '#17a2b8',
  BOUNDARY: '#dee2e6',
};

// Status colors (from Fabric helpers)
const STATUS_COLORS: Record<string, string> = {
  active: '#28a745',
  planned: '#6c757d',
  staged: '#17a2b8',
  failed: '#dc3545',
  decommissioning: '#ffc107',
  offline: '#6c757d',
};

/**
 * Create a wall object
 */
export function createWall(): WallObject {
  return {
    id: generateId('wall'),
    type: 'wall',
    x: 100,
    y: 100,
    width: 10,
    height: 100,
    fill: DEFAULT_COLORS.WALL,
    stroke: '#000000',
    strokeWidth: 1,
    draggable: true,
  };
}

/**
 * Create an area object
 */
export function createArea(): AreaObject {
  return {
    id: generateId('area'),
    type: 'area',
    x: 100,
    y: 100,
    width: 100,
    height: 100,
    fill: DEFAULT_COLORS.AREA,
    stroke: '#0d6efd',
    strokeWidth: 2,
    opacity: 0.3,
    draggable: true,
  };
}

/**
 * Create a label object
 */
export function createLabel(text: string = 'Label', color?: string): LabelObject {
  return {
    id: generateId('label'),
    type: 'label',
    x: 100,
    y: 100,
    text,
    fontSize: 16,
    fill: color || DEFAULT_COLORS.TEXT,
    fontFamily: 'Arial',
    draggable: true,
  };
}

/**
 * Create a simple rack object
 */
export function createSimpleRack(
  rack: Rack,
  dimensions: { width: number; height: number },
  color?: string
): RackObject {
  const statusColor = color || STATUS_COLORS[rack.status?.value] || DEFAULT_COLORS.RACK;

  return {
    id: generateId('rack'),
    type: 'rack',
    x: 100,
    y: 100,
    width: dimensions.width,
    height: dimensions.height,
    fill: statusColor,
    stroke: '#000000',
    strokeWidth: 2,
    rackId: rack.id,
    rackName: rack.name,
    rackData: rack,
    labels: {
      name: rack.name,
      status: rack.status?.label,
    },
    draggable: true,
  };
}

/**
 * Create an advanced rack object (with more labels)
 */
export function createAdvancedRack(
  rack: Rack,
  dimensions: { width: number; height: number },
  color?: string
): RackObject {
  const statusColor = color || STATUS_COLORS[rack.status?.value] || DEFAULT_COLORS.RACK;

  return {
    id: generateId('rack'),
    type: 'rack',
    x: 100,
    y: 100,
    width: dimensions.width,
    height: dimensions.height,
    fill: statusColor,
    stroke: '#000000',
    strokeWidth: 2,
    rackId: rack.id,
    rackName: rack.name,
    rackData: rack,
    labels: {
      name: rack.name,
      status: rack.status?.label,
      role: rack.role?.name,
      tenant: rack.tenant?.name,
    },
    draggable: true,
  };
}

/**
 * Create a simple device object
 */
export function createSimpleDevice(
  device: Device,
  dimensions: { width: number; height: number },
  color?: string
): DeviceObject {
  const statusColor = color || STATUS_COLORS[device.status?.value] || DEFAULT_COLORS.DEVICE;

  return {
    id: generateId('device'),
    type: 'device',
    x: 100,
    y: 100,
    width: dimensions.width,
    height: dimensions.height,
    fill: statusColor,
    stroke: '#000000',
    strokeWidth: 2,
    deviceId: device.id,
    deviceName: device.name || 'Unnamed Device',
    deviceData: device,
    labels: {
      name: device.name || 'Unnamed Device',
      status: device.status?.label,
    },
    draggable: true,
  };
}

/**
 * Create an advanced device object (with more labels)
 */
export function createAdvancedDevice(
  device: Device,
  dimensions: { width: number; height: number },
  color?: string
): DeviceObject {
  const statusColor = color || STATUS_COLORS[device.status?.value] || DEFAULT_COLORS.DEVICE;

  return {
    id: generateId('device'),
    type: 'device',
    x: 100,
    y: 100,
    width: dimensions.width,
    height: dimensions.height,
    fill: statusColor,
    stroke: '#000000',
    strokeWidth: 2,
    deviceId: device.id,
    deviceName: device.name || 'Unnamed Device',
    deviceData: device,
    labels: {
      name: device.name || 'Unnamed Device',
      status: device.status?.label,
      role: device.device_role?.name,
      tenant: device.tenant?.name,
    },
    draggable: true,
  };
}

/**
 * Create a floorplan boundary
 */
export function createFloorplanBoundary(
  width: number,
  height: number
): BoundaryObject {
  return {
    id: 'floorplan_boundary',
    type: 'floorplan_boundary',
    x: 0,
    y: 0,
    width,
    height,
    fill: 'transparent',
    stroke: DEFAULT_COLORS.BOUNDARY,
    strokeWidth: 2,
    draggable: true,
  };
}
