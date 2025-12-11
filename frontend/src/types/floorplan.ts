// TypeScript interfaces matching Django models

export interface Site {
  id: number;
  name: string;
  url: string;
  slug: string;
  display: string;
}

export interface Location {
  id: number;
  name: string;
  url: string;
  slug: string;
  display: string;
  site?: Site;
}

export interface FloorplanImage {
  id: number;
  name: string;
  file: string | null;
  external_url: string | null;
  filename: string;
  comments: string;
  url: string;
  display: string;
}

export interface Floorplan {
  id: number;
  url: string;
  display: string;
  site: Site | null;
  location: Location | null;
  assigned_image: FloorplanImage | null;
  width: number | null;
  height: number | null;
  measurement_unit: 'ft' | 'm';
  canvas: CanvasJSON;
  created: string;
  last_updated: string;
}

export interface CanvasJSON {
  version?: string;
  objects: CanvasObjectJSON[];
  background?: string;
  backgroundImage?: any;
}

export interface CanvasObjectJSON {
  type: string;
  version?: string;
  originX?: string;
  originY?: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string | null;
  strokeWidth?: number;
  strokeDashArray?: null;
  strokeLineCap?: string;
  strokeDashOffset?: number;
  strokeLineJoin?: string;
  strokeUniform?: boolean;
  strokeMiterLimit?: number;
  scaleX?: number;
  scaleY?: number;
  angle?: number;
  flipX?: boolean;
  flipY?: boolean;
  opacity?: number;
  shadow?: null;
  visible?: boolean;
  backgroundColor?: string;
  fillRule?: string;
  paintFirst?: string;
  globalCompositeOperation?: string;
  skewX?: number;
  skewY?: number;
  objects?: CanvasObjectJSON[];
  custom_meta?: CustomMeta;
  _controlsVisibility?: Record<string, boolean>;
  lockMovementX?: boolean;
  lockMovementY?: boolean;
  evented?: boolean;
  selectable?: boolean;
  [key: string]: any;
}

export interface CustomMeta {
  object_type?: 'rack' | 'device' | 'wall' | 'area' | 'floorplan_boundry' | 'label';
  object_id?: number;
  object_name?: string;
  object_url?: string;
  text_type?: 'name' | 'status' | 'info';
  status?: string;
  role?: string;
  tenant?: string;
  show_status?: boolean;
  show_role?: boolean;
  show_tenant?: boolean;
  manual_color?: boolean;
  manual_text_color?: boolean;
}

export interface RackRole {
  id: number;
  name: string;
  slug: string;
  color: string;
  display: string;
}

export interface DeviceRole {
  id: number;
  name: string;
  slug: string;
  color: string;
  display: string;
}

export interface RackStatus {
  value: string;
  label: string;
}

export interface DeviceStatus {
  value: string;
  label: string;
}

export interface Tenant {
  id: number;
  name: string;
  slug: string;
  display: string;
}

export interface Rack {
  id: number;
  name: string;
  url: string;
  display: string;
  status: RackStatus;
  role: RackRole | null;
  tenant: Tenant | null;
  width: number;  // in millimeters
  outer_width: number | null;
  outer_depth: number | null;
  u_height: number;
  site?: Site;
  location?: Location;
}

export interface DeviceType {
  id: number;
  model: string;
  slug: string;
  display: string;
  manufacturer: {
    id: number;
    name: string;
    slug: string;
  };
  u_height: number;
  is_full_depth: boolean;
  front_image?: string;
  rear_image?: string;
}

export interface Device {
  id: number;
  name: string;
  url: string;
  display: string;
  status: DeviceStatus;
  device_type: DeviceType;
  device_role: DeviceRole | null;
  tenant: Tenant | null;
  site?: Site;
  location?: Location;
  rack?: Rack | null;
  position?: number | null;
  face?: string | null;
}
