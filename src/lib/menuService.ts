import { supabase } from './supabase';
import { Menu, MenuType, MenuData } from '../types/menu';

export const menuService = {
  async createMenu(userId: string, menuType: MenuType, menuData: MenuData): Promise<Menu | null> {
    const { data, error } = await supabase
      .from('menus')
      .insert([
        {
          user_id: userId,
          menu_type: menuType,
          menu_data: menuData,
          qr_code_generated: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating menu:', error);
      return null;
    }

    return data;
  },

  async getUserMenus(userId: string): Promise<Menu[]> {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching menus:', error);
      return [];
    }

    return data || [];
  }
}; 