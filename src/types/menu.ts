export type MenuType = 'template' | 'custom' | 'imported';

export interface Menu {
  menu_id: string;
  user_id: string;
  menu_type: MenuType;
  menu_data: MenuData;
  created_at: string;
  updated_at: string;
  qr_code_generated: boolean;
}

export interface MenuData {
  name: string;
  category?: string;
  source?: {
    type: string;
    url: string;
    originalName?: string;
  };
  template_id?: number;
} 