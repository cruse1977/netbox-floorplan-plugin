// API request/response types

import type { Floorplan, FloorplanImage, Rack, Device } from './floorplan';

export interface APIResponse<T> {
  data: T;
}

export interface APIListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FloorplanListResponse extends APIListResponse<Floorplan> {}

export interface RackListResponse extends APIListResponse<Rack> {}

export interface DeviceListResponse extends APIListResponse<Device> {}

export interface FloorplanImageListResponse extends APIListResponse<FloorplanImage> {}

export interface FloorplanUpdateRequest {
  canvas?: any;
  width?: number;
  height?: number;
  measurement_unit?: 'ft' | 'm';
  assigned_image?: number | null;
}

export interface APIError {
  detail?: string;
  [key: string]: any;
}

// Export options
export interface ExportOptions {
  format: 'svg' | 'png' | 'jpeg' | 'pdf';
  filename: string;
  quality?: number; // 0-1 for JPEG
  scale?: number;   // Resolution multiplier for raster
  includeBackground?: boolean;
  paperSize?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
}
