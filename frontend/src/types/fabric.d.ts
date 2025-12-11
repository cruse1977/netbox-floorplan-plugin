// Type extensions for Fabric.js to include custom properties

import 'fabric';

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

declare module 'fabric' {
  interface FabricObjectProps {
    custom_meta?: CustomMeta;
  }

  interface GroupProps {
    custom_meta?: CustomMeta;
  }

  interface RectProps {
    custom_meta?: CustomMeta;
  }

  interface ITextProps {
    custom_meta?: CustomMeta;
  }

  interface TextProps {
    custom_meta?: CustomMeta;
  }
}
